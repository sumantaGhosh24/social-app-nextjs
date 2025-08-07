"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";

import {updateOrder} from "@/actions/orderActions";
import {IOrder} from "@/models/orderModel";
import {UpdateOrderValidation} from "@/validations/order";
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
import {Calendar} from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";

interface UpdateOrderFormProps {
  order: IOrder;
}

const UpdateOrderForm = ({order}: UpdateOrderFormProps) => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const pathname = usePathname();

  const form = useForm<z.infer<typeof UpdateOrderValidation>>({
    resolver: zodResolver(UpdateOrderValidation),
    defaultValues: {
      orderStatus: order.orderStatus,
      deliverAt: order.deliverAt ? new Date(order.deliverAt) : new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateOrderValidation>) => {
    setLoading(true);
    try {
      await updateOrder({
        id: order._id,
        orderStatus: values.orderStatus,
        deliverAt: values.deliverAt,
        path: pathname,
      });

      toast({
        title: "Order updated!",
        description: "Successfully updated a order!",
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
            <h1 className="mb-5 text-2xl font-bold">Update Order</h1>
            <FormField
              control={form.control}
              name="orderStatus"
              render={({field}) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="text-base font-semibold">
                    Order Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"pending"}>Pending</SelectItem>
                      <SelectItem value={"completed"}>Completed</SelectItem>
                      <SelectItem value={"cancelled"}>Cancelled</SelectItem>
                      <SelectItem value={"refund"}>Refund</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliverAt"
              render={({field}) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Deliver At</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button className="border border-gray-500 bg-white text-black dark:bg-black dark:text-white">
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
            >
              {loading ? "Processing..." : "Update Category"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateOrderForm;
