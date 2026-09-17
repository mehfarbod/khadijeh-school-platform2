import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";
import { schoolTables } from "./school";
import { schoolTablesExtra } from "./schoolExtra";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  CONTENT_MANAGER: "content_manager",
  STUDENT: "student",
  PARENT: "parent",
  STAFF: "staff",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.SUPER_ADMIN),
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.CONTENT_MANAGER),
  v.literal(ROLES.STUDENT),
  v.literal(ROLES.PARENT),
  v.literal(ROLES.STAFF),
);
export type Role = Infer<typeof roleValidator>;

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.CONTENT_MANAGER,
] as const;

const schema = defineSchema(
  {
    ...authTables,
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),
    ...schoolTables,
    ...schoolTablesExtra,
  },
  { schemaValidation: false },
);

export default schema;
