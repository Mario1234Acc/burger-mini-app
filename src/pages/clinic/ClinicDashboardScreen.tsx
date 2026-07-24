import { useState } from 'react';
import { AlertOctagon, Bell, Calendar, CheckCircle2, ChevronDown, DoorOpen, Home, LogOut, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CLINICS, DOCTORS, SERVICES } from '../../constants/appData';
import { ClinicHome } from './ClinicHome';
import { ClinicProfile } from './ClinicProfile';
import type { Appointment, Clinic, Doctor } from '../../types';
import { ClinicAppointment } from './ClinicAppointment';

interface ClinicDashboardScreenProps {
  appointments: Appointment[];
  updateAppointment: (id: number, updates: Partial<Appointment>) => void;
  onSwitchApp: () => void;
}

export const ClinicDashboardScreen = ({ appointments, updateAppointment, onSwitchApp }: ClinicDashboardScreenProps) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'Appointment' | 'Profile'>('Home');
  const [activeView, setActiveView] = useState<'REQUESTS' | 'SCHEDULE'>('REQUESTS');
  const [approveTarget, setApproveTarget] = useState<Appointment | null>(null);
  const [approveForm, setApproveForm] = useState({ room: 'Consultation Room 1', note: '' });
  const [rejectTarget, setRejectTarget] = useState<Appointment | null>(null);
  const [rejectForm, setRejectForm] = useState({ reason: 'Fully Booked', customNote: '' });

  const [clinicInfo, setClinicInfo] = useState<Clinic>({ ...CLINICS[0] });
  const [services, setServices] = useState<string[]>(() => [...SERVICES]);
  const [doctors, setDoctors] = useState<Doctor[]>(() => [...DOCTORS]);
  const [newService, setNewService] = useState('');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorForm, setDoctorForm] = useState({ name: '', specialty: '', exp: '' });

  const myClinicAppointments = appointments.filter((appointment) => appointment.clinic.name === CLINICS[0].name);
  const pendingRequests = myClinicAppointments.filter((appointment) => appointment.status === 'Pending');
  const fullSchedule = [...myClinicAppointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleConfirmApprove = () => {
    if (!approveTarget) return;
    updateAppointment(approveTarget.id, {
      status: 'Approved',
      room: approveForm.room,
      clinicNote: approveForm.note,
    });
    setApproveTarget(null);
    setApproveForm({ room: 'Consultation Room 1', note: '' });
  };

  const handleConfirmReject = () => {
    if (!rejectTarget) return;
    const finalReason = rejectForm.reason === 'Other' ? rejectForm.customNote : `${rejectForm.reason}. ${rejectForm.customNote}`;
    updateAppointment(rejectTarget.id, {
      status: 'Cancelled',
      cancelReason: finalReason,
    });
    setRejectTarget(null);
    setRejectForm({ reason: 'Fully Booked', customNote: '' });
  };

  const handleClinicInfoChange = (field: keyof Clinic, value: string) => {
    if (field === 'specialties') {
      setClinicInfo((prev) => ({ ...prev, specialties: value.split(',').map((item) => item.trim()).filter(Boolean) }));
    } else {
      setClinicInfo((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddService = () => {
    const trimmed = newService.trim();
    if (!trimmed || services.includes(trimmed)) return;
    setServices((prev) => [...prev, trimmed]);
    setNewService('');
  };

  const handleRemoveService = (service: string) => {
    setServices((prev) => prev.filter((item) => item !== service));
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({ name: doctor.name, specialty: doctor.specialty, exp: doctor.exp });
  };

  const handleSaveDoctor = () => {
    const name = doctorForm.name.trim();
    if (!name || !doctorForm.specialty.trim() || !doctorForm.exp.trim()) return;
    if (editingDoctor) {
      setDoctors((prev) => prev.map((doc) => (doc.id === editingDoctor.id ? { ...doc, ...doctorForm } : doc)));
      setEditingDoctor(null);
      setDoctorForm({ name: '', specialty: '', exp: '' });
      return;
    }

    const nextId = doctors.reduce((maxId, doc) => Math.max(maxId, doc.id), 0) + 1;
    setDoctors((prev) => [...prev, { id: nextId, name, specialty: doctorForm.specialty.trim(), exp: doctorForm.exp.trim() }]);
    setDoctorForm({ name: '', specialty: '', exp: '' });
  };

  const handleRemoveDoctor = (id: number) => {
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    if (editingDoctor?.id === id) {
      setEditingDoctor(null);
      setDoctorForm({ name: '', specialty: '', exp: '' });
    }
  };

  return (
    <div className="h-screen relative bg-slate-50 flex flex-col font-sans">
      <header className="bg-teal-500 mb-3 pt-10 pb-24 px-6 rounded-b-[40px] relative shadow-lg overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-500/20 blur-3xl rounded-full"></div>
        <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full"></div>

        <div className="flex justify-between items-center relative z-10 mt-2">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-teal-100 text-[10px] font-bold uppercase tracking-widest mb-0.5">Facility Portal</p>
              <h1 className="text-xl font-bold text-white leading-tight">Sunrise Admin</h1>
            </div>
          </div>
          <button
            onClick={onSwitchApp}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {activeTab !== 'Profile' && (
        <div className="px-6 -mt-12 relative z-10 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-[24px] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-50 rounded-full z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex justify-between items-start mb-1">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Bell size={16} /></div>
                <span className="text-2xl font-black text-slate-800">{pendingRequests.length}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider relative z-10 mt-1">Pending Req.</p>
            </div>
            <div className="flex-1 bg-white rounded-[24px] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-teal-50 rounded-full z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex justify-between items-start mb-1">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center"><Users size={16} /></div>
                <span className="text-2xl font-black text-slate-800">{fullSchedule.length}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider relative z-10 mt-1">Total Appts</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow overflow-y-auto animate-fade-in pb-28">
        {activeTab === 'Home' && (
          <ClinicHome clinicInfo={clinicInfo} />
        )}

        {activeTab === 'Appointment' && (
          <ClinicAppointment
            appointments={myClinicAppointments}
            activeView={activeView}
            onSelectView={setActiveView}
            onApprove={setApproveTarget}
            onDecline={setRejectTarget}
            pendingRequestsCount={pendingRequests.length}
          />
        )}

        {activeTab === 'Profile' && (
          <ClinicProfile
            clinicInfo={clinicInfo}
            services={services}
            doctors={doctors}
            newService={newService}
            doctorForm={doctorForm}
            editingDoctor={editingDoctor}
            onClinicFieldChange={handleClinicInfoChange}
            onNewServiceChange={setNewService}
            onAddService={handleAddService}
            onRemoveService={handleRemoveService}
            onEditDoctor={handleEditDoctor}
            onSaveDoctor={handleSaveDoctor}
            onRemoveDoctor={handleRemoveDoctor}
            onDoctorFormChange={(field, value) => setDoctorForm((prev) => ({ ...prev, [field]: value }))}
            onClearEditingDoctor={() => setEditingDoctor(null)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
        <nav className="bg-white absolute mx-5 bottom-0 left-0 right-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full py-3.5 px-6 flex justify-between items-center border border-slate-100">
          {[
            { name: 'Home', icon: Home },
            { name: 'Appointment', icon: Calendar },
            { name: 'Profile', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name as 'Home' | 'Appointment' | 'Profile')}
                className={`relative flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-xl ${
                  isActive ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'transform -translate-y-0.5' : ''}
                />
                {isActive && <div className="absolute bottom-0 w-1 h-1 bg-teal-600 rounded-full" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* shadcn Dialog Component for Approve */}
      <Dialog open={!!approveTarget} onOpenChange={(open) => !open && setApproveTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-[32px] p-6 bg-white border-zinc-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900">Approve Request</DialogTitle>
          </DialogHeader>

          {approveTarget && (
            <div className="space-y-5 animate-fade-in mt-2">
              <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                <p className="text-xs text-teal-800 font-medium mb-1">Confirming schedule for</p>
                <h4 className="text-lg font-bold text-teal-900">{approveTarget.patientName || 'Demo User'}</h4>
                <p className="text-sm text-teal-700 font-semibold mt-1">{approveTarget.date} @ {approveTarget.time}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Assign Room</label>
                  <div className="relative">
                    <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <select
                      value={approveForm.room}
                      onChange={(e) => setApproveForm({ ...approveForm, room: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-medium appearance-none"
                    >
                      <option value="Consultation Room 1">Consultation Room 1</option>
                      <option value="Consultation Room 2">Consultation Room 2</option>
                      <option value="Treatment Room A">Treatment Room A</option>
                      <option value="Lab / Bloodwork">Lab / Bloodwork</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Instructions for Patient (Optional)</label>
                  <textarea
                    value={approveForm.note}
                    onChange={(e) => setApproveForm({ ...approveForm, note: e.target.value })}
                    placeholder="e.g., Please fast for 8 hours prior, arrive 15 minutes early..."
                    className="w-full h-24 p-3 rounded-xl border border-zinc-200 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => setApproveTarget(null)} 
                  className="flex-1 h-12 rounded-xl border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmApprove} 
                  className="flex-[2] h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Confirm & Notify
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* shadcn Dialog Component for Reject */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-[32px] p-6 bg-white border-zinc-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900">Decline Request</DialogTitle>
          </DialogHeader>

          {rejectTarget && (
            <div className="space-y-5 animate-fade-in mt-2">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3 items-start">
                <AlertOctagon className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-red-900 font-medium">You are declining the appointment request for <strong>{rejectTarget.patientName || 'Demo User'}</strong> on {rejectTarget.date}.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Reason for Decline</label>
                  <div className="relative">
                    <select
                      value={rejectForm.reason}
                      onChange={(e) => setRejectForm({ ...rejectForm, reason: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium appearance-none"
                    >
                      <option value="Fully Booked">Slot Fully Booked</option>
                      <option value="Doctor Unavailable">Doctor Unavailable</option>
                      <option value="Service Not Available">Service Not Available</option>
                      <option value="Other">Other / Custom Reason</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Message to Patient {rejectForm.reason === 'Other' && <span className="text-red-500">*</span>}</label>
                  <textarea
                    value={rejectForm.customNote}
                    onChange={(e) => setRejectForm({ ...rejectForm, customNote: e.target.value })}
                    placeholder="Explain why the appointment is declined or suggest an alternative time..."
                    className="w-full h-24 p-3 rounded-xl border border-zinc-200 bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => setRejectTarget(null)} 
                  className="flex-1 h-12 rounded-xl border-zinc-200 text-zinc-700 font-bold hover:bg-zinc-100"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  disabled={rejectForm.reason === 'Other' && !rejectForm.customNote.trim()}
                  className={`flex-[2] h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    rejectForm.reason === 'Other' && !rejectForm.customNote.trim()
                      ? 'bg-red-200 text-white cursor-not-allowed hover:bg-red-200'
                      : 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                  }`}
                >
                  Decline Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};