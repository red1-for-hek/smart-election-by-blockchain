import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const userSchema = insertUserSchema.extend({
  id: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;