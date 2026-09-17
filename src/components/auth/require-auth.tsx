/**
 * @deprecated Server-side guards (requireAdminUser / requirePortalUser) now
 * protect /admin and /portal. This component only renders children so legacy
 * imports keep working; it adds no security.
 */
export function RequireAuth({ children }: { children: React.ReactNode; adminOnly?: boolean }) {
  return <>{children}</>;
}
