import { useState } from 'react';
import { AlertOctagon, Bell, Calendar, CalendarCheck, CheckCircle2, ChevronDown, Clock, DoorOpen, LogOut, MessageSquare, Stethoscope, User, Users } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { CLINICS } from '../../constants/appData';
import type { Appointment } from '../../types';

interface ClinicDashboardScreenProps {
  appointments: Appointment[];
  updateAppointment: (id: number, updates: Partial<Appointment>) => void;
  onSwitchApp: () => void;
}

export const ClinicDashboardScreen = ({ appointments, updateAppointment, onSwitchApp }: ClinicDashboardScreenProps) => {
  const [activeView, setActiveView] = useState('REQUESTS');
  const [approveTarget, setApproveTarget] = useState<Appointment | null>(null);
  const [approveForm, setApproveForm] = useState({ room: 'Consultation Room 1', note: '' });
  const [rejectTarget, setRejectTarget] = useState<Appointment | null>(null);
  const [rejectForm, setRejectForm] = useState({ reason: 'Fully Booked', customNote: '' });

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 pt-10 pb-24 px-6 rounded-b-[40px] relative shadow-lg overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-500/20 blur-3xl rounded-full"></div>
        <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full"></div>

        <div className="flex justify-between items-center relative z-10 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md border border-teal-300/30">
              SH
            </div>
            <div>
              <p className="text-teal-300 text-[10px] font-bold uppercase tracking-widest mb-0.5">Facility Portal</p>
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

      <div className="px-6 mb-4 sticky top-4 z-20">
        <div className="flex bg-slate-200/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-sm">
          <button
            onClick={() => setActiveView('REQUESTS')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeView === 'REQUESTS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Requests {pendingRequests.length > 0 && <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] shadow-sm">{pendingRequests.length}</span>}
          </button>
          <button
            onClick={() => setActiveView('SCHEDULE')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeView === 'SCHEDULE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Master Schedule
          </button>
        </div>
      </div>

      <main className="flex-grow overflow-y-auto animate-fade-in pb-12">
        {activeView === 'REQUESTS' && (
          <div className="px-6 space-y-5">
            {pendingRequests.length === 0 ? (
              <div className="text-center mt-12 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <CalendarCheck size={32} />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">No Pending Requests</h3>
                <p className="text-slate-500 text-sm mt-1">Your review queue is completely clear.</p>
              </div>
            ) : (
              pendingRequests.map((apt) => (
                <div key={apt.id} className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-orange-400"></div>

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-11 h-11 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg border border-slate-200">
                        {apt.patientName ? apt.patientName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{apt.patientName || 'Demo User'}</h3>
                        <p className="text-xs text-slate-500 font-medium">Patient Request</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100/50 flex items-center gap-1">
                      <Clock size={10} /> Needs Review
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Requested Service</p>
                      <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5"><Stethoscope size={14} className="text-teal-600" /> {apt.service}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Specialist</p>
                      <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5"><User size={14} className="text-teal-600" /> Dr. {apt.doctor.name}</p>
                    </div>
                    <div className="col-span-2 mt-1 flex items-center gap-2 text-slate-800 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <span className="font-bold text-sm block leading-tight">{apt.date}</span>
                        <span className="text-xs text-slate-500 font-medium">{apt.time}</span>
                      </div>
                    </div>
                  </div>

                  {apt.note && (
                    <div className="mb-5 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3 items-start">
                      <MessageSquare size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 italic leading-relaxed">"{apt.note}"</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => setRejectTarget(apt)} className="flex-1 bg-white border-2 border-slate-100 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-95">
                      Decline
                    </button>
                    <button onClick={() => setApproveTarget(apt)} className="flex-[2] bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-95 shadow-[0_8px_20px_rgba(13,148,136,0.25)] flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} /> Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === 'SCHEDULE' && (
          <div className="px-6 mt-4">
            {fullSchedule.length === 0 ? (
              <p className="text-slate-500 text-center mt-10">Schedule is empty.</p>
            ) : (
              <div className="space-y-0">
                {fullSchedule.map((apt) => (
                  <div key={apt.id} className="relative pl-6 pb-6 border-l-2 border-slate-200 last:border-l-transparent">
                    <div className={`absolute -left-[7px] top-2 w-3 h-3 rounded-full ring-4 ring-slate-50 ${apt.status === 'Approved' ? 'bg-teal-500' : apt.status === 'Pending' ? 'bg-amber-400' : apt.status === 'Cancelled' ? 'bg-slate-300' : 'bg-blue-500'}`}></div>

                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{apt.patientName || 'Demo User'}</h4>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{apt.service} • Dr. {apt.doctor.name}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex-shrink-0 ${
                          apt.status === 'Approved' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                          apt.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          apt.status === 'Cancelled' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                          'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>{apt.status}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <Clock size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{apt.date}</p>
                          <p className="text-[10px] font-semibold text-slate-500">{apt.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Modal isOpen={!!approveTarget} onClose={() => setApproveTarget(null)} title="Approve Request">
        {approveTarget && (
          <div className="space-y-5 animate-fade-in">
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
              <button onClick={() => setApproveTarget(null)} className="flex-1 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold active:scale-95 transition-all">
                Cancel
              </button>
              <button onClick={handleConfirmApprove} className="flex-[2] py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Confirm & Notify
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Decline Request">
        {rejectTarget && (
          <div className="space-y-5 animate-fade-in">
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
              <button onClick={() => setRejectTarget(null)} className="flex-1 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold active:scale-95 transition-all">
                Back
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={rejectForm.reason === 'Other' && !rejectForm.customNote.trim()}
                className={`flex-[2] py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  rejectForm.reason === 'Other' && !rejectForm.customNote.trim()
                    ? 'bg-red-200 text-white cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-md active:scale-95'
                }`}
              >
                Decline Request
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
