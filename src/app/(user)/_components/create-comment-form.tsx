"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {createComment, replyComment} from "@/actions/commentActions";
import {CommentValidation} from "@/validations/comment";
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

interface CreateCommentFormProps {
  postId: string;
  postOwnerId: string;
  commentId?: string;
}

const CreateCommentForm = ({
  postId,
  postOwnerId,
  commentId,
}: CreateCommentFormProps) => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setLoading(true);

    try {
      if (commentId) {
        await replyComment({message: values.message, postId, commentId, path});
      } else {
        await createComment({
          message: values.message,
          postId,
          postOwnerId,
          path,
        });

        toast({
          title: "Comment posted!",
          description: "You successfully created a comment.",
        });
      }

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
          className="flex flex-col justify-start gap-5 bg-white dark:bg-black p-3 rounded-md mb-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-bold">
            {commentId ? "Reply" : "Comment"} Form
          </h1>
          <FormField
            control={form.control}
            name="message"
            render={({field}) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base font-semibold">
                  {commentId ? "Reply" : "Comment"} Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                    placeholder={`Enter ${
                      commentId ? "reply" : "comment"
                    } message`}
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
            {loading
              ? "Processing..."
              : `Create ${commentId ? "Reply" : "Comment"}`}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CreateCommentForm;
