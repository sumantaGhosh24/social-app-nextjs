import {z} from "zod";

export const ProductValidation = z.object({
  title: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, {message: "Title is required"})
    .max(100, {message: "Title maximum 100 characters long"}),
  description: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, {message: "Description is required"})
    .max(250, {message: "Description maximum 250 characters long"}),
  content: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, {message: "Content is required"})
    .max(500, {message: "Content maximum 500 characters long"}),
  category: z.string().min(1, {message: "Category is required"}),
  price: z.string().min(1, {message: "Price is required"}),
});
