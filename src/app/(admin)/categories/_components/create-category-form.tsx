"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {createCategory} from "@/actions/categoryActions";
import {CategoryValidation} from "@/validations/category";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const CreateCategoryForm = () => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof CategoryValidation>>({
    resolver: zodResolver(CategoryValidation),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CategoryValidation>) => {
    setLoading(true);
    try {
      await createCategory({
        name: values.name,
        path: "/categories",
      });

      toast({
        title: "Category created!",
        description: "Successfully created a category!",
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
    <>
      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="mb-5 text-2xl font-bold">Create Category</h1>
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base font-semibold">
                  Category Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="name"
                    className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                    placeholder="Enter category name"
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
            {loading ? "Processing..." : "Create Category"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CreateCategoryForm;
