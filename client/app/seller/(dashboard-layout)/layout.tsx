"use client";

import SellerSidebarLayout from "@/components/feature/seller/SellerSidebarLayout";

export default function SellerDashboardRoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerSidebarLayout>
      {children}
    </SellerSidebarLayout>
  );
}
