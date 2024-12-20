"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Pen} from "lucide-react";

import {createVideo} from "@/actions/videoActions";
import {validFiles, validVideo} from "@/lib/utils";
import {VideoValidation} from "@/validations/video";
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
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

interface CreateVideoProps {
  user: any;
}

interface File {
  status: string;
  imgUrl: string;
  message?: string;
  fileUpload: undefined;
}

interface Video {
  status: string;
  message?: string;
  fileUpload: undefined;
}

const CreateVideo = ({user}: CreateVideoProps) => {
  const [file, setFile] = useState<File | null>();
  const [video, setVideo] = useState<Video | null>();
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const form = useForm<z.infer<typeof VideoValidation>>({
    resolver: zodResolver(VideoValidation),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof VideoValidation>) => {
    setLoading(true);

    try {
      if (!file) {
        return toast({
          title: "Something went wrong!",
          description: "Please select a image first.",
          variant: "destructive",
        });
      }

      if (!video) {
        return toast({
          title: "Something went wrong!",
          description: "Please select a video first.",
          variant: "destructive",
        });
      }

      const formData = new FormData();

      if (file) {
        formData.append("files", file.fileUpload!);
        URL.revokeObjectURL(file.imgUrl);
      }

      if (video) {
        formData.append("videos", video.fileUpload!);
      }

      await createVideo({title: values.title, formData, path});

      toast({
        title: "Video created!",
        description: "You successfully created a video.",
      });

      form.reset();
      setFile(null);
      setVideo(null);
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
      if (result?.message)
        return toast({
          title: "Something went wrong, try again later!",
          description: result?.message,
          variant: "destructive",
        });
      setFile(result as any);
    });
  };

  const handelVideoChange = (files: any) => {
    if (!files.length) return;
    [...files].map((file) => {
      const result = validVideo(file);
      if (result?.message)
        return toast({
          title: "Something went wrong, try again later!",
          description: result?.message,
          variant: "destructive",
        });
      setVideo(result as any);
    });
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
              <Pen /> Create Video
            </Button>
          </div>
        }
        title="Create Video"
        description="Share what's in your mind"
      >
        <div>
          <Form {...form}>
            <form
              className="flex flex-col justify-start gap-10"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <h1 className="text-2xl font-bold">Create Video</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-black">
                  <Image
                    src={file?.imgUrl || "https://placehold.co/600x400.png"}
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
                    onChange={(e) => handleImageChange(e.target.files)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* <div className="flex items-center justify-center rounded-full bg-black">
                  <Image
                    src={file?.imgUrl || "https://placehold.co/600x400.png"}
                    alt="image"
                    width={150}
                    height={150}
                    sizes="50vw"
                    priority
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div> */}
                <div className="flex-1 text-base font-semibold text-gray-200">
                  <Input
                    type="file"
                    accept=".mp4, .webm, .ogg"
                    placeholder="Add your video"
                    className="cursor-pointer border-none bg-transparent outline-none file:text-primary"
                    hidden
                    onChange={(e) => handelVideoChange(e.target.files)}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Video Title
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter video title"
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
                {loading ? "Processing..." : "Create Video"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogProvider>
    </div>
  );
};

export default CreateVideo;
