"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";

import {validFiles} from "@/lib/utils";
import {updateCoverImage} from "@/actions/userActions";
import {IUser} from "@/models/userModel";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface CoverImageFormProps {
  user: IUser;
}

interface File {
  status: string;
  imgUrl: string;
  message?: string;
  fileUpload: undefined;
}

const CoverImageForm = ({user}: CoverImageFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!file)
      return toast({
        title: "Invalid image!",
        description: "Please select a image first.",
        variant: "destructive",
      });

    try {
      const formData = new FormData();
      if (file) {
        formData.append("files", file.fileUpload!);
        URL.revokeObjectURL(file.imgUrl);
      }

      await updateCoverImage({id: user._id, formData, path});

      setFile(null);

      toast({
        title: "Update successful!",
        description: "Cover image updated successfully!",
      });
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

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = e.dataTransfer;
    handleImageChange(data.files);
  };

  return (
    <div className="my-10 flex w-full items-center justify-center">
      <div className="w-[95%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <form
          className="flex flex-col justify-start gap-10"
          onSubmit={handleSubmit}
          onDrop={handleDrop}
          onDrag={(e) => e.preventDefault()}
        >
          <h1 className="mb-5 text-2xl font-bold">Update Cover Image</h1>
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
          <Button
            type="submit"
            disabled={loading}
            className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          >
            {loading ? "Processing..." : "Update Cover Image"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CoverImageForm;
