"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // forgot password api integration
  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/password/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(
        data?.message || "Email sent successfully. Please check your inbox."
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values.email);
  }

  return (
    <div className="w-full max-w-md">
      <div className="space-y-2 mb-6">
        <h1 className="text-[32px] 2xl:text-[40px] leading-[120%] text-black font-bold">
          Forgot Password
        </h1>
        <p className="text-base md:text-lg 2xl:text-xl font-medium text-[#B0B0B0] leading-[120%]">
          Enter your registered email address. we&apos;ll send you a code to
          reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium leading-[120%] text-black">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address"
                    type="email"
                    {...field}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none placeholder:text-base placeholder:text-[#272727] placeholder:leading-[120%] placeholder:font-normal border border-[#272727]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-base font-medium leading-[120%] text-white py-3 2xl:py-4"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
