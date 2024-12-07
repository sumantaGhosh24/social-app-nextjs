import {z} from "zod";

export const UserRegistrationValidation = z
  .object({
    email: z
      .string()
      .email({message: "Invalid email address"})
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(6, {message: "Password length at least 6 characters long"})
      .trim(),
    cf_password: z
      .string()
      .min(6, {message: "Password length at least 6 characters long"})
      .trim(),
    mobileNumber: z
      .string()
      .length(10, {message: "Mobile number must be exactly 10 characters long"})
      .trim(),
    name: z
      .string()
      .min(3, {message: "minimum 3 character long"})
      .max(20, {message: "maximum 20 characters long"})
      .trim()
      .toLowerCase(),
    username: z
      .string()
      .min(3, {message: "minimum 3 character long"})
      .max(20, {message: "maximum 20 characters long"})
      .trim()
      .toLowerCase(),
    dob: z.date().min(new Date("1/1/1900"), {message: "Dob is required"}),
    gender: z.string().min(1, {message: "Gender is required"}),
    city: z.string().min(1, {message: "City is required"}).trim().toLowerCase(),
    state: z
      .string()
      .min(1, {message: "State is required"})
      .trim()
      .toLowerCase(),
    country: z
      .string()
      .min(1, {message: "Country is required"})
      .trim()
      .toLowerCase(),
    zip: z.string().min(1, {message: "Zip is required"}).trim(),
    addressline: z
      .string()
      .min(1, {message: "Addressline is required"})
      .trim()
      .toLowerCase(),
  })
  .refine((data) => data.password === data.cf_password, {
    message: "Password and Confirm password not match",
    path: ["cf_password"],
  });

export const UserLoginValidation = z.object({
  email: z
    .string()
    .email({message: "Invalid email address"})
    .trim()
    .toLowerCase(),
  password: z.string().min(1, {message: "Password is required"}).trim(),
});

export const UserUpdateValidation = z.object({
  name: z
    .string()
    .min(3, {message: "minimum 3 character long"})
    .max(20, {message: "maximum 20 characters long"})
    .trim()
    .toLowerCase(),
  username: z
    .string()
    .min(3, {message: "minimum 3 character long"})
    .max(20, {message: "maximum 20 characters long"})
    .trim()
    .toLowerCase(),
  dob: z.date().min(new Date("1/1/1900"), {message: "Dob is required"}),
  gender: z.string().min(1, {message: "Gender is required"}),
  city: z.string().min(1, {message: "City is required"}).trim().toLowerCase(),
  state: z.string().min(1, {message: "State is required"}).trim().toLowerCase(),
  country: z
    .string()
    .min(1, {message: "Country is required"})
    .trim()
    .toLowerCase(),
  zip: z.string().min(1, {message: "Zip is required"}).trim(),
  addressline: z
    .string()
    .min(1, {message: "Addressline is required"})
    .trim()
    .toLowerCase(),
});

export const ResetPasswordValidation = z
  .object({
    oldPassword: z
      .string()
      .min(6, {message: "Password length at least 6 characters long"})
      .trim(),
    password: z
      .string()
      .min(6, {message: "Password length at least 6 characters long"})
      .trim(),
    cf_password: z
      .string()
      .min(6, {message: "Password length at least 6 characters long"})
      .trim(),
  })
  .refine((data) => data.password === data.cf_password, {
    message: "Password and Confirm password not match",
    path: ["cf_password"],
  });
