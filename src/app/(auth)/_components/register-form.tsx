"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";

import {registerUser} from "@/actions/userActions";
import {UserRegistrationValidation} from "@/validations/user";
import {useToast} from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {usePrimaryColor} from "@/components/primary-provider";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof UserRegistrationValidation>>({
    resolver: zodResolver(UserRegistrationValidation),
    defaultValues: {
      email: "",
      password: "",
      cf_password: "",
      name: "",
      username: "",
      mobileNumber: "",
      dob: new Date(),
      gender: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      addressline: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof UserRegistrationValidation>
  ) => {
    setLoading(true);
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
        mobileNumber: values.mobileNumber,
        dob: values.dob,
        gender: values.gender,
        city: values.city,
        state: values.state,
        country: values.country,
        zip: values.zip,
        addressline: values.addressline,
      });

      toast({
        title: "Register successful!",
        description: `@${values.username} successfully register with email ${values.email}`,
      });

      form.reset();

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="mb-5 text-2xl font-bold">Register Form</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user mobile number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cf_password"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <FormField
              control={form.control}
              name="dob"
              render={({field}) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-base font-semibold">
                    Date of birth
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button className="border border-gray-500">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({field}) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-base font-semibold">
                    Gender
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"male"}>Male</SelectItem>
                      <SelectItem value={"female"}>Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="city"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user city"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    State
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Enter user state text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="country"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">Zip</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user zip"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressline"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Addressline
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter user addressline"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          >
            {loading ? "Processing..." : "Register"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
