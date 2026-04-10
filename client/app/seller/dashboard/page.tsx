"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Plus,
  Search,
  Settings,
  Bell,
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import AppCard from "@/components/core/card/AppCard";
import AppButton from "@/components/core/button/AppButton";
import AppLink from "@/components/core/link/AppLink";

export default function SellerDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "SELLER") {
      router.push("/login");
      return;
    }

    if (user?.sellerProfile?.approvalStatus === "PENDING") {
      router.push("/seller/pending-approval");
    }
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== "SELLER" || user.sellerProfile?.approvalStatus !== "APPROVED") {
    return null;
  }

  const stats = [
    { label: "Total Revenue", value: "₹0", icon: TrendingUp, color: "text-[var(--gp-green)]", bg: "bg-[var(--gp-green)]/10" },
    { label: "Active Orders", value: "0", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Products", value: "0", icon: Package, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Total Customers", value: "0", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 p-4 md:p-8 space-y-8 selection:bg-[var(--gp-green)]/20 selection:text-[var(--gp-green)]">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--gp-black)]">
            Welcome back, {user.sellerProfile?.storeName || user.name}!
          </h1>
          <p className="text-zinc-500 font-medium">Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
             <input 
               type="text" 
               placeholder="Search..." 
               className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gp-green)]/20 focus:border-[var(--gp-green)] transition-all w-64"
             />
          </div>
          <AppButton variant="outline" className="rounded-full p-2 h-auto text-zinc-500 border-zinc-200">
            <Bell className="w-5 h-5" />
          </AppButton>
          <AppButton className="rounded-full px-6 shadow-lg shadow-gp-green/20">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </AppButton>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <AppCard className="p-6 border-zinc-100/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-[var(--gp-black)] tracking-tight">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </AppCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
           <AppCard className="p-8 border-zinc-100/10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold">Recent Orders</h3>
                 <AppLink href="/seller/orders" className="text-xs font-bold text-[var(--gp-green)] hover:underline flex items-center">
                   View all <ChevronRight className="w-3 h-3 ml-1" />
                 </AppLink>
              </div>
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                 <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center border border-dashed border-zinc-200">
                    <ShoppingCart className="w-10 h-10 text-zinc-200" />
                 </div>
                 <div className="space-y-1">
                    <p className="font-bold text-zinc-400">No orders found yet</p>
                    <p className="text-sm text-zinc-300">Share your products to start getting orders!</p>
                 </div>
              </div>
           </AppCard>
        </div>

        {/* Sidebar info area */}
        <div className="space-y-8">
          <AppCard className="p-8 bg-[var(--gp-green)] text-white border-none shadow-xl shadow-gp-green/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-24 h-24" />
             </div>
             <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-bold">Store Optimization</h3>
                <p className="text-white/80 text-sm leading-relaxed font-medium">
                  Your store is <span className="text-white font-black underline">100% visible</span>. Complete your profile by adding more products to reach more riders.
                </p>
                <AppButton className="w-full bg-white text-[var(--gp-green)] hover:bg-zinc-100 hover:text-[var(--gp-green)] rounded-xl font-bold py-6">
                  Improve Ranking
                </AppButton>
             </div>
          </AppCard>

          <AppCard className="p-8 border-zinc-100/10 shadow-sm">
             <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
             <div className="space-y-2">
                {[
                  { label: "Update Inventory", icon: Package },
                  { label: "Store Settings", icon: Settings },
                  { label: "View Analytics", icon: TrendingUp }
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-colors group">
                     <div className="h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                        <action.icon className="w-5 h-5 text-zinc-500" />
                     </div>
                     <span className="font-bold text-zinc-600 group-hover:text-[var(--gp-black)] transition-colors">{action.label}</span>
                  </button>
                ))}
             </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
}
