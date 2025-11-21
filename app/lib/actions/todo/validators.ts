import z from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});
