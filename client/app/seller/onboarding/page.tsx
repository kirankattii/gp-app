"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeOnboardingSchema } from "@/schemas/sellerSchemas";
import { sellerService } from "@/services/sellerService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { 
  Store, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";
import AppCard from "@/components/core/card/AppCard";
import { AppInput } from "@/components/core/form/AppInput";
import AppButton from "@/components/core/button/AppButton";
import { AppTextarea } from "@/components/core/form/AppTextarea";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const STEPS = [
  { id: 1, title: "Basic Details", icon: Store },
  { id: 2, title: "Address Info", icon: MapPin },
  { id: 3, title: "Bank Details", icon: Building2 },
];

export default function SellerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const form = useForm<z.infer<typeof completeOnboardingSchema>>({
    resolver: zodResolver(completeOnboardingSchema),
    mode: "onBlur",
    defaultValues: {
      storeName: "",
      mobileNumber: "",
      businessType: "",
      gstin: "",
      pan: "",
      pincode: "",
      state: "",
      district: "",
      town: "",
      fullAddress: "",
      bankAccountNumber: "",
      ifscCode: "",
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: sellerService.completeOnboarding,
    onSuccess: () => {
      toast.success("Profile setup complete! Awaiting admin approval.");
      router.push("/seller/pending-approval");
    },
    onError: (error: any) => {
      const responseData = error?.response?.data;
      if (responseData?.errors) {
        // Handle Zod validation errors from backend
        const firstError = Object.values(responseData.errors).flat()[0];
        toast.error(typeof firstError === 'string' ? firstError : "Submission failed. Please check your inputs.");
      } else {
        toast.error(responseData?.message || "Failed to submit details. Please try again.");
      }
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["storeName", "mobileNumber", "businessType", "gstin", "pan"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["pincode", "state", "district", "town", "fullAddress"];
    }

    const isStepValid = await form.trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data: z.infer<typeof completeOnboardingSchema>) => {
    // Ensure pincode is a number for the backend
    const submissionData = {
      ...data,
      pincode: parseInt(data.pincode, 10),
    };
    onboardingMutation.mutate(submissionData);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--gp-black)] text-center">
            Complete Your Profile
          </h1>
          <p className="text-zinc-500 font-medium">
            Just a few more details to start selling on GreenPeddle
          </p>
        </div>

        {/* Timeline Stepper */}
        <div className="relative border-b border-zinc-200 pb-8">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-[var(--gp-green)] -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}></div>
          <div className="flex justify-between z-10 w-full px-2">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-300 ${
                      isActive ? "bg-[var(--gp-green)] text-white shadow-xl shadow-gp-green/30" : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {isActive && !isCurrent ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-xs font-bold transition-colors ${isActive ? "text-[var(--gp-black)]" : "text-zinc-400"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <AppCard className="p-8 shadow-2xl shadow-black/5 bg-white rounded-3xl border border-zinc-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[var(--gp-black)]">Basic Details</h2>
                  <p className="text-sm text-zinc-500">Tell us about your business.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AppInput
                    label="Store Name"
                    placeholder="E.g. Green Valley Farm"
                    name="storeName"
                    register={form.register}
                    error={form.formState.errors.storeName?.message}
                    className="md:col-span-2"
                  />
                  <AppInput
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    name="mobileNumber"
                    register={form.register}
                    error={form.formState.errors.mobileNumber?.message}
                  />
                  <AppInput
                    label="Business Type"
                    placeholder="E.g. Wholesaler"
                    name="businessType"
                    register={form.register}
                    error={form.formState.errors.businessType?.message}
                  />
                  <AppInput
                    label="GSTIN (Optional)"
                    placeholder="Your GSTIN"
                    name="gstin"
                    register={form.register}
                    error={form.formState.errors.gstin?.message}
                  />
                  <AppInput
                    label="PAN Card Number"
                    placeholder="Your PAN details"
                    name="pan"
                    register={form.register}
                    error={form.formState.errors.pan?.message}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[var(--gp-black)]">Address Information</h2>
                  <p className="text-sm text-zinc-500">Where is your business located?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AppInput
                    label="Pincode"
                    placeholder="6-digit pincode"
                    name="pincode"
                    register={form.register}
                    error={form.formState.errors.pincode?.message}
                  />
                  <AppInput
                    label="State"
                    placeholder="Your state"
                    name="state"
                    register={form.register}
                    error={form.formState.errors.state?.message}
                  />
                  <AppInput
                    label="District"
                    placeholder="Your district"
                    name="district"
                    register={form.register}
                    error={form.formState.errors.district?.message}
                  />
                  <AppInput
                    label="City / Town"
                    placeholder="Your city"
                    name="town"
                    register={form.register}
                    error={form.formState.errors.town?.message}
                  />
                  <div className="md:col-span-2">
                    <AppTextarea
                      label="Full Address (Street, Building etc.)"
                      placeholder="Enter detailed address"
                      name="fullAddress"
                      register={form.register}
                      error={form.formState.errors.fullAddress?.message}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank Details */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                 <div>
                  <h2 className="text-xl font-bold text-[var(--gp-black)]">Bank Details</h2>
                  <p className="text-sm text-zinc-500">Provide bank details for payouts.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <AppInput
                    label="Bank Account Number"
                    placeholder="Enter account number"
                    name="bankAccountNumber"
                    register={form.register}
                    error={form.formState.errors.bankAccountNumber?.message}
                  />
                  <AppInput
                    label="IFSC Code"
                    placeholder="E.g. SBIN0001234"
                    name="ifscCode"
                    register={form.register}
                    error={form.formState.errors.ifscCode?.message}
                  />
                 </div>
              </div>
            )}

            <div className="pt-6 flex items-center justify-between border-t border-zinc-100">
              <AppButton
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1 || onboardingMutation.isPending}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </AppButton>
              
              {currentStep < STEPS.length ? (
                <AppButton type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </AppButton>
              ) : (
                <AppButton type="submit" loading={onboardingMutation.isPending}>
                  Submit Details
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </AppButton>
              )}
            </div>

          </form>
        </AppCard>

      </div>
    </div>
  );
}
