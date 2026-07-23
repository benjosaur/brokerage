import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/Button";
import {
  CheckboxGroupField,
  SelectField,
  ServicesField,
  TextAreaField,
  TextField,
} from "../components/FormFields";
import { pageTitle } from "../components/tableStyles";
import { createClient, updateClient, useDemoData } from "../lib/store";
import {
  FUNDING_OPTIONS,
  LOCALITIES,
  type Client,
  type Service,
} from "../lib/types";

// Create/edit form limited to what the questionnaire captures. Fields the
// table dropped (custom ID, DOB, postcode, AA, deprivation, status) stay
// on the record untouched.
export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { clients } = useDemoData();
  const existing = isEditing
    ? clients.find((client) => client.id === id)
    : undefined;

  const [form, setForm] = useState(() => ({
    name: existing?.name ?? "",
    locality: existing?.locality ?? "",
    onboarded: existing?.onboarded.slice(0, 10) ?? "",
    funding: existing?.funding ?? ([] as string[]),
    services: existing?.services ?? ([] as Service[]),
    headline: existing?.headline ?? "",
  }));

  if (isEditing && !existing) return <div>Error loading client</div>;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const client: Omit<Client, "id"> = {
      customId: existing?.customId,
      dateOfBirth: existing?.dateOfBirth,
      postCode: existing?.postCode,
      attendanceAllowance: existing?.attendanceAllowance,
      deprivation: existing?.deprivation,
      status: existing?.status ?? "Active",
      name: form.name,
      locality: form.locality,
      onboarded: form.onboarded,
      funding: form.funding,
      services: form.services,
      headline: form.headline,
    };
    if (isEditing && existing) {
      updateClient({ ...client, id: existing.id });
    } else {
      createClient(client);
    }
    toast.success("Operation completed successfully");
    navigate("/coordinator/clients");
  };

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={pageTitle}>
          {isEditing ? "Edit Client" : "Create New Client"}
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
                id="agreementDate"
                label="Agreement Date"
                type="date"
                required
                value={form.onboarded}
                onChange={(value) => set("onboarded", value)}
              />
              <CheckboxGroupField
                label="Funding"
                options={FUNDING_OPTIONS}
                value={form.funding}
                onChange={(funding) => set("funding", funding)}
              />
              <ServicesField
                value={form.services}
                onChange={(services) => set("services", services)}
              />
              <TextAreaField
                id="headline"
                label="Support Sought"
                value={form.headline}
                onChange={(value) => set("headline", value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/coordinator/clients")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Client" : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
