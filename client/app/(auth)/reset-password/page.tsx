"use client";

import { useForm } from "react-hook-form";
import { resetSchema } from "@/schemas/authSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppPasswordInput } from "@/components/core/form/AppPasswordInput";
import AppButton from "@/components/core/button/AppButton";
import { Lock, ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import AppLink from "@/components/core/link/AppLink";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { resetPassword } = useAuth();

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    try {
      await resetPassword.mutateAsync({ token, password: data.password });
      form.reset();
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      // Error is handled in useAuth
    }
  };

  if (resetPassword.isSuccess) {
    return (
      <div className="p-8 space-y-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gp-green/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-[var(--gp-green)]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--gp-black)]">Password Reset</h1>
          <p className="text-sm text-zinc-500 font-medium">
            Your password has been successfully updated. Redirecting to login...
          </p>
        </div>
        <AppButton
          fullWidth
          className="rounded-xl"
          onClick={() => router.push("/login")}
        >
          Go to login
        </AppButton>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--gp-black)]">Reset Password</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Create a new, strong password for your account.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AppPasswordInput
            label="New Password"
            placeholder="••••••••"
            register={form.register}
            name="password"
            error={form.formState.errors.password?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            isRequired
          />

          <AppPasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            register={form.register}
            name="confirmPassword"
            error={form.formState.errors.confirmPassword?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            isRequired
          />
        </div>

        <AppButton
          type="submit"
          loading={resetPassword.isPending}
          size="lg"
          fullWidth
          className="rounded-xl shadow-lg shadow-gp-green/20"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Password
          </div>
        </AppButton>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Changed your mind?{" "}
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