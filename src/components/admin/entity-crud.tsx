"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { EntityConfig, FieldConfig } from "@/lib/admin-entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState, Spinner } from "@/components/site/primitives";
import { toast } from "sonner";

type Row = Record<string, unknown> & { _id: string };

function asRow(v: unknown): Row | null {
  if (typeof v !== "object" || v === null) return null;
  return v as Row;
}

export function EntityCRUD({ entity }: { entity: EntityConfig }) {
  const rawRows = useQuery(api.admin.adminList, { table: entity.table as never });
  const rows: Row[] | undefined = rawRows === undefined ? undefined : (rawRows as unknown[]).map(asRow).filter((r): r is Row => r !== null);
  const create = useMutation(api.admin.adminCreate);
  const update = useMutation(api.admin.adminUpdate);
  const remove = useMutation(api.admin.adminDelete);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      entity.columns.some((c) => String(r[c.name] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, search, entity.columns]);

  async function onDelete() {
    if (!deleting) return;
    try {
      await remove({ table: entity.table as never, id: deleting._id as never });
      toast.success("حذف شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق بود");
    } finally {
      setDeleting(null);
    }
  }

  const open = creating || editing !== null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{entity.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows === undefined ? "…" : `${rows.length} مورد`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" aria-hidden />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو…" className="w-44 pl-8" aria-label={`جستجو در ${entity.title}`} />
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" aria-hidden /> افزودن {entity.singular}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {rows === undefined ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState
            title={search ? "نتیجه‌ای یافت نشد" : `${entity.title} خالی است`}
            hint={search ? "عبارت دیگری را جستجو کنید." : `اولین ${entity.singular} را اضافه کنید.`}
          />
        ) : (
          <div className="card-quiet overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {entity.columns.map((c) => (
                    <TableHead key={c.name}>{c.label}</TableHead>
                  ))}
                  <TableHead className="w-24 text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row._id}>
                    {entity.columns.map((c) => (
                      <TableCell key={c.name} className="max-w-64 truncate">{formatCell(row[c.name])}</TableCell>
                    ))}
                    <TableCell className="text-left">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(row)} aria-label={`ویرایش`}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleting(row)} aria-label="حذف" className="text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <EntityFormDialog
        entity={entity}
        row={editing}
        open={open}
        onClose={() => { setCreating(false); setEditing(null); }}
        create={create}
        update={update}
      />

      <Dialog open={deleting !== null} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>حذف {entity.singular}</DialogTitle>
            <DialogDescription>این عملیات قابل بازگشت نیست.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>انصراف</Button>
            <Button variant="destructive" onClick={onDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === undefined || v === null) return "—";
  if (typeof v === "boolean") return v ? "بله" : "خیر";
  return String(v);
}

function EntityFormDialog({
  entity, row, open, onClose, create, update,
}: {
  entity: EntityConfig;
  row: Row | null;
  open: boolean;
  onClose: () => void;
  create: ReturnType<typeof useMutation<typeof api.admin.adminCreate>>;
  update: ReturnType<typeof useMutation<typeof api.admin.adminUpdate>>;
}) {
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const key = row ? row._id : open ? "new" : null;
  if (key !== loadedFor) {
    const next: Record<string, string | boolean> = {};
    for (const f of entity.fields) {
      const v = row ? row[f.name] : undefined;
      next[f.name] = typeof v === "boolean" ? v : v === undefined || v === null ? "" : String(v);
    }
    setValues(next);
    setLoadedFor(key);
  }

  async function onSave() {
    for (const f of entity.fields) {
      if (f.required && !String(values[f.name] ?? "").trim()) {
        setError(`«${f.label}» الزامی است.`);
        return;
      }
    }
    setSaving(true);
    setError(null);
    const data: Record<string, unknown> = {};
    for (const f of entity.fields) {
      const raw = values[f.name];
      if (f.type === "number") data[f.name] = raw === "" ? undefined : Number(raw);
      else if (f.type === "switch") data[f.name] = Boolean(raw);
      else data[f.name] = String(raw ?? "").trim();
    }
    try {
      if (row) {
        await update({ table: entity.table as never, id: row._id as never, data });
        toast.success("ذخیره شد");
      } else {
        await create({ table: entity.table as never, data });
        toast.success("افزوده شد");
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{row ? `ویرایش ${entity.singular}` : `افزودن ${entity.singular}`}</DialogTitle>
          <DialogDescription>فیلدهای ستاره‌دار الزامی هستند.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {entity.fields.map((f) => (
            <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
          ))}
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>انصراف</Button>
          <Button onClick={onSave} disabled={saving}>{saving ? "در حال ذخیره…" : "ذخیره"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldInput({ field, value, onChange }: {
  field: FieldConfig;
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
}) {
  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between rounded-md border p-3">
        <Label htmlFor={`f-${field.name}`}>{field.label}</Label>
        <Switch id={`f-${field.name}`} checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div className="grid gap-1.5">
        <Label htmlFor={`f-${field.name}`}>{field.label}{field.required ? " *" : ""}</Label>
        <Textarea id={`f-${field.name}`} rows={4} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div className="grid gap-1.5">
        <Label htmlFor={`f-${field.name}`}>{field.label}{field.required ? " *" : ""}</Label>
        <select
          id={`f-${field.name}`}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          <option value="">— انتخاب کنید —</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={`f-${field.name}`}>{field.label}{field.required ? " *" : ""}</Label>
      <Input
        id={`f-${field.name}`}
        type={field.type === "number" ? "number" : "text"}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    </div>
  );
}
