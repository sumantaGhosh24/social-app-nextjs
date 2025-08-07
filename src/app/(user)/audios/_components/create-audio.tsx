"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Pen} from "lucide-react";

import {createAudio} from "@/actions/audioActions";
import {validAudio, validFiles} from "@/lib/utils";
import {AudioValidation} from "@/validations/audio";
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

interface CreateAudioProps {
  user: any;
}

interface File {
  status: string;
  imgUrl: string;
  message?: string;
  fileUpload: undefined;
}

interface Audio {
  status: string;
  message?: string;
  fileUpload: undefined;
}

const CreateAudio = ({user}: CreateAudioProps) => {
  const [file, setFile] = useState<File | null>();
  const [audio, setAudio] = useState<Audio | null>();
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const form = useForm<z.infer<typeof AudioValidation>>({
    resolver: zodResolver(AudioValidation),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AudioValidation>) => {
    setLoading(true);

    try {
      if (!file) {
        return toast({
          title: "Something went wrong!",
          description: "Please select a image first.",
          variant: "destructive",
        });
      }

      if (!audio) {
        return toast({
          title: "Something went wrong!",
          description: "Please select a audio first.",
          variant: "destructive",
        });
      }

      const formData = new FormData();

      if (file) {
        formData.append("files", file.fileUpload!);
        URL.revokeObjectURL(file.imgUrl);
      }

      if (audio) {
        formData.append("audios", audio.fileUpload!);
      }

      await createAudio({title: values.title, formData, path});

      toast({
        title: "Audio created!",
        description: "You successfully created a audio.",
      });

      form.reset();
      setFile(null);
      setAudio(null);
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

  const handleAudioChange = (files: any) => {
    if (!files.length) return;
    [...files].map((file) => {
      const result = validAudio(file);
      if (result?.message)
        return toast({
          title: "Something went wrong, try again later!",
          description: result?.message,
          variant: "destructive",
        });
      setAudio(result as any);
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
              <Pen /> Create Audio
            </Button>
          </div>
        }
        title="Create Audio"
        description="Share what's in your mind"
      >
        <div>
          <Form {...form}>
            <form
              className="flex flex-col justify-start gap-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <h1 className="text-2xl font-bold">Create Audio</h1>
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
              <Input
                type="file"
                accept=".mp3, .mpeg, .ogg, .wav"
                placeholder="Add your audio"
                className="cursor-pointer border-none bg-transparent outline-none file:text-primary"
                hidden
                onChange={(e) => handleAudioChange(e.target.files)}
              />
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Audio Title
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter audio title"
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
                {loading ? "Processing..." : "Create Audio"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogProvider>
    </div>
  );
};

export default CreateAudio;
