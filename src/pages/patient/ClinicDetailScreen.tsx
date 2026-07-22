import { useMemo, useState } from 'react';
import { AlertCircle, Calendar, Check, CheckCircle2, ChevronRight, Clock, User } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Modal } from '../../components/ui/Modal';
import { DOCTORS, SERVICES, USER } from '../../constants/appData';
import type { Clinic, Doctor } from '../../types';

interface ClinicDetailScreenProps {
  clinic: Clinic;
  onBack: () => void;
  onBook: (details: any) => void;
}

export const ClinicDetailScreen = ({ clinic, onBack, onBook }: ClinicDetailScreenProps) => {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleProceed = () => {
    if (!date || !time) {
      setErrorMsg('Please select a date and time.');
      return;
    }
    setErrorMsg('');
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    onBook({ clinic, service: selectedService, doctor: selectedDoctor, date, time, note, patientName: USER.name });
  };

  return (
    <div className="flex flex-col h-full animate-slide-in-right bg-zinc-50 z-30 absolute inset-0">
      <Header onBack={onBack} title="Book Appointment" />

      <main className="flex-grow overflow-y-auto px-6 pb-32 pt-2">
        <div className="w-full h-40 rounded-[32px] mb-8 flex flex-col justify-end p-6 text-white shadow-lg relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${clinic.image})` }}>
          <div className={`absolute inset-0 bg-gradient-to-t ${clinic.color} opacity-90 mix-blend-multiply`}></div>
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-md w-max px-3 py-1 rounded-full text-[10px] font-bold mb-2 border border-white/20 uppercase tracking-wider">
              {clinic.type}
            </div>
            <h2 className="text-2xl font-bold tracking-tight shadow-sm">{clinic.name}</h2>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="font-bold text-zinc-900 mb-3 tracking-tight">Service Needed</h3>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => setSelectedService(service)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  selectedService === service ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-zinc-900 mb-3 tracking-tight">Available Specialists</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {DOCTORS.map((doctor) => {
              const isSelected = selectedDoctor.id === doctor.id;
              return (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`w-36 flex-shrink-0 p-3 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all active:scale-[0.98] relative ${
                    isSelected ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-transparent bg-white shadow-sm hover:border-zinc-200'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-sm z-10">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-teal-600 mb-2">
                    <User size={20} />
                  </div>
                  <h4 className="font-bold text-zinc-900 text-sm leading-tight">Dr. {doctor.name}</h4>
                  <p className="text-[10px] font-medium text-zinc-500 mt-1">{doctor.specialty}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="font-bold text-zinc-900 mb-3 tracking-tight">Date & Time</h3>
          <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border border-zinc-100">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600" size={16} />
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-2 py-3 rounded-xl bg-transparent outline-none focus:ring-0 text-sm font-semibold text-zinc-800"
              />
            </div>
            <div className="w-px bg-zinc-100 my-2"></div>
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600" size={16} />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-9 pr-2 py-3 rounded-xl bg-transparent outline-none focus:ring-0 text-sm font-semibold text-zinc-800"
              />
            </div>
          </div>
          {errorMsg && <p className="text-red-500 text-xs font-semibold mt-3 animate-fade-in flex items-center gap-1"><AlertCircle size={14} /> {errorMsg}</p>}
        </section>

        <section className="mb-4">
          <h3 className="font-bold text-zinc-900 mb-2 tracking-tight">Reason for Visit (Optional)</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Briefly describe your symptoms or reason for visit..."
            className="w-full h-24 p-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm resize-none shadow-sm"
          />
        </section>
      </main>

      <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent pt-12">
        <button
          onClick={handleProceed}
          type="button"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-full shadow-[0_8px_20px_rgba(13,148,136,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
        >
          Proceed <ChevronRight size={20} />
        </button>
      </div>

      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Review Booking">
        <div className="space-y-4 animate-fade-in">
          <div className="w-full bg-white border border-zinc-100 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col border-b border-zinc-100 pb-3">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Facility</span>
              <span className="font-bold text-zinc-900 text-lg">{clinic.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <span className="text-zinc-500 text-sm font-medium">Service</span>
              <span className="font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-sm">{selectedService}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <span className="text-zinc-500 text-sm font-medium">Specialist</span>
              <span className="font-bold text-zinc-900 text-sm">Dr. {selectedDoctor.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
              <span className="text-zinc-500 text-sm font-medium">Schedule</span>
              <span className="font-bold text-sm text-right text-zinc-900">
                <span className="text-teal-600">{date}</span> <br /> {time}
              </span>
            </div>
            {note && (
              <div className="flex flex-col pt-1">
                <span className="text-zinc-500 text-sm font-medium mb-1">Note to Clinic</span>
                <span className="text-zinc-700 text-sm italic">"{note}"</span>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold active:scale-95 transition-all">
              Edit
            </button>
            <button onClick={handleConfirm} className="flex-[2] py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
