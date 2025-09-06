
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const registerSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(5, "Age must be at least 5.").max(100, "Age seems incorrect."),
  guardianName: z.string().min(2, "Guardian's name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().regex(/^[0-9\s+-]{10,15}$/, "Please enter a valid phone number."),
});

export function RegisterForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      studentName: "",
      age: undefined,
      guardianName: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true);
    // Simulate server action
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(values);
    setIsSubmitting(false);

    toast({
      title: "Registration Submitted!",
      description: "Thank you for your interest. We will contact you shortly with further details.",
      variant: "default",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="studentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Student's Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ananya Sharma" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Student's Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 14" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guardianName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Parent/Guardian's Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rajan Sharma" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Contact Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., contact@example.com" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base">Contact Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., 9876543210" {...field} className="text-sm sm:text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
