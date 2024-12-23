import {z} from "zod";

export const ReviewValidation = z.object({
  comment: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, {message: "Comment is required"})
    .max(50, {message: "Comment maximum 50 characters long"}),
  rating: z.string().min(1, {message: "Rating is minimum 1"}),
});
