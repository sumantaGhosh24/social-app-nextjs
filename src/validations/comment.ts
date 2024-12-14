import {z} from "zod";

export const CommentValidation = z.object({
  message: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, {message: "message is required"})
    .max(200, {message: "message maximum 200 characters long"}),
});
