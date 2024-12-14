import {z} from "zod";

export const PostValidation = z.object({
  title: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, {message: "title is required"})
    .max(300, {message: "title maximum 300 characters long"}),
});
