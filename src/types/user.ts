
import { z } from "zod";
import { BaseEntitySchema } from "./base";

export const UserRole = z.enum(["admin", "user", "manager"]);
export const UserRoleOptions = UserRole.options;

export const UserSchema = BaseEntitySchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: UserRole,
  active: z.boolean(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRole>;
