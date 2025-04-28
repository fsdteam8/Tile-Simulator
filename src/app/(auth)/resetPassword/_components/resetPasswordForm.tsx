"use client";

import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle reset password logic here
    console.log(values);
    // Redirect to login page in a real app
    router.push("/");
  }

  return (
    <div className="w-full max-w-md">
      <div className="space-y-2 mb-6">
        <h1 className="text-[32px] 2xl:text-[40px] leading-[120%] text-black font-bold">
          Reset Password
        </h1>
        <p className="text-lg 2xl:text-xl font-medium text-[#B0B0B0] leading-[120%]">
          Create your new password
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium leading-[120%] text-black">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter new password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none placeholder:text-base placeholder:text-[#272727] placeholder:font-normal placeholder:leading-[120%] border border-[#272727]"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium leading-[120%] text-black">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter confirm new password"
                      type= {showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none placeholder:text-base placeholder:text-[#272727] placeholder:font-normal placeholder:leading-[120%] border border-[#272727]"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-base font-medium leading-[120%] text-white py-3 2xl:py-4"
          >
            Login
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
