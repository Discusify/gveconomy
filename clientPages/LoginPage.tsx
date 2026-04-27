"use client";

import supabase from "@/lib/supabase/client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password must be at least 1 characters"),
});

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Login successful");

      // opcional en Next.js
      window.location.href = "/";
    } catch (err) {
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col h-full items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="space-y-4">

              {/* EMAIL */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* PASSWORD */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            type="submit"
            form="login-form"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-4 text-sm text-muted-foreground select-none">
        <p>
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}