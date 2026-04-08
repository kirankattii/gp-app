"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import AppButton from "@/components/core/button/AppButton";
import { AppInput } from "@/components/core/form/AppInput";
import { AppPasswordInput } from "@/components/core/form/AppPasswordInput";
import { User, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";
import AppLink from "@/components/core/link/AppLink";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register: registerMut } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await registerMut.mutateAsync(data);
      toast.success("Account created successfully! Please verify your email.");
      router.push("/");
      form.reset();
    } catch {
      // toast.error is handled by the mutation's onError callback in useAuth
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--gp-black)]">Create Account</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Join GreenPeddle and start your sustainable journey
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AppInput
          label="Full Name"
          placeholder="John Doe"
          register={form.register}
          name="name"
          error={form.formState.errors.name?.message}
          leftIcon={<User className="h-4 w-4" />}
          isRequired
        />

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
          loading={registerMut.isPending}
          size="sm"
          fullWidth
          className="rounded-xl shadow-lg shadow-gp-green/20"
        >
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Account
          </div>
        </AppButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-zinc-400">Or join with</span>
        </div>
      </div>

      <AppButton
        variant="outline"
        type="button"
        size="sm"
        onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`)}
        className="w-full border-zinc-200 rounded-xl "
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="text-zinc-700">Google</span>
      </AppButton>

      <div className="text-center text-sm text-zinc-500">
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