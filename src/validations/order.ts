import {z} from "zod";

export const CreateOrderValidation = z.object({
  city: z.string().min(1, {message: "City is required"}).trim().toLowerCase(),
  state: z.string().min(1, {message: "State is required"}).trim().toLowerCase(),
  country: z
    .string()
    .min(1, {message: "Country is required"})
    .trim()
    .toLowerCase(),
  zip: z.string().min(1, {message: "Zip is required"}).trim(),
  address: z
    .string()
    .min(1, {message: "Address is required"})
    .trim()
    .toLowerCase(),
});

export const UpdateOrderValidation = z.object({
  orderStatus: z
    .string()
    .min(1, {message: "Order status is required"})
    .trim()
    .toLowerCase(),
  deliverAt: z.date(),
});
