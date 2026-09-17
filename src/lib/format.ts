export function toFa(input: string | number | undefined | null): string {
  if (input === undefined || input === null || input === "") return "";
  const digits = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/[0-9]/g, (d) => digits[Number(d)]);
}

export function faNum(n: number | undefined | null): string {
  return toFa(n ?? "");
}

export function excerpt(text: string | undefined, len = 110): string {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > len ? t.slice(0, len) + "…" : t;
}
