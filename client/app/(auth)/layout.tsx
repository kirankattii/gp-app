"use client";

import { motion } from "framer-motion";
import AppLink from "@/components/core/link/AppLink";
import { Leaf } from "lucide-react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Background patterns/effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--gp-green)]/5 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--gp-brown)]/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md flex flex-col items-center"
      >
        <AppLink asLink href="/" className="flex items-center gap-2 mb-4 group no-underline hover:no-underline">
          <Image src="/gplogo-nobg.png" alt="green-peddle-logo" width={150} height={150} />
        </AppLink>

        <div className="w-full bg-white/70 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl overflow-hidden ring-1 ring-black/5">
          {children}
        </div>

        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} GreenPeddle. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}
