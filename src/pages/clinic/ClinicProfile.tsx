import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Clinic, Doctor } from '../../types';

interface ClinicProfileProps {
  clinicInfo: Clinic;
  services: string[];
  doctors: Doctor[];
  newService: string;
  doctorForm: { name: string; specialty: string; exp: string };
  editingDoctor: Doctor | null;
  onClinicFieldChange: (field: keyof Clinic, value: string) => void;
  onNewServiceChange: (value: string) => void;
  onAddService: () => void;
  onRemoveService: (service: string) => void;
  onEditDoctor: (doctor: Doctor) => void;
  onSaveDoctor: () => void;
  onRemoveDoctor: (id: number) => void;
  onDoctorFormChange: (field: 'name' | 'specialty' | 'exp', value: string) => void;
  onClearEditingDoctor?: () => void;
}

export const ClinicProfile = ({
  clinicInfo,
  services,
  doctors,
  newService,
  doctorForm,
  editingDoctor,
  onClinicFieldChange,
  onNewServiceChange,
  onAddService,
  onRemoveService,
  onEditDoctor,
  onSaveDoctor,
  onRemoveDoctor,
  onDoctorFormChange,
  onClearEditingDoctor,
}: ClinicProfileProps) => {
  const [serviceToRemove, setServiceToRemove] = useState<string | null>(null);
  const [doctorToRemove, setDoctorToRemove] = useState<Doctor | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  return (
    <div className="px-6 space-y-6 pb-12">
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold mb-2">Clinic Info</p>
            <h2 className="text-xl font-bold text-slate-900">Edit clinic details</h2>
          </div>
          <span className="text-xs font-semibold uppercase text-teal-700 bg-teal-100 px-3 py-1 rounded-full">Admin</span>
        </div>

        <div className="grid gap-4">
          <label className="block text-sm font-semibold text-slate-700">Clinic Name</label>
          <input
            value={clinicInfo.name}
            onChange={(e) => onClinicFieldChange('name', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />

          <label className="block text-sm font-semibold text-slate-700">Type</label>
          <input
            value={clinicInfo.type}
            onChange={(e) => onClinicFieldChange('type', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Address</label>
              <input
                value={clinicInfo.address}
                onChange={(e) => onClinicFieldChange('address', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Distance</label>
              <input
                value={clinicInfo.distance}
                onChange={(e) => onClinicFieldChange('distance', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700">Specialties (comma separated)</label>
          <input
            value={clinicInfo.specialties.join(', ')}
            onChange={(e) => onClinicFieldChange('specialties', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold mb-2">Services</p>
            <h2 className="text-xl font-bold text-slate-900">Manage services</h2>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            value={newService}
            onChange={(e) => onNewServiceChange(e.target.value)}
            placeholder="Add new service"
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <button
            type="button"
            onClick={onAddService}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-bold text-white hover:bg-teal-700 transition"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="grid gap-3">
          {services.map((service) => (
            <div key={service} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-700">{service}</span>
              <button type="button" onClick={() => setServiceToRemove(service)} className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-sm">
                <Trash2 size={14} /> Remove
              </button>
            </div>
          ))}
        </div>

        <Dialog open={!!serviceToRemove} onOpenChange={(open) => !open && setServiceToRemove(null)}>
          <DialogContent className="sm:max-w-md rounded-[20px] p-6 bg-white border-zinc-100 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Remove service</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-700 mt-2">Are you sure you want to remove <strong>{serviceToRemove}</strong> from services? This action cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <Button variant="outline" onClick={() => setServiceToRemove(null)} className="flex-1">Cancel</Button>
              <Button onClick={() => { if (serviceToRemove) onRemoveService(serviceToRemove); setServiceToRemove(null); }} className="flex-1 bg-rose-500">Remove</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold mb-2">Doctors</p>
            <h2 className="text-xl font-bold text-slate-900">Manage staff</h2>
          </div>
          <div>
            <button type="button" onClick={() => { onDoctorFormChange('name', ''); onDoctorFormChange('specialty', ''); onDoctorFormChange('exp', ''); onClearEditingDoctor?.(); setShowDoctorModal(true); }} className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-3 py-2 text-sm font-bold text-white hover:bg-teal-700 transition">Add Staff</button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="font-semibold text-slate-900">Dr. {doctor.name}</p>
                <p className="text-sm text-slate-500">{doctor.specialty} • {doctor.exp}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { onEditDoctor(doctor); setShowDoctorModal(true); }} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-flex items-center gap-2 inline-flex">
                  <Pencil size={14} /> Edit
                </button>
                <button type="button" onClick={() => setDoctorToRemove(doctor)} className="rounded-2xl border border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Doctor add/edit handled by modal */}
      </div>

      {/* Confirm remove doctor dialog */}
      <Dialog open={!!doctorToRemove} onOpenChange={(open) => !open && setDoctorToRemove(null)}>
        <DialogContent className="sm:max-w-md rounded-[20px] p-6 bg-white border-zinc-100 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Remove staff</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-700 mt-2">Are you sure you want to remove <strong>{doctorToRemove?.name}</strong> from staff? This action cannot be undone.</p>
          <div className="flex gap-3 mt-5">
            <Button variant="outline" onClick={() => setDoctorToRemove(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => { if (doctorToRemove) onRemoveDoctor(doctorToRemove.id); setDoctorToRemove(null); }} className="flex-1 bg-rose-500">Remove</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Doctor Add/Edit Modal */}
      <Dialog open={showDoctorModal} onOpenChange={(open) => !open && (setShowDoctorModal(false), onClearEditingDoctor?.())}>
        <DialogContent className="sm:max-w-md rounded-[20px] p-6 bg-white border-zinc-100 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editingDoctor ? 'Edit staff' : 'Add staff'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mt-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Name</label>
              <input
                value={doctorForm.name}
                onChange={(e) => onDoctorFormChange('name', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Specialty</label>
              <input
                value={doctorForm.specialty}
                onChange={(e) => onDoctorFormChange('specialty', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Experience</label>
              <input
                value={doctorForm.exp}
                onChange={(e) => onDoctorFormChange('exp', e.target.value)}
                placeholder="e.g., 10 Yrs"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setShowDoctorModal(false); onClearEditingDoctor?.(); }} className="flex-1">Cancel</Button>
              <Button onClick={() => { onSaveDoctor(); setShowDoctorModal(false); onClearEditingDoctor?.(); }} className="flex-1 bg-teal-600">{editingDoctor ? 'Save' : 'Add'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
