"use client";

import {useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {X} from "lucide-react";

import {updateProductImage} from "@/actions/productActions";
import {validFiles} from "@/lib/utils";
import {IProduct} from "@/models/productModel";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

interface AddProductImageProps {
  product: IProduct;
}

interface File {
  status: string;
  imgUrl: string;
  message?: string;
  fileUpload: undefined;
}

const AddProductImage = ({product}: AddProductImageProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const count = useMemo(() => {
    return files.filter((file) => file?.status === "success").length;
  }, [files]);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const filesUpload = files.filter((file) => file?.status === "success");
      const formData = new FormData();
      filesUpload.forEach((file) => {
        formData.append("files", file.fileUpload!);
      });
      files.map((file) => URL.revokeObjectURL(file.imgUrl));

      await updateProductImage({
        id: product._id,
        formData,
        path,
      });

      setFiles([]);

      toast({title: "Image added!", description: "Product image added!"});
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
    <div className="flex w-full items-center justify-center my-10">
      <div className="min-w-[80%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <form
          className="flex flex-col justify-start gap-10"
          onSubmit={handleSubmit}
          onDrop={handleDrop}
          onDrag={(e) => e.preventDefault()}
        >
          <h1 className="mb-5 text-2xl font-bold">Add Product Image</h1>
          <div
            className="mb-5 mt-9 flex w-full items-center justify-center rounded border-4 border-dashed border-primary p-8 text-center"
            onDrop={handleDrop}
            onDrag={(e) => e.preventDefault()}
          >
            <input
              type="file"
              id="upload"
              accept=".png, .jpg, .jpeg"
              multiple
              hidden
              onChange={(e) => handleImageChange(e.target.files)}
            />
            <label
              htmlFor="upload"
              className="flex max-w-lg cursor-pointer flex-col items-center justify-center"
            >
              <Image
                src="https://placehold.co/600x400.png"
                alt="add"
                width={250}
                height={60}
                sizes="25vw"
                style={{width: 256, height: 116}}
              />
              <h5 className="mx-0 my-2.5 text-2xl font-semibold">
                Drag & drop up to 5 images or
                <span className="mx-1.5 text-blue-700">browse</span> to choose a
                file
              </h5>
              <small className="text-sm text-gray-700">
                JPEG, PNG only - Max 1MB
              </small>
            </label>
          </div>
          <span>Image {count}</span>
          <div className="mb-5 flex flex-wrap items-start">
            {files.map((file, i) => (
              <Card
                className={`relative mx-auto mb-5 !max-h-fit ${
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
                    className="min-h-[200px] w-[250px] rounded object-cover"
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
          <Button
            type="submit"
            disabled={loading}
            className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          >
            {loading ? "Processing..." : "Add Image"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProductImage;
