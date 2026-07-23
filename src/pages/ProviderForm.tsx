import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/Button";
import {
  SelectField,
  ServicesField,
  TextAreaField,
  TextField,
} from "../components/FormFields";
import { pageTitle } from "../components/tableStyles";
import { createProvider, updateProvider, useDemoData } from "../lib/store";
import { LOCALITIES, type MicroProvider, type Service } from "../lib/types";

// Create/edit form following Paddock's MpForm page layout, including its
// empty-fee-date-means-unpaid behaviour.
export default function ProviderForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { providers } = useDemoData();
  const existing = isEditing
    ? providers.find((provider) => provider.id === id)
    : undefined;

  const [form, setForm] = useState(() => ({
    name: existing?.name ?? "",
    dateOfBirth: existing?.dateOfBirth ?? "",
    locality: existing?.locality ?? "",
    postCode: existing?.postCode ?? "",
    phone: existing?.phone ?? "",
    email: existing?.email ?? "",
    startDate: existing?.startDate ?? "",
    dbsNumber: existing?.dbsNumber ?? "",
    dbsExpiry: existing?.dbsExpiry ?? "",
    publicLiabilityNumber: existing?.publicLiabilityNumber ?? "",
    publicLiabilityExpiry: existing?.publicLiabilityExpiry ?? "",
    feePaymentDate:
      existing && existing.feePaymentDate !== "unpaid"
        ? existing.feePaymentDate
        : "",
    services: existing?.services ?? ([] as Service[]),
    availability: existing?.availability ?? "",
    bio: existing?.bio ?? "",
  }));

  if (isEditing && !existing) return <div>Error loading micro-provider</div>;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const provider: Omit<MicroProvider, "id"> = {
      name: form.name,
      locality: form.locality,
      areasCovered: existing?.areasCovered ?? [],
      // The public results cards only ever show the outward code.
      outwardPostcode: form.postCode.trim().split(/\s+/)[0].toUpperCase(),
      postCode: form.postCode,
      dateOfBirth: form.dateOfBirth || undefined,
      services: form.services,
      bio: form.bio,
      availability: form.availability,
      email: form.email,
      phone: form.phone,
      startDate: form.startDate,
      dbsNumber: form.dbsNumber,
      dbsExpiry: form.dbsExpiry,
      publicLiabilityNumber: form.publicLiabilityNumber,
      publicLiabilityExpiry: form.publicLiabilityExpiry,
      feePaymentDate: form.feePaymentDate || "unpaid",
      training: existing?.training ?? [],
    };
    if (isEditing && existing) {
      updateProvider({ ...provider, id: existing.id });
    } else {
      createProvider(provider);
    }
    toast.success("Operation completed successfully");
    navigate("/coordinator/providers");
  };

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={pageTitle}>
          {isEditing ? "Edit Micro-provider" : "Create New Micro-provider"}
        </h1>
      </div>

      <div className="rounded-xl border border-gray-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                General Information
              </h3>
              <TextField
                id="name"
                label="Name"
                required
                value={form.name}
                onChange={(value) => set("name", value)}
              />
              <TextField
                id="dob"
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(value) => set("dateOfBirth", value)}
              />
              <SelectField
                id="locality"
                label="Locality"
                required
                value={form.locality}
                options={LOCALITIES}
                placeholder="Select locality..."
                onChange={(value) => set("locality", value)}
              />
              <TextField
                id="postCode"
                label="Post Code"
                required
                value={form.postCode}
                onChange={(value) => set("postCode", value)}
              />
              <TextField
                id="phone"
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(value) => set("phone", value)}
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => set("email", value)}
              />
              <TextField
                id="startDate"
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(value) => set("startDate", value)}
              />
              <TextField
                id="dbsNumber"
                label="DBS Number"
                value={form.dbsNumber}
                onChange={(value) => set("dbsNumber", value)}
              />
              <TextField
                id="dbsExpiry"
                label="DBS Expiry"
                type="date"
                value={form.dbsExpiry}
                onChange={(value) => set("dbsExpiry", value)}
              />
              <TextField
                id="publicLiabilityNumber"
                label="Public Liability Number"
                value={form.publicLiabilityNumber}
                onChange={(value) => set("publicLiabilityNumber", value)}
              />
              <TextField
                id="publicLiabilityExpiry"
                label="Public Liability Expiry"
                type="date"
                value={form.publicLiabilityExpiry}
                onChange={(value) => set("publicLiabilityExpiry", value)}
              />
              <TextField
                id="feePaymentDate"
                label="Fee Payment Date"
                type="date"
                value={form.feePaymentDate}
                onChange={(value) => set("feePaymentDate", value)}
              />
              <ServicesField
                value={form.services}
                onChange={(services) => set("services", services)}
              />
              <TextField
                id="availability"
                label="Availability"
                value={form.availability}
                onChange={(value) => set("availability", value)}
              />
              <TextAreaField
                id="bio"
                label="Bio"
                value={form.bio}
                onChange={(value) => set("bio", value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/coordinator/providers")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Micro-provider" : "Create Micro-provider"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
