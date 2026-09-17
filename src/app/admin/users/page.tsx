"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner, EmptyState } from "@/components/site/primitives";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type UserRow = { id: string; email: string; name: string | null; role: string };

const ROLES = [
  { value: "SUPER_ADMIN", label: "مدیر ارشد" },
  { value: "SCHOOL_ADMIN", label: "مدیر مدرسه" },
  { value: "CONTENT_MANAGER", label: "مدیر محتوا" },
  { value: "STUDENT", label: "دانش‌آموز" },
  { value: "PARENT", label: "ولی" },
  { value: "STAFF", label: "کادر" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[] | undefined>(undefined);
  const [myRole, setMyRole] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setUsers(undefined);
    try {
      const [usersRes, meRes] = await Promise.all([fetch("/api/admin/users"), fetch("/api/auth/me")]);
      const usersJson = await usersRes.json();
      if (!usersRes.ok) throw new Error(usersJson.error ?? "خطا");
      const meJson = await meRes.json();
      setMyRole(meJson.user?.role ?? null);
      setUsers(usersJson.users ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در دریافت کاربران");
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function setRole(userId: string, role: string) {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "تغییر نقش ناموفق بود");
      toast.success("نقش به‌روزرسانی شد");
      void refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تغییر نقش ناموفق بود");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">کاربران</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        مدیریت حساب‌های کاربری و نقش‌ها. تغییر نقش فقط توسط مدیر ارشد مجاز است.
      </p>
      <div className="mt-6">
        {users === undefined ? <Spinner /> : users.length === 0 ? (
          <EmptyState title="هنوز کاربری ثبت نشده است" />
        ) : (
          <div className="card-quiet overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام</TableHead>
                  <TableHead>رایانامه</TableHead>
                  <TableHead>نقش</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name ?? "—"}</TableCell>
                    <TableCell dir="ltr">{u.email}</TableCell>
                    <TableCell>
                      {myRole === "SUPER_ADMIN" ? (
                        <Select value={u.role} onValueChange={(v) => setRole(u.id, v)}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => (
                              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        ROLES.find((r) => r.value === u.role)?.label ?? u.role
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
