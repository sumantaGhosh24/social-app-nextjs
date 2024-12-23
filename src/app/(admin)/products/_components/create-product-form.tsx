"use client";

import {useMemo, useState} from "react";
import Image from "next/image";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {X} from "lucide-react";

import {createProduct} from "@/actions/productActions";
import {validFiles} from "@/lib/utils";
import {ProductValidation} from "@/validations/product";
import {ICategory} from "@/models/categoryModel";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

interface CreateProductFormProps {
  categories: ICategory[];
}

interface File {
  status: string;
  imgUrl: string;
  message?: string;
  fileUpload: undefined;
}

const CreateProductForm = ({categories}: CreateProductFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof ProductValidation>>({
    resolver: zodResolver(ProductValidation),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      category: "",
      price: "",
    },
  });

  const count = useMemo(() => {
    return files.filter((file) => file?.status === "success").length;
  }, [files]);

  const onSubmit = async (values: z.infer<typeof ProductValidation>) => {
    setLoading(true);
    try {
      if (files.length < 1)
        return toast({
          title: "Something went wrong!",
          description: "Please select a image first!",
          variant: "destructive",
        });

      const filesUpload = files.filter((file) => file?.status === "success");
      const formData = new FormData();
      filesUpload.forEach((file) => {
        formData.append("files", file.fileUpload!);
      });
      files.map((file) => URL.revokeObjectURL(file.imgUrl));

      await createProduct({
        title: values.title,
        description: values.description,
        content: values.content,
        category: values.category,
        price: values.price,
        formData,
      });

      toast({
        title: "Product created!",
        description: "Successfully created a product!",
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
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
        onDrop={handleDrop}
        onDrag={(e) => e.preventDefault()}
      >
        <h1 className="mb-5 text-2xl font-bold">Create Product</h1>
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
        <div className="mb-5 flex flex-wrap items-start gap-3">
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
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base font-semibold">
                  Product Title
                </FormLabel>
                <FormControl>
                  <Input
                    type="title"
                    className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                    placeholder="Enter product title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({field}) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base font-semibold">
                  Product Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem className="w-full">
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({field}) => (
              <FormItem className="w-full">
                <FormLabel>Product Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your product content"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="price"
          render={({field}) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold">
                Product Price
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                  placeholder="Enter product price"
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
          {loading ? "Processing..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateProductForm;
