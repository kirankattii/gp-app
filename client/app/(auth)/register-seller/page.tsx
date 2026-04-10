"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import AppButton from "@/components/core/button/AppButton";
import { AppInput } from "@/components/core/form/AppInput";
import { AppPasswordInput } from "@/components/core/form/AppPasswordInput";
import { FileBadge, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import AppLink from "@/components/core/link/AppLink";
import { toast } from "sonner";

export default function RegisterSellerPage() {
  const { registerSeller } = useAuth();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await registerSeller.mutateAsync(data);
      toast.success("Seller account created! Please check your email to verify your account.");
      router.push("/");
      form.reset();
    } catch {
      // toast is handled in useAuth hook
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--gp-black)]">Become a Seller</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Join GreenPeddle to sell your sustainable products
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AppInput
          label="Full Name"
          placeholder="Jane Doe"
          register={form.register}
          name="name"
          error={form.formState.errors.name?.message}
          leftIcon={<FileBadge className="h-4 w-4" />}
          isRequired
        />

        <AppInput
          label="Email Address"
          placeholder="seller@example.com"
          type="email"
          register={form.register}
          name="email"
          error={form.formState.errors.email?.message}
          leftIcon={<Mail className="h-4 w-4" />}
          isRequired
        />

        <AppPasswordInput
          label="Password"
          placeholder="••••••••"
          register={form.register}
          name="password"
          error={form.formState.errors.password?.message}
          leftIcon={<Lock className="h-4 w-4" />}
          isRequired
        />

        <AppButton
          type="submit"
          loading={registerSeller.isPending}
          size="sm"
          fullWidth
          className="rounded-xl shadow-lg shadow-gp-green/20"
        >
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Register as Seller
          </div>
        </AppButton>
      </form>

      <div className="text-center text-sm text-zinc-500 pt-4 border-t border-zinc-100">
        Already have an account?{" "}
        <AppLink
          asLink
          href="/login"
          showLinkColor
          className="font-bold underline-offset-4 flex inline-flex items-center gap-1 group"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to login
        </AppLink>
      </div>
    </div>
  );
}
