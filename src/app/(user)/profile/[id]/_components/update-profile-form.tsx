"use client";

import {useState, ChangeEvent} from "react";
import {usePathname} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import {updateUser} from "@/actions/userActions";
import {IUser} from "@/models/userModel";
import {UserUpdateValidation} from "@/validations/user";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import LinksForm from "./links-form";

interface UpdateProfileFormProps {
  user: IUser;
  userLinks: {
    title: string;
    link: string;
  }[];
}

interface Link {
  title: string;
  link: string;
}

const UpdateProfileForm = ({user, userLinks}: UpdateProfileFormProps) => {
  const [links, setLinks] = useState<Link[]>(userLinks);
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const path = usePathname();

  const form = useForm<z.infer<typeof UserUpdateValidation>>({
    resolver: zodResolver(UserUpdateValidation),
    defaultValues: {
      name: user.name,
      username: user.username,
      dob: new Date(user.dob),
      gender: user.gender,
      city: user.city,
      state: user.state,
      country: user.country,
      zip: user.zip,
      addressline: user.addressline,
    },
  });

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const {name, value} = event.target;
    const list = [...links];
    list[index][name as keyof Link] = value;
    setLinks(list);
  };

  const handleAddClick = () => {
    setLinks([...links, {title: "", link: ""}]);
  };

  const handleRemoveClick = (index: number) => {
    const list = [...links];
    list.splice(index, 1);
    setLinks(list);
  };

  const onSubmit = async (values: z.infer<typeof UserUpdateValidation>) => {
    setLoading(true);

    try {
      await updateUser({
        id: user._id,
        name: values.name,
        username: values.username,
        dob: values.dob,
        gender: values.gender,
        city: values.city,
        state: values.state,
        country: values.country,
        zip: values.zip,
        addressline: values.addressline,
        socialLinks: links,
        path,
      });

      toast({
        title: "Update successful!",
        description: "Profile updated successfully.",
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

  return (
    <div className="my-10 flex w-full items-center justify-center">
      <div className="w-[95%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <Form {...form}>
          <form
            className="flex flex-col justify-start gap-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h1 className="mb-5 text-3xl font-bold">Profile Details</h1>
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter user name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter user username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <FormField
                control={form.control}
                name="dob"
                render={({field}) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-base font-semibold">
                      Date of birth
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button className="border border-gray-500">
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel className="text-base font-semibold">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"male"}>Male</SelectItem>
                        <SelectItem value={"female"}>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter user city"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      State
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter user state"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="country"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter user country"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Zip
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter user zip"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressline"
                render={({field}) => (
                  <FormItem className="flex w-full flex-col gap-3">
                    <FormLabel className="text-base font-semibold">
                      Addressline
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                        placeholder="Enter user addressline"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DndProvider backend={HTML5Backend}>
              <LinksForm
                links={links}
                setLinks={setLinks}
                handleInputChange={handleInputChange}
                handleAddClick={handleAddClick}
                handleRemoveClick={handleRemoveClick}
              />
            </DndProvider>
            <Button
              type="submit"
              disabled={loading}
              className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
            >
              {loading ? "Processing..." : "Update User"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
