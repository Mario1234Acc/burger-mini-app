import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CalendarCheck, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MessageSquare, 
  Stethoscope, 
  User 
} from 'lucide-react';
import type { Appointment } from '../../types';

interface ClinicAppointmentProps {
  appointments: Appointment[];
  activeView: 'REQUESTS' | 'SCHEDULE';
  onSelectView: (view: 'REQUESTS' | 'SCHEDULE') => void;
  onApprove: (appointment: Appointment) => void;
  onDecline: (appointment: Appointment) => void;
  pendingRequestsCount: number;
}

export const ClinicAppointment = ({
  appointments,
  activeView,
  onSelectView,
  onApprove,
  onDecline,
  pendingRequestsCount,
}: ClinicAppointmentProps) => {
  // --- Calendar State ---
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const pendingRequests = appointments.filter((appointment) => appointment.status === 'Pending');
  
  // Sort full schedule chronologically
  const fullSchedule = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group the full schedule by Date so it renders nicely in the timeline
  const groupedSchedule = fullSchedule.reduce((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // --- Calendar Helpers ---
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  // Format date safely to YYYY-MM-DD
  const formatDateString = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <>
      {/* Top Toggle Navigation */}
      <div className="px-6 mb-4">
        <div className="flex bg-slate-200/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-sm">
          <button
            onClick={() => onSelectView('REQUESTS')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeView === 'REQUESTS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Requests {pendingRequestsCount > 0 && <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] shadow-sm">{pendingRequestsCount}</span>}
          </button>
          <button
            onClick={() => onSelectView('SCHEDULE')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeView === 'SCHEDULE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Master Schedule
          </button>
        </div>
      </div>

      {/* -------------------- REQUESTS VIEW -------------------- */}
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
                        <CalendarIcon size={14} />
                      </div>
                      <div>
                        <span className="font-bold text-sm block leading-tight">{apt.date}</span>
                        <span className="text-xs text-slate-500 font-medium">{apt.time}</span>
                      </div>
                    </div>
                  </div>

                  {apt.note && (
                    <div className="mb-5 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3 items-start">
                      <MessageSquare size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 italic leading-relaxed">"{apt.note}"</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => onDecline(apt)} className="flex-1 bg-white border-2 border-slate-100 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-95">
                      Decline
                    </button>
                    <button onClick={() => onApprove(apt)} className="flex-[2] bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all active:scale-95 shadow-[0_8px_20px_rgba(13,148,136,0.25)] flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} /> Approve
                    </button>
                  </div>
                </div>
            ))
          )}
        </div>
      )}

      {/* -------------------- SCHEDULE VIEW -------------------- */}
      {activeView === 'SCHEDULE' && (
        <div className="px-6 mt-2 animate-fade-in">
          
          {/* Custom Calendar Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={prevMonth} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
              >
                <ChevronLeft size={18}/>
              </button>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button 
                onClick={nextMonth} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
              >
                <ChevronRight size={18}/>
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day}</div>
              ))}
              
              {/* Empty slots for days before the 1st of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const dateStr = formatDateString(dateObj);
                
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
                
                // Show active state if there is an appointment on this day in the fullSchedule
                const hasAppt = fullSchedule.some(a => a.date === dateStr);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateObj)}
                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm font-semibold transition-all relative ${
                      isSelected 
                        ? 'bg-teal-600 text-white shadow-md' 
                        : hasAppt
                        ? 'bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-xl mb-4 tracking-tight">All Tasks</h3>
          
          {/* Timeline UI (Showing ALL appointments from fullSchedule) */}
          {fullSchedule.length === 0 ? (
            <div className="text-center py-10 bg-white/50 rounded-[24px] border border-slate-100 border-dashed">
              <p className="text-slate-400 font-medium">Schedule is empty.</p>
            </div>
          ) : (
            <div>
              {Object.entries(groupedSchedule).map(([dateStr, dayApts]) => (
                <div key={dateStr} className="mb-6">
                  
                  {/* Date Separator */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-slate-200 flex-grow"></div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                      {dateStr === formatDateString(new Date()) ? 'Today' : dateStr}
                    </span>
                    <div className="h-px bg-slate-200 flex-grow"></div>
                  </div>

                  <div className="space-y-0">
                    {dayApts.map((apt) => (
                      <div key={apt.id} className="flex gap-4">
                        {/* Left Column: Vertical Time */}
                        <div className="w-8 shrink-0 flex flex-col items-center pt-8 relative">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest -rotate-90 whitespace-nowrap absolute top-12">
                            {apt.time}
                          </span>
                        </div>

                        {/* Right Column: Timeline Card */}
                        <div className="relative border-l-2 border-slate-100/80 pl-6 pb-6 w-full group">
                          {/* Timeline Node/Dot */}
                          <div className={`absolute -left-[5px] top-6 w-2 h-2 rounded-full ${
                            apt.status === 'Approved' ? 'bg-teal-500 ring-4 ring-teal-50' : 
                            apt.status === 'Pending' ? 'bg-amber-400 ring-4 ring-amber-50' : 
                            'bg-slate-300 ring-4 ring-slate-50'
                          }`}></div>

                          {/* Content Card */}
                          <div className="bg-white hover:bg-teal-50/30 p-5 rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-slate-900 text-lg">{apt.patientName || 'Demo User'}</h4>
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                apt.status === 'Approved' ? 'bg-teal-50 text-teal-700' :
                                apt.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                              Consultation regarding {apt.service.toLowerCase()} with Dr. {apt.doctor.name}.
                            </p>

                            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                              <span className="text-[11px] font-semibold text-slate-400">
                                Room: {apt.room || 'TBD'}
                              </span>
                              <div className="flex gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                  <CheckCircle2 size={12} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};