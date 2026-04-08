"use client";

import Image from "next/image";
import AppLink from "@/components/core/link/AppLink";
import { motion } from "framer-motion";
import { Leaf, Zap, Shield, Globe, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import AppButton from "@/components/core/button/AppButton";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[var(--gp-green)]/20 selection:text-[var(--gp-green)]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <AppLink asLink href="/" noUnderline className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-[var(--gp-green)] text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">GreenPeddle</span>
            </AppLink>

            <div className="hidden md:flex items-center gap-8">
              <AppLink asLink href="#features" noUnderline className="text-sm font-medium hover:text-[var(--gp-green)] transition-colors">Features</AppLink>
              <AppLink asLink href="#about" noUnderline className="text-sm font-medium hover:text-[var(--gp-green)] transition-colors">About</AppLink>
              <AppLink asLink href="/login" noUnderline className="text-sm font-medium hover:text-[var(--gp-green)] transition-colors">Sign In</AppLink>
              <AppLink 
                asLink 
                href="/register" 
                noUnderline 
                className="inline-flex items-center justify-center rounded-full px-6 py-2 bg-[var(--gp-green)] text-white font-medium hover:bg-[var(--gp-green)]/90 transition-colors"
              >
                Get Started
              </AppLink>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-zinc-100 p-4 space-y-4"
          >
            <AppLink asLink href="#features" noUnderline className="block text-sm font-medium">Features</AppLink>
            <AppLink asLink href="#about" noUnderline className="block text-sm font-medium">About</AppLink>
            <AppLink asLink href="/login" noUnderline className="block text-sm font-medium">Sign In</AppLink>
            <AppButton fullWidth className="rounded-md">
              <AppLink asLink href="/register" noUnderline className="text-white hover:text-white">Get Started</AppLink>
            </AppButton>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gp-green)]/10 text-[var(--gp-green)] text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3 w-3 fill-current" />
              Revolutionizing Urban Mobility
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Ride the <span className="text-[var(--gp-green)]">Future</span> of Sustainable Living.
            </h1>
            <p className="text-lg text-zinc-600 max-w-lg leading-relaxed">
              Experience the perfect blend of performance, design, and eco-consciousness. Our electric bikes are built for the modern urban explorer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <AppButton size="xl" className="rounded-full shadow-xl shadow-gp-green/20 transition-all">
                Pre-order Now <ArrowRight className="ml-2 h-5 w-5" />
              </AppButton>
              <AppButton size="xl" variant="outline" className="rounded-full bg-transparent border-foreground/10 text-foreground hover:bg-gp-green hover:text-white transition-all">
                Explore Tech
              </AppButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[var(--gp-green)]/10 blur-[100px] rounded-full scale-75" />
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
              <Image
                src="/hero-ebike.png"
                alt="GreenPeddle Electric Bike"
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                style={{ width: "100%", height: "auto" }}
                className="object-cover"
                priority
              />
            </div>
            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-zinc-100 hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[var(--gp-green)]/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-[var(--gp-green)]" />
                </div>
                <div>
                  <div className="text-sm font-bold">5-Year Warranty</div>
                  <div className="text-xs text-zinc-500">Industry-leading protection</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Why Choose GreenPeddle?</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">Designed with precision, built for performance, and committed to a greener planet.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Zap,
                title: "Silent Power",
                description: "Our high-torque motors are whisper quiet yet deliver instant acceleration when you need it most."
              },
              {
                icon: Globe,
                title: "Zero Emissions",
                description: "Reduce your carbon footprint with every mile. GreenPeddle is 100% electric and eco-friendly."
              },
              {
                icon: Shield,
                title: "Built to Last",
                description: "Crafted from aerospace-grade aluminum and tested in the toughest conditions for maximum durability."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-white border border-foreground/5 hover:border-[var(--gp-green)]/20 hover:shadow-2xl hover:shadow-[var(--gp-green)]/5 transition-all group"
              >
                <div className="h-14 w-14 rounded-2xl bg-background flex items-center justify-center mb-6 group-hover:bg-[var(--gp-green)] group-hover:text-white transition-colors">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-[var(--gp-green)] rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to join the movement?</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Join thousands of riders already choosing a cleaner, faster, and smarter way to navigate the city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <AppButton size="xl" className="bg-white text-gp-green hover:bg-zinc-100 hover:text-gp-green rounded-full font-bold transition-all">
                Register Today
              </AppButton>
              <AppButton size="xl" variant="outline" className="border-white/20 hover:bg-white hover:text-gp-green rounded-full text-white transition-all">
                Contact Sales
              </AppButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-foreground/5">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <Leaf className="h-6 w-6 text-[var(--gp-green)]" />
            <span className="text-xl font-bold tracking-tight">GreenPeddle</span>
          </div>
          <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} GreenPeddle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
