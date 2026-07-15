import { useState, useMemo, useEffect } from 'react';
import {
  Home, Calendar, FileText, User, Search,
  MapPin, Filter, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, Check, Eye, Share2, Phone, X,
  AlertCircle, Building2, CalendarCheck, ArrowLeftRight,
  Stethoscope, ChevronDown, DoorOpen, MessageSquare, AlertOctagon,
  LogOut, Users, Bell
} from 'lucide-react';

const USER = { initials: 'DU', name: 'Demo User', avatar: 'bg-teal-100 text-teal-700' };

const CLINICS = [
  { id: 1, name: 'Sunrise Hospital', type: 'Premium Hospital', specialties: ['General', 'Cardiology', 'Surgery', 'Pediatrics', 'Dental'], address: 'Phnom Penh', distance: '1.2 km', color: 'from-teal-500 to-emerald-400', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Royal Phnom Penh', type: 'International Hospital', specialties: ['Emergency', 'Maternity', 'Orthopedics'], address: 'Toul Kork', distance: '3.5 km', color: 'from-blue-500 to-indigo-400', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Japan Eye Clinic', type: 'Specialist', specialties: ['Eye Care', 'Lasik', 'Optometry'], address: 'BKK1', distance: '0.8 km', color: 'from-orange-400 to-red-400', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const SERVICES = ['General Checkup', 'Cardiology', 'Pediatrics', 'Dental', 'Eye Care', 'Lab Test'];

const DOCTORS = [
  { id: 1, name: 'Sun Panha', specialty: 'General Medicine', exp: '8 Yrs' },
  { id: 2, name: 'Chea Vanda', specialty: 'Cardiology', exp: '12 Yrs' },
  { id: 3, name: 'Sok Mean', specialty: 'Pediatrics', exp: '5 Yrs' },
];

const INITIAL_RECORDS = [
  { id: 1, patient: 'Robert Chen', date: 'Jul 10, 2026', clinic: 'Sunrise Hospital', status: 'Completed', type: 'teal',
    soap: {
      subjective: "Patient complains of persistent tension headaches for the past 3 days, localized to the frontal region. Rates pain as 6/10.",
      objective: "BP: 120/80 mmHg, Temp: 37.2°C, HR: 72 bpm. Neurological exam reveals normal cranial nerve function. No neck stiffness.",
      assessment: "Primary tension-type headache. No signs of secondary causes.",
      plan: "1. Ibuprofen 400mg PRN for pain.\n2. Advised adequate hydration and stress management.\n3. Follow up in 1 week if symptoms persist."
    }
  },
  { id: 2, patient: 'Dara Pheakdey', date: 'Jul 02, 2026', clinic: 'Japan Eye Clinic', status: 'Pending Result', type: 'blue',
    soap: {
      subjective: "Patient reports blurred vision in the right eye over the last month.",
      objective: "Visual Acuity: OD 20/40, OS 20/20. Slit-lamp exam normal. IOP: OD 15, OS 14.",
      assessment: "Mild myopia in right eye.",
      plan: "1. Prescribed corrective lenses.\n2. Return for annual checkup."
    }
  },
];

const DEFAULT_APPOINTMENTS = [
  { id: 101, clinic: CLINICS[0], service: 'General Checkup', doctor: DOCTORS[0], date: 'Jul 20, 2026', time: '10:00 AM', status: 'Approved' },
  // These pending ones will show up immediately in the Clinic portal's request tab
  { id: 105, clinic: CLINICS[0], patientName: 'Sok San', service: 'Cardiology', doctor: DOCTORS[1], date: 'Jul 21, 2026', time: '09:00 AM', status: 'Pending', note: 'Experiencing mild chest palpitations after morning jogs.' },
  { id: 106, clinic: CLINICS[0], patientName: 'Nita Ly', service: 'Pediatrics', doctor: DOCTORS[2], date: 'Jul 21, 2026', time: '02:00 PM', status: 'Pending', note: 'Child has had a low-grade fever for 2 days. Need a general assessment.' },
  
  { id: 102, clinic: CLINICS[2], service: 'Eye Care', doctor: DOCTORS[2], date: 'Jul 22, 2026', time: '02:30 PM', status: 'Pending' },
  { id: 103, clinic: CLINICS[1], service: 'Lab Test', doctor: DOCTORS[1], date: 'Jul 25, 2026', time: '08:00 AM', status: 'Ready' },
  { id: 104, clinic: CLINICS[0], service: 'Cardiology', doctor: DOCTORS[1], date: 'Jul 28, 2026', time: '04:00 PM', status: 'Call Hospital' },
];

const SpecialtyBadges = ({ specialties }) => {
  const display = specialties.slice(0, 3);
  const remaining = specialties.length - 3;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {display.map(s => (
        <span key={s} className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md">
          {s}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-[10px] font-bold bg-teal-50 text-teal-600 px-2 py-1 rounded-md">
          +{remaining}
        </span>
      )}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 sticky top-0 z-10">
          <h3 className="font-bold text-zinc-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

const Header = ({ title, user, onBack, rightAction }) => (
  <header className="px-6 py-4 flex items-center justify-between bg-zinc-50/80 backdrop-blur-md sticky top-0 z-20">
    {onBack ? (
      <button onClick={onBack} type="button" className="p-2 -ml-2 text-zinc-800 hover:bg-white rounded-full transition-all active:scale-90 shadow-sm border border-zinc-100 bg-white">
        <ChevronLeft size={20} />
      </button>
    ) : user ? (
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${user.avatar} flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white`}>
          {user.initials}
        </div>
        <div>
          <p className="text-xs text-zinc-500 font-medium">Good Morning,</p>
          <h1 className="text-lg font-bold text-zinc-900 tracking-tight">{user.name}</h1>
        </div>
      </div>
    ) : null}
    {title && <h1 className="text-lg font-bold text-zinc-900 tracking-tight absolute left-1/2 transform -translate-x-1/2">{title}</h1>}
    
    {rightAction && (
      <div className="flex justify-end min-w-[48px]">{rightAction}</div>
    )}
  </header>
);

const RoleSelectionScreen = ({ onSelectRole }) => {
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');
  const fullText = "Welcome to QlinicOS";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(timer);
      }
    }, 70);

    const cursorTimer = setInterval(() => setShowCursor(c => !c), 500);
    
    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  const welcomePart = text.length > 11 ? text.slice(0, 11) : text;
  const brandPart = text.length > 11 ? text.slice(11) : '';

  const roles = [
    { id: 'PATIENT', title: 'Patient Portal', desc: 'Book and manage appointments', icon: User },
    { id: 'CLINIC', title: 'Facility Admin', desc: 'Manage your clinic schedule', icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans px-6 py-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] bg-emerald-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

      <div className="mb-10 mt-12 min-h-[110px] relative z-10">
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
          {welcomePart}
          <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">{brandPart}</span>
          <span className={`inline-block w-1.5 h-8 ml-1.5 bg-teal-500 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 rounded-full`}></span>
        </h1>
        <p className={`text-sm text-zinc-500 mt-4 transition-all duration-1000 transform ${text.length >= fullText.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Please select your designated role to initialize your secure session.
        </p>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selected === role.id;
          
          return (
            <div 
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`relative p-5 rounded-[28px] cursor-pointer transition-all duration-500 group overflow-hidden ${
                isSelected 
                  ? 'bg-zinc-900 text-white shadow-2xl shadow-teal-900/20 transform scale-[1.02] border border-zinc-800' 
                  : 'bg-white text-zinc-900 border border-zinc-100 shadow-sm hover:shadow-md hover:border-teal-100'
              }`}
              style={{ 
                opacity: text.length > 5 ? 1 : 0, 
                transform: text.length > 5 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${index * 150}ms`
              }}
            >
              {isSelected && <div className="absolute -right-10 -top-10 w-32 h-32 bg-teal-500/20 blur-2xl rounded-full z-0"></div>}
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-500 ${
                    isSelected 
                      ? 'bg-teal-500 text-white shadow-inner' 
                      : 'bg-zinc-50 text-zinc-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                  }`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-0.5 ${isSelected ? 'text-white' : 'text-zinc-900'}`}>{role.title}</h3>
                    <p className={`text-xs font-medium ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>{role.desc}</p>
                  </div>
                </div>
                
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isSelected 
                    ? 'bg-teal-500 text-white scale-100 shadow-sm' 
                    : 'bg-transparent border-2 border-zinc-200 text-transparent scale-90 group-hover:border-teal-200'
                }`}>
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-auto pt-8 pb-4 relative z-10 transition-all duration-1000 transform ${text.length >= fullText.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button 
          disabled={!selected}
          onClick={() => onSelectRole(selected)}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-500 flex items-center justify-center gap-2 ${
            selected 
              ? 'bg-teal-600 text-white shadow-[0_8px_30px_rgba(13,148,136,0.3)] active:scale-95 transform translate-y-0' 
              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed transform translate-y-2'
          }`}
        >
          Continue <ChevronRight size={20} className={selected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} style={{ transition: 'all 0.3s' }}/>
        </button>
      </div>
    </div>
  );
};

const HomeScreen = ({ onSelectClinic }) => {
  const [isMapView, setIsMapView] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterProvince, setFilterProvince] = useState('All');
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  const PROVINCES = ['All', 'Phnom Penh', 'Siem Reap', 'Battambang', 'Kampot', 'Sihanoukville', 'Kandal'];
  const SPECIALTIES = ['All', 'General', 'Cardiology', 'Pediatrics', 'Dental', 'Eye Care', 'Maternity', 'Orthopedics'];

  const filteredClinics = CLINICS.filter(clinic => {
    const matchesProvince = filterProvince === 'All' || clinic.address.includes(filterProvince) || (filterProvince === 'Phnom Penh' && ['Toul Kork', 'BKK1'].includes(clinic.address));
    const matchesSpecialty = filterSpecialty === 'All' || clinic.specialties.includes(filterSpecialty);
    return matchesProvince && matchesSpecialty;
  });

  return (
    <main className="px-6 animate-fade-in pb-32">
      <div className="relative mb-6 shadow-sm rounded-full bg-white border border-zinc-100">
        <Search className="absolute left-4 top-4 text-zinc-400" size={20} />
        <input 
          type="text" 
          placeholder="Search clinics, doctors..." 
          className="w-full pl-12 pr-4 py-4 rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-teal-400 transition-all text-zinc-800 placeholder-zinc-400"
        />
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-full text-sm font-medium whitespace-nowrap shadow-sm active:scale-95 transition-transform"
        >
          <Filter size={16} /> Filters {(filterProvince !== 'All' || filterSpecialty !== 'All') && <span className="w-2 h-2 rounded-full bg-red-400 border border-white"></span>}
        </button>
        <button 
          onClick={() => setIsMapView(!isMapView)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm border border-zinc-100 active:scale-95 transition-transform ${isMapView ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white text-zinc-600'}`}
        >
          <MapPin size={16} /> {isMapView ? 'List View' : 'Map View'}
        </button>
      </div>
      
      {isMapView ? (
        <div className="relative w-full h-[50vh] bg-zinc-100 rounded-[32px] border border-zinc-200 overflow-hidden shadow-inner animate-fade-in flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="text-center z-10 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white">
             <MapPin size={32} className="mx-auto mb-2 text-teal-500" />
             <h3 className="font-bold text-zinc-800">Interactive Map</h3>
             <p className="text-xs text-zinc-500 mt-1">Simulated view for prototype</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredClinics.length > 0 ? filteredClinics.map((clinic) => (
            <div 
              key={clinic.id} 
              onClick={() => onSelectClinic(clinic)}
              className="group rounded-3xl bg-white border border-zinc-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="h-32 w-full relative bg-cover bg-center" style={{ backgroundImage: `url(${clinic.image})` }}>
                <div className={`absolute inset-0 bg-gradient-to-t ${clinic.color} mix-blend-multiply opacity-60`}></div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-zinc-800 shadow-sm">
                  <MapPin size={12} className="text-teal-600" />
                  <span className="text-[10px] font-bold">{clinic.distance}</span>
                </div>
              </div>
              <div className="p-4 bg-white relative">
                <div className="absolute -top-8 left-4 w-14 h-14 rounded-2xl bg-white p-1 shadow-md">
                   <div className="w-full h-full bg-zinc-50 rounded-xl flex items-center justify-center text-teal-600">
                      <Building2 size={24} strokeWidth={1.5} />
                   </div>
                </div>
                <div className="pl-[72px] mb-2">
                  <h3 className="font-bold text-zinc-900 leading-tight">{clinic.name}</h3>
                  <p className="text-xs text-zinc-500 font-medium">{clinic.type}</p>
                </div>
                <div className="pt-2">
                  <SpecialtyBadges specialties={clinic.specialties} />
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 bg-white rounded-3xl border border-zinc-100 shadow-sm mt-4">
               <p className="text-zinc-500 font-medium">No clinics match your filters.</p>
               <button 
                 onClick={() => { setFilterProvince('All'); setFilterSpecialty('All'); }} 
                 className="mt-4 text-teal-700 font-bold bg-teal-50 px-5 py-2.5 rounded-full text-sm active:scale-95 transition-transform"
               >
                 Clear Filters
               </button>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filter Clinics">
        <div className="space-y-5">
           <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Province in Cambodia</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <select 
                  value={filterProvince} 
                  onChange={e => setFilterProvince(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-medium appearance-none cursor-pointer"
                >
                  {PROVINCES.map(p => <option key={p} value={p}>{p === 'All' ? 'All Provinces' : p}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
              </div>
           </div>
           
           <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Specialty</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <select 
                  value={filterSpecialty} 
                  onChange={e => setFilterSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Specialties' : s}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
              </div>
           </div>

           <div className="flex gap-3 pt-4 border-t border-zinc-100 mt-6">
              <button 
                onClick={() => { setFilterProvince('All'); setFilterSpecialty('All'); setIsFilterOpen(false); }} 
                className="flex-1 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold active:scale-95 transition-all"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)} 
                className="flex-[2] py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-[0_8px_20px_rgba(13,148,136,0.25)] active:scale-95 transition-all"
              >
                Apply Filters
              </button>
           </div>
        </div>
      </Modal>
    </main>
  );
};

const ClinicDetailScreen = ({ clinic, onBack, onBook }) => {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleProceed = () => {
    if (!date || !time) {
      setErrorMsg("Please select a date and time.");
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
            {SERVICES.map(svc => (
              <button
                key={svc} type="button" onClick={() => setSelectedService(svc)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  selectedService === svc ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                {svc}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-zinc-900 mb-3 tracking-tight">Available Specialists</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {DOCTORS.map(doc => {
              const isSelected = selectedDoctor.id === doc.id;
              return (
                <div 
                  key={doc.id} onClick={() => setSelectedDoctor(doc)}
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
                  <h4 className="font-bold text-zinc-900 text-sm leading-tight">Dr. {doc.name}</h4>
                  <p className="text-[10px] font-medium text-zinc-500 mt-1">{doc.specialty}</p>
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
                type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-2 py-3 rounded-xl bg-transparent outline-none focus:ring-0 text-sm font-semibold text-zinc-800" 
              />
            </div>
            <div className="w-px bg-zinc-100 my-2"></div>
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600" size={16} />
              <input 
                type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full pl-9 pr-2 py-3 rounded-xl bg-transparent outline-none focus:ring-0 text-sm font-semibold text-zinc-800" 
              />
            </div>
          </div>
          {errorMsg && <p className="text-red-500 text-xs font-semibold mt-3 animate-fade-in flex items-center gap-1"><AlertCircle size={14}/> {errorMsg}</p>}
        </section>

        <section className="mb-4">
          <h3 className="font-bold text-zinc-900 mb-2 tracking-tight">Reason for Visit (Optional)</h3>
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Briefly describe your symptoms or reason for visit..."
            className="w-full h-24 p-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm resize-none shadow-sm"
          />
        </section>
      </main>

      <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent pt-12">
        <button 
          onClick={handleProceed} type="button"
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
                <span className="text-teal-600">{date}</span> <br/> {time}
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

const AppointmentScreen = ({ appointments }) => {
  const [selectedApt, setSelectedApt] = useState(null);

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Approved': return { style: 'text-teal-700 bg-teal-50', icon: CheckCircle2 };
      case 'Pending': return { style: 'text-amber-700 bg-amber-50', icon: Clock };
      case 'Ready': return { style: 'text-blue-700 bg-blue-50', icon: CalendarCheck };
      case 'Call Hospital': return { style: 'text-red-700 bg-red-50', icon: Phone };
      case 'Cancelled': return { style: 'text-zinc-500 bg-zinc-100', icon: X };
      default: return { style: 'text-teal-700 bg-teal-50', icon: CheckCircle2 };
    }
  };

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
            const statusCfg = getStatusDisplay(apt.status || 'Approved');
            const StatusIcon = statusCfg.icon;
            
            return (
              <div key={apt.id || apt.date+apt.time} className="p-5 rounded-[24px] bg-white shadow-sm border border-zinc-100 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg leading-tight mb-1">{apt.clinic.name}</h3>
                    <p className="text-zinc-500 text-xs font-medium">{apt.service} • {apt.date} at {apt.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-50 relative z-10">
                  <div className="text-sm font-medium text-zinc-700">
                    Dr. {apt.doctor.name}
                  </div>
                  <button 
                    onClick={() => setSelectedApt(apt)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${statusCfg.style} border border-transparent hover:border-current/20`}
                  >
                    <StatusIcon size={12} strokeWidth={2.5} /> {apt.status || 'Approved'} <Phone size={10} className="ml-0.5 opacity-60"/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!selectedApt} onClose={() => setSelectedApt(null)} title="Status Details">
        {selectedApt && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl flex items-start gap-3 ${getStatusDisplay(selectedApt.status).style}`}>
               <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-sm">Status: {selectedApt.status}</h4>
                 <p className="text-xs mt-1 opacity-90">
                   {selectedApt.status === 'Approved' && 'Your appointment is confirmed. Please arrive 15 minutes early.'}
                   {selectedApt.status === 'Pending' && 'Waiting for clinic confirmation. We will notify you shortly.'}
                   {selectedApt.status === 'Call Hospital' && 'Attention needed. Please call the facility to confirm details.'}
                   {selectedApt.status === 'Ready' && 'Your test results or documents are ready for pickup/review.'}
                   {selectedApt.status === 'Cancelled' && (selectedApt.cancelReason ? `Cancelled: ${selectedApt.cancelReason}` : 'This appointment was cancelled.')}
                 </p>
               </div>
            </div>
            <div className="bg-zinc-50 p-4 rounded-2xl text-sm space-y-2 border border-zinc-100">
               <div className="flex justify-between"><span className="text-zinc-500">Clinic</span><span className="font-bold text-zinc-900">{selectedApt.clinic.name}</span></div>
               <div className="flex justify-between"><span className="text-zinc-500">Time</span><span className="font-bold text-zinc-900">{selectedApt.date} • {selectedApt.time}</span></div>
               {selectedApt.room && (
                 <div className="flex justify-between pt-2 border-t border-zinc-200 mt-2"><span className="text-zinc-500 flex items-center gap-1"><DoorOpen size={14}/> Room</span><span className="font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">{selectedApt.room}</span></div>
               )}
               {selectedApt.clinicNote && (
                 <div className="pt-2 border-t border-zinc-200 mt-2">
                    <span className="text-zinc-500 flex items-center gap-1 mb-1"><MessageSquare size={14}/> Instructions</span>
                    <p className="text-zinc-800 font-medium bg-white p-2 rounded-lg border border-zinc-100">{selectedApt.clinicNote}</p>
                 </div>
               )}
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 text-white rounded-xl font-bold active:scale-95 transition-transform shadow-sm">
               <Phone size={16} /> Contact Facility
            </button>
          </div>
        )}
      </Modal>
    </main>
  );
};

const RecordScreen = () => {
  const [previewSoap, setPreviewSoap] = useState(null);

  return (
    <main className="px-6 animate-fade-in pb-32">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Medical History</h2>
      </div>

      <div className="space-y-3">
        {INITIAL_RECORDS.map((record) => (
          <div key={record.id} className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
             <div>
               <h3 className="font-bold text-zinc-900 text-sm mb-0.5">{record.clinic}</h3>
               <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5">
                 <span className="text-teal-600 font-bold">{record.date}</span> • {record.status}
               </p>
             </div>
             
             <div className="flex gap-2">
               <button 
                 onClick={() => setPreviewSoap(record)}
                 className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-colors active:scale-90"
               >
                 <Eye size={16} />
               </button>
               <button className="w-9 h-9 rounded-full bg-zinc-50 text-zinc-600 flex items-center justify-center hover:bg-zinc-100 transition-colors active:scale-90 border border-zinc-100">
                 <Share2 size={16} />
               </button>
             </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!previewSoap} onClose={() => setPreviewSoap(null)} title="Clinical Note (SOAP)">
        {previewSoap && previewSoap.soap ? (
          <div className="space-y-5 text-sm text-zinc-800">
            <div className="border-l-2 border-teal-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-teal-50 text-teal-600 flex items-center justify-center text-xs">S</div>
                Subjective
              </h4>
              <p className="text-zinc-600 leading-relaxed">{previewSoap.soap.subjective}</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-xs">O</div>
                Objective
              </h4>
              <p className="text-zinc-600 leading-relaxed">{previewSoap.soap.objective}</p>
            </div>
            <div className="border-l-2 border-amber-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center text-xs">A</div>
                Assessment
              </h4>
              <p className="text-zinc-600 leading-relaxed">{previewSoap.soap.assessment}</p>
            </div>
            <div className="border-l-2 border-purple-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center text-xs">P</div>
                Plan
              </h4>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line">{previewSoap.soap.plan}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400">
               <span>Signed by Provider</span>
               <span>{previewSoap.date}</span>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-4">No detailed clinical notes available for this record.</p>
        )}
      </Modal>
    </main>
  );
};

const ProfileScreen = ({ onSwitchApp }) => (
  <main className="px-6 animate-fade-in pb-32">
    <div className="bg-white rounded-3xl p-6 text-center border border-zinc-100 shadow-sm mb-6 flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full ${USER.avatar} flex items-center justify-center font-bold text-2xl mb-4 border-4 border-white shadow-md`}>
          {USER.initials}
        </div>
        <h2 className="font-bold text-xl tracking-tight text-zinc-900">{USER.name}</h2>
        <p className="text-teal-600 text-xs font-bold mt-1 bg-teal-50 px-3 py-1 rounded-full">Patient ID: 884-291</p>
    </div>

    <h3 className="font-bold text-sm text-zinc-900 mb-3 px-2 uppercase tracking-wider text-zinc-400">Personal Info</h3>
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden mb-6">
      {[
        { label: 'Age', value: `28 Years Old` },
        { label: 'Telephone', value: '+855 12 345 678' },
        { label: 'Telegram', value: '@demo_user' },
      ].map((item, i, arr) => (
        <div key={item.label} className={`flex items-center justify-between p-4 ${i !== arr.length -1 ? 'border-b border-zinc-50' : ''}`}>
           <span className="text-sm font-semibold text-zinc-500">{item.label}</span>
           <span className="font-bold text-zinc-900 text-sm">{item.value}</span>
        </div>
      ))}
    </div>

    <button onClick={onSwitchApp} className="w-full mb-4 flex items-center justify-center gap-2 p-4 rounded-2xl text-teal-700 bg-teal-50 font-bold hover:bg-teal-100 transition-colors active:scale-95 border border-teal-100/50">
      <ArrowLeftRight size={18} /> Switch to Clinic Portal
    </button>
  </main>
);

const ClinicDashboardScreen = ({ appointments, updateAppointment, onSwitchApp }) => {
  const [activeView, setActiveView] = useState('REQUESTS'); 
  
  // State for advanced approval process
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveForm, setApproveForm] = useState({ room: 'Consultation Room 1', note: '' });
  
  // State for advanced rejection process
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectForm, setRejectForm] = useState({ reason: 'Fully Booked', customNote: '' });

  // Filter for clinic view
  const myClinicAppointments = appointments.filter(a => a.clinic.name === CLINICS[0].name);
  
  // Segmented Data
  const pendingRequests = myClinicAppointments.filter(a => a.status === 'Pending');
  const fullSchedule = [...myClinicAppointments].sort((a,b) => new Date(a.date) - new Date(b.date));

  const handleConfirmApprove = () => {
    updateAppointment(approveTarget.id, { 
      status: 'Approved', 
      room: approveForm.room,
      clinicNote: approveForm.note 
    });
    setApproveTarget(null);
    setApproveForm({ room: 'Consultation Room 1', note: '' }); 
  };

  const handleConfirmReject = () => {
    const finalReason = rejectForm.reason === 'Other' ? rejectForm.customNote : `${rejectForm.reason}. ${rejectForm.customNote}`;
    updateAppointment(rejectTarget.id, { 
      status: 'Cancelled', 
      cancelReason: finalReason 
    });
    setRejectTarget(null);
    setRejectForm({ reason: 'Fully Booked', customNote: '' }); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sleek Dark Header */}
      <header className="bg-slate-900 pt-10 pb-24 px-6 rounded-b-[40px] relative shadow-lg overflow-hidden">
        {/* Decorative Background Elements */}
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

      {/* Floating Quick Stats */}
      <div className="px-6 -mt-12 relative z-10 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-[24px] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-50 rounded-full z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex justify-between items-start mb-1">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Bell size={16}/></div>
              <span className="text-2xl font-black text-slate-800">{pendingRequests.length}</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider relative z-10 mt-1">Pending Req.</p>
          </div>
          <div className="flex-1 bg-white rounded-[24px] p-4 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-teal-50 rounded-full z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex justify-between items-start mb-1">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center"><Users size={16}/></div>
              <span className="text-2xl font-black text-slate-800">{fullSchedule.length}</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider relative z-10 mt-1">Total Appts</p>
          </div>
        </div>
      </div>

      {/* Segmented Control */}
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
              pendingRequests.map(apt => (
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
                        <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5"><Stethoscope size={14} className="text-teal-600"/> {apt.service}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Specialist</p>
                        <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5"><User size={14} className="text-teal-600"/> Dr. {apt.doctor.name}</p>
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

        {/* Timeline Schedule View */}
        {activeView === 'SCHEDULE' && (
          <div className="px-6 mt-4">
            {fullSchedule.length === 0 ? (
               <p className="text-slate-500 text-center mt-10">Schedule is empty.</p>
            ) : (
              <div className="space-y-0">
                {fullSchedule.map((apt, idx) => (
                  <div key={apt.id} className="relative pl-6 pb-6 border-l-2 border-slate-200 last:border-l-transparent">
                     {/* Timeline Node */}
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

      {/* Advanced APPROVE Modal Form */}
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
                    onChange={e => setApproveForm({...approveForm, room: e.target.value})}
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
                  onChange={e => setApproveForm({...approveForm, note: e.target.value})}
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

      {/* Advanced REJECT Modal Form */}
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
                    onChange={e => setRejectForm({...rejectForm, reason: e.target.value})}
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
                  onChange={e => setRejectForm({...rejectForm, customNote: e.target.value})}
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

export default function App() {
  const [appMode, setAppMode] = useState('ONBOARDING'); 
  
  // Shared global state for appointments to enable real-time connectivity testing
  const [globalAppointments, setGlobalAppointments] = useState(DEFAULT_APPOINTMENTS);

  // Patient App States
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('MAIN'); 
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Global Handlers
  const updateAppointment = (id, updates) => {
    setGlobalAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt));
  };

  // Patient Flow Handlers
  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setCurrentScreen('DETAIL');
  };

  const handleBookingConfirm = (details) => {
    const newApt = { ...details, id: Date.now(), status: 'Pending' }; 
    setGlobalAppointments(prev => [newApt, ...prev]);
    setCurrentScreen('MAIN');
    setActiveTab('Appointment');
  };

  const renderMainTab = () => {
    switch (activeTab) {
      case 'Home': return <HomeScreen onSelectClinic={handleClinicSelect} />;
      case 'Appointment': return <AppointmentScreen appointments={globalAppointments} />;
      case 'Record': return <RecordScreen />;
      case 'Profile': return <ProfileScreen onSwitchApp={() => setAppMode('CLINIC')} />;
      default: return <HomeScreen onSelectClinic={handleClinicSelect} />;
    }
  };

  if (appMode === 'ONBOARDING') {
    return (
      <div className="min-h-screen bg-zinc-200 flex flex-col items-center selection:bg-teal-200">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
          <RoleSelectionScreen onSelectRole={(role) => setAppMode(role)} />
        </div>
      </div>
    );
  }

  if (appMode === 'CLINIC') {
    return (
      <div className="min-h-screen bg-zinc-200 flex flex-col items-center selection:bg-teal-200">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
          <ClinicDashboardScreen 
             appointments={globalAppointments} 
             updateAppointment={updateAppointment}
             onSwitchApp={() => setAppMode('ONBOARDING')} 
          />
        </div>
      </div>
    );
  }

  // PATIENT APP RENDER
  return (
    <div className="min-h-screen bg-zinc-200 flex flex-col items-center font-sans selection:bg-teal-200">
      <div className="w-full max-w-md bg-zinc-50 min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        
        {currentScreen === 'MAIN' && (
          <>
            <Header user={USER} />
            <div className="overflow-y-auto flex-grow flex flex-col h-full relative">
               {renderMainTab()}
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
              <nav className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full py-3.5 px-6 flex justify-between items-center border border-zinc-100">
                {[
                  { name: 'Home', icon: Home },
                  { name: 'Appointment', icon: Calendar },
                  { name: 'Record', icon: FileText },
                  { name: 'Profile', icon: User },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.name;
                  return (
                    <button 
                      key={tab.name} 
                      type="button"
                      onClick={() => setActiveTab(tab.name)}
                      className={`relative flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-xl ${isActive ? 'text-teal-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'transform -translate-y-0.5' : ''} />
                      {isActive && <div className="absolute bottom-0 w-1 h-1 bg-teal-600 rounded-full" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        {currentScreen === 'DETAIL' && selectedClinic && (
          <ClinicDetailScreen 
            clinic={selectedClinic} 
            onBack={() => { setCurrentScreen('MAIN'); setSelectedClinic(null); }}
            onBook={handleBookingConfirm}
          />
        )}

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
          .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-slide-in-right { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </div>
    </div>
  );
}