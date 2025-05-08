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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    password_confirmation: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const decodeEmail = decodeURIComponent(emailParam);
  const decodeToken = decodeURIComponent(tokenParam);

  const router = useRouter();

  // Redirect if email or token is missing
  useEffect(() => {
    if (!decodeEmail || !decodeToken) {
      toast.error("Invalid or expired password reset link.");
      router.push("/forgotPassword");
    }
  }, [decodeEmail, decodeToken, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: ({
      password,
      password_confirmation,
      email,
      token,
    }: {
      password: string;
      password_confirmation: string;
      email: string;
      token: string;
    }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, password_confirmation, email, token }),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Password reset successful.");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      password: values.password,
      password_confirmation: values.password_confirmation,
      token: decodeToken,
      email: decodeEmail,
    });
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
            name="password"
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
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium leading-[120%] text-black">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter confirm new password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none placeholder:text-base placeholder:text-[#272727] placeholder:font-normal placeholder:leading-[120%] border border-[#272727]"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
            disabled={isPending}
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-base font-medium leading-[120%] text-white py-3 2xl:py-4"
          >
            {isPending ? "Loading..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
