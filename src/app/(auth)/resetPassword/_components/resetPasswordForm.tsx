"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z
  .object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function ResetPasswordForm() {
//   const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle reset password logic here
    console.log(values)
    // Redirect to login page in a real app
    // router.push("/")
  }

  return (
    <div className="w-full max-w-md">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">Create your new password</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter new password" type="password" {...field} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none"/>
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter confirm new password" type="password" {...field} className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
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
  )
}

