"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {RAZORPAY_KEY} from "@/lib/config";
import {formatFloatingNumber, getSum} from "@/lib/utils";
import {CreateOrderValidation} from "@/validations/order";
import {ICart} from "@/models/cartModel";
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
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface CheckoutProps {
  cart: ICart;
}

const Checkout = ({cart}: CheckoutProps) => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const router = useRouter();

  const form = useForm<z.infer<typeof CreateOrderValidation>>({
    resolver: zodResolver(CreateOrderValidation),
    defaultValues: {
      city: "",
      state: "",
      country: "",
      zip: "",
      address: "",
    },
  });

  const calculatePrice = () => {
    let prices = [];
    let taxPrices = [];
    let shippingPrices = [];
    let totalPrices = [];
    for (let i = 0; i < cart.products.length; i++) {
      prices.push(cart.products[i].price);
      taxPrices.push(cart.products[i].taxPrice);
      shippingPrices.push(cart.products[i].shippingPrice);
      totalPrices.push(cart.products[i].totalPrice);
    }
    let price = formatFloatingNumber(prices.reduce(getSum, 0));
    let taxPrice = formatFloatingNumber(taxPrices.reduce(getSum, 0));
    let shippingPrice = formatFloatingNumber(shippingPrices.reduce(getSum, 0));
    let totalPrice = formatFloatingNumber(totalPrices.reduce(getSum, 0));

    return {price, taxPrice, shippingPrice, totalPrice};
  };

  const onSubmit = async (values: z.infer<typeof CreateOrderValidation>) => {
    setLoading(true);

    const {city, state, country, zip, address} = values;

    try {
      let prices = [];
      let taxPrices = [];
      let shippingPrices = [];
      let totalPrices = [];
      for (let i = 0; i < cart.products.length; i++) {
        prices.push(cart.products[i].price);
        taxPrices.push(cart.products[i].taxPrice);
        shippingPrices.push(cart.products[i].shippingPrice);
        totalPrices.push(cart.products[i].totalPrice);
      }
      let price = formatFloatingNumber(prices.reduce(getSum, 0));
      let taxPrice = formatFloatingNumber(taxPrices.reduce(getSum, 0));
      let shippingPrice = formatFloatingNumber(
        shippingPrices.reduce(getSum, 0)
      );
      let totalPrice = formatFloatingNumber(totalPrices.reduce(getSum, 0));

      const orderItems: any[] = [];
      for (let i = 0; i < cart?.products?.length; i++) {
        let newObj = {
          product: cart?.products[i]?.product._id,
          quantity: cart?.products[i]?.quantity,
        };
        orderItems.push(newObj);
      }

      const data = await fetch("http://localhost:3000/api/razorpay", {
        method: "POST",
        body: JSON.stringify({
          price: parseInt(totalPrice) * 100,
        }),
      });
      const order = await data.json();
      const options = {
        key: RAZORPAY_KEY,
        name: "Social App",
        description: "Social app e-commerce store.",
        currency: order.order.currency,
        amount: order.order.amount,
        order_id: order.order.id,
        handler: async function (response: any) {
          const data = await fetch("http://localhost:3000/api/paymentverify", {
            method: "POST",
            body: JSON.stringify({
              id: order.order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderItems: orderItems,
              shippingAddress: {
                city,
                state,
                country,
                zip,
                address,
              },
              price,
              taxPrice,
              shippingPrice,
              totalPrice,
              cartId: cart._id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const res = await data.json();
          if (res?.message == "success") {
            toast({description: "Payment success!"});
            router.push("/orders/my");
          }
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", function () {
        toast({
          title: "Something went wrong!",
          description:
            "Payment failed, please try again later, contact support for help.",
          variant: "destructive",
        });
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
    <section className="p-6 shadow-xl rounded-xl w-full">
      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="text-3xl font-bold capitalize">Checkout</h1>
          <div className="flex items-center gap-5">
            <p className="text-lg font-bold">
              Price:{" "}
              <span className="font-medium">{calculatePrice().price}</span>
            </p>
            <p className="text-lg font-bold">
              Tax Price:{" "}
              <span className="font-medium">{calculatePrice().taxPrice}</span>
            </p>
            <p className="text-lg font-bold">
              Shipping Price:{" "}
              <span className="font-medium">
                {calculatePrice().shippingPrice}
              </span>
            </p>
            <p className="text-lg font-bold">
              Total Price:{" "}
              <span className="font-medium">{calculatePrice().totalPrice}</span>
            </p>
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
                      placeholder="Enter your city"
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
                      placeholder="Enter your state"
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
                      placeholder="Enter your country"
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
                  <FormLabel className="text-base font-semibold">Zip</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter your zip"
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
              name="address"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
                      placeholder="Enter your address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          >
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Checkout;
