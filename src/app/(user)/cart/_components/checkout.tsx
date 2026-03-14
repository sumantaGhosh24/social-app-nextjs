"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

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
    const prices = [];
    const taxPrices = [];
    const shippingPrices = [];
    const totalPrices = [];
    for (let i = 0; i < cart.products.length; i++) {
      prices.push(cart.products[i].price);
      taxPrices.push(cart.products[i].taxPrice);
      shippingPrices.push(cart.products[i].shippingPrice);
      totalPrices.push(cart.products[i].totalPrice);
    }
    const price = formatFloatingNumber(prices.reduce(getSum, 0));
    const taxPrice = formatFloatingNumber(taxPrices.reduce(getSum, 0));
    const shippingPrice = formatFloatingNumber(
      shippingPrices.reduce(getSum, 0)
    );
    const totalPrice = formatFloatingNumber(totalPrices.reduce(getSum, 0));

    return {price, taxPrice, shippingPrice, totalPrice};
  };

  const onSubmit = async (values: z.infer<typeof CreateOrderValidation>) => {
    setLoading(true);

    const {city, state, country, zip, address} = values;

    try {
      const prices = [];
      const taxPrices = [];
      const shippingPrices = [];
      const totalPrices = [];
      for (let i = 0; i < cart.products.length; i++) {
        prices.push(cart.products[i].price);
        taxPrices.push(cart.products[i].taxPrice);
        shippingPrices.push(cart.products[i].shippingPrice);
        totalPrices.push(cart.products[i].totalPrice);
      }
      const price = formatFloatingNumber(prices.reduce(getSum, 0));
      const taxPrice = formatFloatingNumber(taxPrices.reduce(getSum, 0));
      const shippingPrice = formatFloatingNumber(
        shippingPrices.reduce(getSum, 0)
      );
      const totalPrice = formatFloatingNumber(totalPrices.reduce(getSum, 0));

      const orderItems: any[] = [];
      for (let i = 0; i < cart?.products?.length; i++) {
        const newObj = {
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
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
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
    <section className="p-6 shadow-md rounded-md w-full dark:shadow-gray-400">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-10"
        >
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="font-semibold">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="font-semibold">State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your zip" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="font-semibold">Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border rounded-xl p-6 h-fit space-y-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{calculatePrice().price}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{calculatePrice().taxPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{calculatePrice().shippingPrice}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className={`text-${primaryColor}-500`}>
                ₹{calculatePrice().totalPrice}
              </span>
            </div>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className={`w-full mt-4 bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
            >
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default Checkout;
