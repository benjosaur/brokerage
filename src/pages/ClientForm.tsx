import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/Button";
import {
  CheckboxField,
  SelectField,
  ServicesField,
  TextAreaField,
  TextField,
} from "../components/FormFields";
import { pageTitle } from "../components/tableStyles";
import { createClient, updateClient, useDemoData } from "../lib/store";
import {
  ATTENDANCE_ALLOWANCE_STATUSES,
  LOCALITIES,
  type AttendanceAllowanceStatus,
  type Client,
  type Service,
} from "../lib/types";

const STATUSES = ["Active", "Matched", "New request"] as const;

// Create/edit form following Paddock's ClientForm page layout.
export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { clients } = useDemoData();
  const existing = isEditing
    ? clients.find((client) => client.id === id)
    : undefined;

  const [form, setForm] = useState(() => ({
    customId: existing?.customId ?? "",
    name: existing?.name ?? "",
    dateOfBirth: existing?.dateOfBirth ?? "",
    locality: existing?.locality ?? "",
    postCode: existing?.postCode ?? "",
    onboarded: existing?.onboarded.slice(0, 10) ?? "",
    status: existing?.status ?? ("New request" as Client["status"]),
    attendanceAllowance:
      existing?.attendanceAllowance ?? ("None" as AttendanceAllowanceStatus),
    depIncome: existing?.deprivation?.income ?? false,
    depHealth: existing?.deprivation?.health ?? false,
    services: existing?.services ?? ([] as Service[]),
    headline: existing?.headline ?? "",
  }));

  if (isEditing && !existing) return <div>Error loading client</div>;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const client: Omit<Client, "id"> = {
      customId: form.customId || undefined,
      name: form.name,
      dateOfBirth: form.dateOfBirth || undefined,
      locality: form.locality,
      postCode: form.postCode || undefined,
      services: form.services,
      onboarded: form.onboarded,
      status: form.status,
      attendanceAllowance: form.attendanceAllowance,
      deprivation: { income: form.depIncome, health: form.depHealth },
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
                id="customId"
                label="Custom ID"
                value={form.customId}
                onChange={(value) => set("customId", value)}
              />
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
                value={form.postCode}
                onChange={(value) => set("postCode", value)}
              />
              <TextField
                id="agreementDate"
                label="Agreement Date"
                type="date"
                required
                value={form.onboarded}
                onChange={(value) => set("onboarded", value)}
              />
              <SelectField
                id="status"
                label="Status"
                value={form.status}
                options={STATUSES}
                onChange={(value) => set("status", value as Client["status"])}
              />
              <SelectField
                id="attendanceAllowance"
                label="AA Status"
                value={form.attendanceAllowance}
                options={ATTENDANCE_ALLOWANCE_STATUSES}
                onChange={(value) =>
                  set(
                    "attendanceAllowance",
                    value as AttendanceAllowanceStatus,
                  )
                }
              />
              <div>
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Deprivation Flags
                </span>
                <div className="space-y-2">
                  <CheckboxField
                    id="depIncome"
                    label="Income deprivation"
                    checked={form.depIncome}
                    onChange={(checked) => set("depIncome", checked)}
                  />
                  <CheckboxField
                    id="depHealth"
                    label="Health deprivation"
                    checked={form.depHealth}
                    onChange={(checked) => set("depHealth", checked)}
                  />
                </div>
              </div>
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
