"use client";

import { useForm } from "react-hook-form";
import { forgotSchema } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import AppButton from "@/components/core/button/AppButton";
import { AppInput } from "@/components/core/form/AppInput";
import { Mail, ArrowLeft, Send } from "lucide-react";
import AppLink from "@/components/core/link/AppLink";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
    try {
      setSubmittedEmail(data.email);
      await forgotPassword.mutateAsync(data);
      form.reset();
    } catch {
      // Error is handled in useAuth
    }
  };

  if (forgotPassword.isSuccess) {
    return (
      <div className="p-8 space-y-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gp-green/10 rounded-full flex items-center justify-center">
          <Send className="h-8 w-8 text-[var(--gp-green)]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--gp-black)]">Check your email</h1>
          <p className="text-sm text-zinc-500 font-medium">
            We&apos;ve sent a password reset link to <span className="text-[var(--gp-black)] font-bold">{submittedEmail}</span>.
          </p>
        </div>
        <AppButton
          variant="outline"
          fullWidth
          className="rounded-xl"
          onClick={() => forgotPassword.mutate({ email: submittedEmail })}
          loading={forgotPassword.isPending}
        >
          Resend email
        </AppButton>        <p className="text-center text-sm text-zinc-500">
          <AppLink
            asLink
            href="/login"
            showLinkColor
            className="font-bold underline-offset-4 flex inline-flex items-center gap-1 group"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Back to login
          </AppLink>
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--gp-black)]">Forgot Password?</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AppInput
          label="Email Address"
          placeholder="name@example.com"
          type="email"
          register={form.register}
          name="email"
          error={form.formState.errors.email?.message}
          leftIcon={<Mail className="h-4 w-4" />}
          isRequired
        />

        <AppButton
          type="submit"
          loading={forgotPassword.isPending}
          size="lg"
          fullWidth
          className="rounded-xl shadow-lg shadow-gp-green/20"
        >
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Reset Link
          </div>
        </AppButton>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Remember your password?{" "}
        <AppLink
          asLink
          href="/login"
          showLinkColor
          className="font-bold underline-offset-4 flex inline-flex items-center gap-1 group"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to login
        </AppLink>
      </p>
    </div>
  );
}