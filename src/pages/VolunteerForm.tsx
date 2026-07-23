import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/Button";
import { SelectField, TextField } from "../components/FormFields";
import { pageTitle } from "../components/tableStyles";
import { createVolunteer, updateVolunteer, useDemoData } from "../lib/store";
import { LOCALITIES, type Volunteer } from "../lib/types";

// Create/edit form following Paddock's VolunteerForm page layout.
export default function VolunteerForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { volunteers } = useDemoData();
  const existing = isEditing
    ? volunteers.find((volunteer) => volunteer.id === id)
    : undefined;

  const [form, setForm] = useState(() => ({
    name: existing?.name ?? "",
    role: existing?.role ?? "",
    dateOfBirth: existing?.dateOfBirth ?? "",
    locality: existing?.locality ?? "",
    postCode: existing?.postCode ?? "",
    phone: existing?.phone ?? "",
    email: existing?.email ?? "",
    since: existing?.since ?? "",
    dbsNumber: existing?.dbsNumber ?? "",
    dbsExpiry: existing?.dbsExpiry ?? "",
    publicLiabilityNumber: existing?.publicLiabilityNumber ?? "",
    publicLiabilityExpiry: existing?.publicLiabilityExpiry ?? "",
  }));

  if (isEditing && !existing) return <div>Error loading volunteer</div>;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const volunteer: Omit<Volunteer, "id"> = {
      name: form.name,
      role: form.role,
      dateOfBirth: form.dateOfBirth || undefined,
      locality: form.locality,
      postCode: form.postCode,
      email: form.email,
      phone: form.phone,
      since: form.since,
      dbsNumber: form.dbsNumber,
      dbsExpiry: form.dbsExpiry,
      publicLiabilityNumber: form.publicLiabilityNumber || undefined,
      publicLiabilityExpiry: form.publicLiabilityExpiry || undefined,
      training: existing?.training ?? [],
    };
    if (isEditing && existing) {
      updateVolunteer({ ...volunteer, id: existing.id });
    } else {
      createVolunteer(volunteer);
    }
    toast.success("Operation completed successfully");
    navigate("/coordinator/volunteers");
  };

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={pageTitle}>
          {isEditing ? "Edit Volunteer" : "Create New Volunteer"}
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
                id="role"
                label="Role"
                required
                value={form.role}
                onChange={(value) => set("role", value)}
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
                id="since"
                label="Volunteering Since"
                type="date"
                value={form.since}
                onChange={(value) => set("since", value)}
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
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/coordinator/volunteers")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Volunteer" : "Create Volunteer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
