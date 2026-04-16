"use client";

import React from "react";
import { ShoppingCart, Search, Filter, Calendar } from "lucide-react";
import AppCard from "@/components/core/card/AppCard";
import AppButton from "@/components/core/button/AppButton";

export default function SellerOrdersPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-[var(--gp-black)] uppercase">
            Customer Orders
          </h1>
          <p className="text-zinc-500 font-medium">Keep track of your sales and fulfillment status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <AppButton className="rounded-2xl px-6 shadow-lg shadow-gp-green/20 font-bold bg-[var(--gp-green)] text-white hover:bg-[var(--gp-green-hover)]">
            <Calendar className="w-5 h-5 mr-2" />
            Download Report
          </AppButton>
        </div>
      </header>

      <AppCard className="p-0 border-zinc-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-50 flex flex-wrap items-center justify-between gap-4 bg-zinc-50/50">
           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-zinc-200 w-full md:w-96 shadow-sm">
              <Search className="w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search orders by Order ID or Customer name..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
           </div>
           <div className="flex items-center gap-2">
              <AppButton variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 font-bold">
                 <Filter className="w-4 h-4 mr-2" />
                 All Status
              </AppButton>
           </div>
        </div>

        <div className="flex flex-col items-center justify-center py-32 text-center bg-white">
           <div className="h-24 w-24 bg-[var(--gp-beige)] rounded-3xl flex items-center justify-center mb-6 shadow-inner">
              <ShoppingCart className="w-12 h-12 text-[var(--gp-green)]/40" />
           </div>
           <h3 className="text-xl font-black text-[var(--gp-black)] mb-2 uppercase">No Orders Yet</h3>
           <p className="text-zinc-400 max-w-sm font-medium">
             Your store is live and ready to receive orders. Check back later for new customer purchases.
           </p>
           <AppButton className="mt-8 rounded-2xl px-8 font-black bg-[var(--gp-green)] text-white hover:bg-[var(--gp-green-hover)]">
              View Sample Order
           </AppButton>
        </div>
      </AppCard>
    </div>
  );
}
