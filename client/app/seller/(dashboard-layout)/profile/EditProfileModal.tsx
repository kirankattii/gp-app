"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  updateProfileSchema, 
  updateAddressSchema, 
  updateBankSchema 
} from "@/schemas/sellerSchemas";
import { sellerService } from "@/services/sellerService";
import { toast } from "sonner";
import AppModal from "@/components/core/model/AppModal";
import { AppInput } from "@/components/core/form/AppInput";
import { AppTextarea } from "@/components/core/form/AppTextarea";
import AppButton from "@/components/core/button/AppButton";
import { Save, X } from "lucide-react";

export type SectionType = "basic" | "address" | "bank";

interface EditProfileModalProps {
  show: boolean;
  onClose: () => void;
  section: SectionType;
  initialData: any;
  onSuccess: () => void;
}

const getSectionConfig = (section: SectionType) => {
  switch (section) {
    case "basic":
      return {
        title: "Edit Personal Details",
        schema: updateProfileSchema,
        updateFn: sellerService.updateProfile,
      };
    case "address":
      return {
        title: "Edit Store Address",
        schema: updateAddressSchema,
        updateFn: sellerService.updateAddress,
      };
    case "bank":
      return {
        title: "Edit Bank Details",
        schema: updateBankSchema,
        updateFn: sellerService.updateBankDetails,
      };
  }
};

export default function EditProfileModal({
  show,
  onClose,
  section,
  initialData,
  onSuccess,
}: EditProfileModalProps) {
  const config = getSectionConfig(section);
  
  const form = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: initialData || {},
  });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      // Handle special cases like pincode being numeric in backend if needed
      const submissionData = section === 'address' ? { ...data, pincode: parseInt(data.pincode, 10) } : data;
      
      const response = await config.updateFn(submissionData);
      
      if (response.data?.success) {
        toast.success(`${config.title} updated successfully`);
        onSuccess();
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error(`Error updating ${section}:`, error);
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal show={show} callback={({ action }) => action === "close" && onClose()}>
      <AppModal.Title onClose={onClose}>{config.title}</AppModal.Title>
      <AppModal.Content>
        <form id="edit-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {section === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                label="Store Name"
                name="storeName"
                register={form.register}
                error={form.formState.errors.storeName?.message as string}
                className="md:col-span-2"
              />
              <AppInput
                label="Mobile Number"
                name="mobileNumber"
                register={form.register}
                error={form.formState.errors.mobileNumber?.message as string}
              />
              <AppInput
                label="Business Type"
                name="businessType"
                register={form.register}
                error={form.formState.errors.businessType?.message as string}
              />
              <AppInput
                label="GSTIN (Optional)"
                name="gstin"
                register={form.register}
                error={form.formState.errors.gstin?.message as string}
              />
              <AppInput
                label="PAN Card Number"
                name="pan"
                register={form.register}
                error={form.formState.errors.pan?.message as string}
              />
            </div>
          )}

          {section === "address" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                label="Pincode"
                name="pincode"
                register={form.register}
                error={form.formState.errors.pincode?.message as string}
              />
              <AppInput
                label="State"
                name="state"
                register={form.register}
                error={form.formState.errors.state?.message as string}
              />
              <AppInput
                label="District"
                name="district"
                register={form.register}
                error={form.formState.errors.district?.message as string}
              />
              <AppInput
                label="City / Town"
                name="town"
                register={form.register}
                error={form.formState.errors.town?.message as string}
              />
              <div className="md:col-span-2">
                <AppTextarea
                  label="Full Address"
                  name="fullAddress"
                  register={form.register}
                  error={form.formState.errors.fullAddress?.message as string}
                />
              </div>
            </div>
          )}

          {section === "bank" && (
            <div className="grid grid-cols-1 gap-4">
              <AppInput
                label="Bank Account Number"
                name="bankAccountNumber"
                register={form.register}
                error={form.formState.errors.bankAccountNumber?.message as string}
              />
              <AppInput
                label="IFSC Code"
                name="ifscCode"
                register={form.register}
                error={form.formState.errors.ifscCode?.message as string}
              />
            </div>
          )}
        </form>
      </AppModal.Content>
      <AppModal.Footer>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            form="edit-profile-form"
            loading={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </AppButton>
        </div>
      </AppModal.Footer>
    </AppModal>
  );
}
