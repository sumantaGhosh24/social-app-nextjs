"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {createReview} from "@/actions/reviewActions";
import {ReviewValidation} from "@/validations/review";
import {IProduct} from "@/models/productModel";
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
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";

interface AddReviewProps {
  product: IProduct;
  user: any;
}

const CreateReviewForm = ({product, user}: AddReviewProps) => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const form = useForm<z.infer<typeof ReviewValidation>>({
    resolver: zodResolver(ReviewValidation),
    defaultValues: {
      comment: "",
      rating: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ReviewValidation>) => {
    setLoading(true);
    try {
      if (!user) return;

      await createReview({
        comment: values.comment,
        rating: values.rating,
        path,
        user: user._id,
        product: product._id,
      });

      toast({description: "Review posted!"});

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
        {user ? (
          <Form {...form}>
            <form
              className="flex flex-col justify-start gap-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <h1 className="mb-5 text-2xl font-bold">Create Review</h1>
              <FormField
                control={form.control}
                name="comment"
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormLabel>Review Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your review comment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Review Rating
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                        placeholder="Enter review rating"
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
                {loading ? "Processing..." : "Create Review"}
              </Button>
            </form>
          </Form>
        ) : (
          <>
            <div className="flex flex-col justify-start gap-10">
              <h1 className="mb-5 text-2xl font-bold">Create Reviews</h1>
              <h3 className="mb-5 text-lg text-gray-700">
                Only user create review.
              </h3>
              <Button
                type="button"
                disabled={loading}
                className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
              >
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateReviewForm;
