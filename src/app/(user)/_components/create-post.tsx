"use client";

import {useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Pen, X} from "lucide-react";

import {createPost} from "@/actions/postActions";
import {validFiles} from "@/lib/utils";
import {PostValidation} from "@/validations/post";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import DialogProvider from "@/components/dialog-provider";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

interface CreatePostProps {
  user: any;
}

interface File {
  status: string;
  imgUrl: string;
  message?: string;
  fileUpload: undefined;
}

const CreatePost = ({user}: CreatePostProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: "",
    },
  });

  const count = useMemo(() => {
    return files.filter((file) => file?.status === "success").length;
  }, [files]);

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    setLoading(true);

    try {
      if (!files.length) {
        return toast({
          title: "Something went wrong!",
          description: "Please select a image first.",
          variant: "destructive",
        });
      }

      const filesUpload = files.filter((file) => file?.status === "success");
      const formData = new FormData();
      filesUpload.forEach((file) => {
        formData.append("files", file.fileUpload!);
      });
      files.map((file) => URL.revokeObjectURL(file.imgUrl));

      await createPost({title: values.title, formData, path});

      toast({
        title: "Post created!",
        description: "You successfully created a post.",
      });

      form.reset();
      setFiles([]);
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

  const handleImageChange = (files: any) => {
    if (!files.length) return;
    // eslint-disable-next-line array-callback-return
    [...files].map((file) => {
      const result = validFiles(file);
      setFiles((prev: any) => [...prev, result as any]);
    });
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = e.dataTransfer;
    handleImageChange(data.files);
  };

  const handleRemovedFile = (id: number) => {
    setFiles((files) => files.filter((_, i) => i !== id));
  };

  return (
    <div>
      <DialogProvider
        trigger={
          <div className="flex items-center gap-1.5 m-1.5 mb-5">
            <div className="flex-grow bg-gray-200 dark:bg-gray-700 p-3 rounded-md shadow-md flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profileImage?.url} />
                <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <button className="bg-transparent text-black dark:text-white text-lg font-bold disabled:pointer-events-none">
                {user?.username}, what are you thinking?
              </button>
            </div>
            <Button
              className={`bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300 h-[65px]`}
            >
              <Pen /> Create Post
            </Button>
          </div>
        }
        title="Create Post"
        description="Share what's in your mind"
      >
        <div>
          <Form {...form}>
            <form
              className="flex flex-col justify-start gap-10"
              onSubmit={form.handleSubmit(onSubmit)}
              onDrop={handleDrop}
              onDrag={(e) => e.preventDefault()}
            >
              <h1 className="text-2xl font-bold">Create Post</h1>
              <div className="flex items-center gap-2 border p-3 rounded">
                <div className="flex items-center justify-center rounded-full bg-black">
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="image"
                    width={150}
                    height={150}
                    sizes="50vw"
                    priority
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-base font-semibold text-gray-200">
                  <Input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    placeholder="Add your image"
                    className="cursor-pointer border-none bg-transparent outline-none file:text-primary"
                    hidden
                    multiple
                    onChange={(e) => handleImageChange(e.target.files)}
                  />
                </div>
              </div>
              <span>Image {count}</span>
              <div className="flex flex-wrap items-start gap-3">
                {files.map((file, i) => (
                  <Card
                    className={`relative mx-auto !max-h-fit ${
                      file?.status === "error" &&
                      "bg-destructive text-destructive-foreground"
                    }`}
                    key={i}
                  >
                    <CardContent className="p-0">
                      <Image
                        src={file?.imgUrl}
                        alt="file"
                        width={200}
                        height={200}
                        className="h-[100px] w-[100px] rounded object-cover"
                      />
                      {file?.message && (
                        <div className="mx-auto mb-4 w-[220px]">
                          <h4 className="my-3 text-xl font-bold capitalize">
                            {file?.status}
                          </h4>
                          <span className="text-sm">{file?.message}</span>
                        </div>
                      )}
                      <X
                        className="absolute right-1 top-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-gray-200 p-1 text-red-700 transition-all hover:bg-red-700 hover:text-gray-200"
                        onClick={() => handleRemovedFile(i)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Post Title
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter post title"
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
                {loading ? "Processing..." : "Create Post"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogProvider>
    </div>
  );
};

export default CreatePost;
