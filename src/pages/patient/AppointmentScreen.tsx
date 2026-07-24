import { useState } from 'react';
import { AlertCircle, Calendar, DoorOpen, MessageSquare, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Appointment } from '../../types';
import { getAppointmentStatusDisplay, getAppointmentStatusMessage } from '../../utils/appointment';

interface AppointmentScreenProps {
  appointments: Appointment[];
}

export const AppointmentScreen = ({ appointments }: AppointmentScreenProps) => {
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  return (
    <main className="px-6 animate-fade-in pb-32 h-full">
      <h2 className="text-xl font-bold text-zinc-900 tracking-tight mb-6">Schedule Planner</h2>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-400 space-y-4">
          <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center">
            <Calendar size={32} className="text-zinc-300" />
          </div>
          <p className="font-medium text-zinc-500">No upcoming appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const statusCfg = getAppointmentStatusDisplay(apt.status || 'Approved');
            const StatusIcon = statusCfg.icon;

            return (
              <div key={apt.id || `${apt.date}${apt.time}`} className="p-5 rounded-[24px] bg-white shadow-sm border border-zinc-100 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg leading-tight mb-1">{apt.clinic.name}</h3>
                    <p className="text-zinc-500 text-xs font-medium">{apt.service} • {apt.date} at {apt.time}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-50 relative z-10">
                  <div className="text-sm font-medium text-zinc-700">Dr. {apt.doctor.name}</div>
                  <button
                    onClick={() => setSelectedApt(apt)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${statusCfg.style} border border-transparent hover:border-current/20`}
                  >
                    <StatusIcon size={12} strokeWidth={2.5} /> {apt.status || 'Approved'} <Phone size={10} className="ml-0.5 opacity-60" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* shadcn Dialog Component */}
      <Dialog open={!!selectedApt} onOpenChange={(open) => !open && setSelectedApt(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white border-zinc-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900">Status Details</DialogTitle>
          </DialogHeader>

          {selectedApt && (
            <div className="space-y-5 mt-2">
              <div className={`p-4 rounded-2xl flex items-start gap-3 ${getAppointmentStatusDisplay(selectedApt.status).style}`}>
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Status: {selectedApt.status}</h4>
                  <p className="text-xs mt-1 opacity-90">{getAppointmentStatusMessage(selectedApt.status, selectedApt.cancelReason)}</p>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 rounded-2xl text-sm space-y-2 border border-zinc-100">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Clinic</span>
                  <span className="font-bold text-zinc-900">{selectedApt.clinic.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Time</span>
                  <span className="font-bold text-zinc-900">{selectedApt.date} • {selectedApt.time}</span>
                </div>
                {selectedApt.room && (
                  <div className="flex justify-between pt-2 border-t border-zinc-200 mt-2">
                    <span className="text-zinc-500 flex items-center gap-1"><DoorOpen size={14} /> Room</span>
                    <span className="font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">{selectedApt.room}</span>
                  </div>
                )}
                {selectedApt.clinicNote && (
                  <div className="pt-2 border-t border-zinc-200 mt-2">
                    <span className="text-zinc-500 flex items-center gap-1 mb-1"><MessageSquare size={14} /> Instructions</span>
                    <p className="text-zinc-800 font-medium bg-white p-2 rounded-lg border border-zinc-100">{selectedApt.clinicNote}</p>
                  </div>
                )}
              </div>

              <Button className="w-full h-12 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm transition-transform">
                <Phone size={16} /> Contact Facility
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};