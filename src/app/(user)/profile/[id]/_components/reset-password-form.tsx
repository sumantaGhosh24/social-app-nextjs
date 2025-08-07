"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {resetPassword} from "@/actions/userActions";
import {ResetPasswordValidation} from "@/validations/user";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

interface ResetPasswordFormProps {
  userId: string;
}

const ResetPasswordForm = ({userId}: ResetPasswordFormProps) => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const form = useForm<z.infer<typeof ResetPasswordValidation>>({
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      oldPassword: "",
      password: "",
      cf_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordValidation>) => {
    setLoading(true);

    try {
      await resetPassword({
        id: userId,
        oldPassword: values.oldPassword,
        password: values.password,
        cf_password: values.cf_password,
        path,
      });

      toast({
        title: "Update successful!",
        description: "Password reset successfully.",
      });

      form.reset();
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
    <div className="my-10 flex w-full items-center justify-center">
      <div className="w-[95%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <Form {...form}>
          <form
            className="flex flex-col justify-start gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h1 className="mb-5 text-3xl font-bold">Reset Password</h1>
            <FormField
              control={form.control}
              name="oldPassword"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Old Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter your old password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter your new password"
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
                    New Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter your new confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
            >
              {loading ? "Processing..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
