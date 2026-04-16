"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  User, 
  MapPin, 
  Building2, 
  Edit2, 
  Mail, 
  Phone, 
  Store,
  CreditCard,
  Briefcase
} from "lucide-react";
import AppCard from "@/components/core/card/AppCard";
import KeyValue from "@/components/core/key-value/KeyValue";
import AppButton from "@/components/core/button/AppButton";
import { sellerService } from "@/services/sellerService";
import AppSpinner from "@/components/core/Spinner/AppSpinner";
import NoData from "@/components/core/no-data/NoData";
import AppBreadcrumbs from "@/components/core/breadcrumbs/AppBreadcrumbs";
import EditProfileModal, { SectionType } from "./EditProfileModal";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalState, setModalState] = useState<{
    show: boolean;
    section: SectionType;
  }>({
    show: false,
    section: "basic",
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sellerService.getProfile();
      if (response.data?.success) {
        setProfile(response.data.data);
      } else {
        setError(response.data?.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError("An error occurred while fetching your profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEdit = (section: SectionType) => {
    setModalState({
      show: true,
      section,
    });
  };

  const closeBrowser = () => {
    setModalState((prev) => ({ ...prev, show: false }));
  };

  const breadcrumbs = [
    { label: "Dashboard", redirect: { path: "/seller/dashboard" } },
    { label: "Profile" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <AppSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <NoData>
          <h5 className="mb-2 text-red-500 font-bold">{error}</h5>
          <AppButton onClick={fetchProfile} variant="outline">Retry</AppButton>
        </NoData>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <AppBreadcrumbs data={breadcrumbs} />
        <h1 className="text-3xl font-bold text-[var(--gp-black)]">Store Profile</h1>
        <p className="text-zinc-500">View and manage your business information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <AppCard className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-[var(--gp-green)] to-[var(--gp-dark-green)] text-white p-0">
            <div className="p-8 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center mx-auto shadow-inner">
                <Store className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.storeName}</h2>
                <p className="text-white/80 font-medium">{profile.businessType}</p>
              </div>
              <div className="pt-4 flex flex-col items-center gap-2 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.user?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.mobileNumber}</span>
                </div>
              </div>
            </div>
          </AppCard>

          <AppCard title="Account Info" icon={<User className="w-5 h-5" />} className="shadow-lg border-zinc-100">
             <div className="space-y-4">
               <KeyValue label="User ID" size="sm" horizontal className="justify-between">
                 <span className="font-mono text-zinc-400">{profile.userId?.substring(0, 10)}...</span>
               </KeyValue>
               <KeyValue label="Status" size="sm" horizontal className="justify-between">
                 <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                   Active Seller
                 </span>
               </KeyValue>
             </div>
          </AppCard>
        </div>

        {/* Right Column: Detailed Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Basic Details */}
          <AppCard 
            title="Personal & Business Details" 
            icon={<Briefcase className="w-5 h-5 text-[var(--gp-green)]" />}
            className="shadow-md border-zinc-100"
            footer={
              <div className="flex justify-end p-4 border-t border-zinc-50 bg-zinc-50/50">
                <AppButton 
                  onClick={() => handleEdit("basic")} 
                  variant="ghost" 
                  className="text-[var(--gp-green)] hover:bg-[var(--gp-green)]/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Section
                </AppButton>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              <KeyValue label="Store Name" icon={Store}>{profile.storeName}</KeyValue>
              <KeyValue label="Mobile Number" icon={Phone}>{profile.mobileNumber}</KeyValue>
              <KeyValue label="Business Type" icon={Briefcase}>{profile.businessType}</KeyValue>
              <KeyValue label="GSTIN" icon={Briefcase}>{profile.gstin || "Not provided"}</KeyValue>
              <KeyValue label="PAN Number" icon={CreditCard}>{profile.pan}</KeyValue>
            </div>
          </AppCard>

          {/* Section 2: Store Address */}
          <AppCard 
            title="Store Address" 
            icon={<MapPin className="w-5 h-5 text-[var(--gp-green)]" />}
            className="shadow-md border-zinc-100"
            footer={
              <div className="flex justify-end p-4 border-t border-zinc-50 bg-zinc-50/50">
                <AppButton 
                  onClick={() => handleEdit("address")} 
                  variant="ghost" 
                  className="text-[var(--gp-green)] hover:bg-[var(--gp-green)]/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Section
                </AppButton>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              <KeyValue label="Pincode" icon={MapPin}>{profile.pincode}</KeyValue>
              <KeyValue label="State" icon={MapPin}>{profile.state}</KeyValue>
              <KeyValue label="District" icon={MapPin}>{profile.district}</KeyValue>
              <KeyValue label="Town / City" icon={MapPin}>{profile.town}</KeyValue>
              <div className="md:col-span-2">
                <KeyValue label="Full Address" icon={MapPin}>{profile.fullAddress}</KeyValue>
              </div>
            </div>
          </AppCard>

          {/* Section 3: Bank Details */}
          <AppCard 
            title="Payout & Bank Details" 
            icon={<Building2 className="w-5 h-5 text-[var(--gp-green)]" />}
            className="shadow-md border-zinc-100"
            footer={
              <div className="flex justify-end p-4 border-t border-zinc-50 bg-zinc-50/50">
                <AppButton 
                  onClick={() => handleEdit("bank")} 
                  variant="ghost" 
                  className="text-[var(--gp-green)] hover:bg-[var(--gp-green)]/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Section
                </AppButton>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              <KeyValue label="Bank Account Number" icon={CreditCard}>{profile.bankAccountNumber}</KeyValue>
              <KeyValue label="IFSC Code" icon={Building2}>{profile.ifscCode}</KeyValue>
            </div>
          </AppCard>
        </div>
      </div>

      <EditProfileModal
        show={modalState.show}
        section={modalState.section}
        initialData={profile}
        onClose={closeBrowser}
        onSuccess={fetchProfile}
      />
    </div>
  );
}
