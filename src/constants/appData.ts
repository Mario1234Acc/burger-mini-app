import type { Appointment, Clinic, Doctor, MedicalRecord, UserInfo } from '../types';

export const USER: UserInfo = {
  initials: 'DU',
  name: 'Demo User',
  avatar: 'bg-teal-100 text-teal-700',
};

export const CLINICS: Clinic[] = [
  {
    id: 1,
    name: 'Sunrise Hospital',
    type: 'Premium Hospital',
    specialties: ['General', 'Cardiology', 'Surgery', 'Pediatrics', 'Dental'],
    address: 'Phnom Penh',
    distance: '1.2 km',
    color: 'from-teal-500 to-emerald-400',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 2,
    name: 'Royal Phnom Penh',
    type: 'International Hospital',
    specialties: ['Emergency', 'Maternity', 'Orthopedics'],
    address: 'Toul Kork',
    distance: '3.5 km',
    color: 'from-blue-500 to-indigo-400',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 3,
    name: 'Japan Eye Clinic',
    type: 'Specialist',
    specialties: ['Eye Care', 'Lasik', 'Optometry'],
    address: 'BKK1',
    distance: '0.8 km',
    color: 'from-orange-400 to-red-400',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
  },
];

export const SERVICES = ['General Checkup', 'Cardiology', 'Pediatrics', 'Dental', 'Eye Care', 'Lab Test'];

export const DOCTORS: Doctor[] = [
  { id: 1, name: 'Sun Panha', specialty: 'General Medicine', exp: '8 Yrs' },
  { id: 2, name: 'Chea Vanda', specialty: 'Cardiology', exp: '12 Yrs' },
  { id: 3, name: 'Sok Mean', specialty: 'Pediatrics', exp: '5 Yrs' },
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 1,
    patient: 'Robert Chen',
    date: 'Jul 10, 2026',
    clinic: 'Sunrise Hospital',
    status: 'Completed',
    type: 'teal',
    soap: {
      subjective: 'Patient complains of persistent tension headaches for the past 3 days, localized to the frontal region. Rates pain as 6/10.',
      objective: 'BP: 120/80 mmHg, Temp: 37.2°C, HR: 72 bpm. Neurological exam reveals normal cranial nerve function. No neck stiffness.',
      assessment: 'Primary tension-type headache. No signs of secondary causes.',
      plan: '1. Ibuprofen 400mg PRN for pain.\n2. Advised adequate hydration and stress management.\n3. Follow up in 1 week if symptoms persist.',
    },
  },
  {
    id: 2,
    patient: 'Dara Pheakdey',
    date: 'Jul 02, 2026',
    clinic: 'Japan Eye Clinic',
    status: 'Pending Result',
    type: 'blue',
    soap: {
      subjective: 'Patient reports blurred vision in the right eye over the last month.',
      objective: 'Visual Acuity: OD 20/40, OS 20/20. Slit-lamp exam normal. IOP: OD 15, OS 14.',
      assessment: 'Mild myopia in right eye.',
      plan: '1. Prescribed corrective lenses.\n2. Return for annual checkup.',
    },
  },
];

export const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 101,
    clinic: CLINICS[0],
    service: 'General Checkup',
    doctor: DOCTORS[0],
    date: 'Jul 20, 2026',
    time: '10:00 AM',
    status: 'Approved',
  },
  {
    id: 105,
    clinic: CLINICS[0],
    patientName: 'Sok San',
    service: 'Cardiology',
    doctor: DOCTORS[1],
    date: 'Jul 21, 2026',
    time: '09:00 AM',
    status: 'Pending',
    note: 'Experiencing mild chest palpitations after morning jogs.',
  },
  {
    id: 106,
    clinic: CLINICS[0],
    patientName: 'Nita Ly',
    service: 'Pediatrics',
    doctor: DOCTORS[2],
    date: 'Jul 21, 2026',
    time: '02:00 PM',
    status: 'Pending',
    note: 'Child has had a low-grade fever for 2 days. Need a general assessment.',
  },
  {
    id: 102,
    clinic: CLINICS[2],
    service: 'Eye Care',
    doctor: DOCTORS[2],
    date: 'Jul 22, 2026',
    time: '02:30 PM',
    status: 'Pending',
  },
  {
    id: 103,
    clinic: CLINICS[1],
    service: 'Lab Test',
    doctor: DOCTORS[1],
    date: 'Jul 25, 2026',
    time: '08:00 AM',
    status: 'Ready',
  },
  {
    id: 104,
    clinic: CLINICS[0],
    service: 'Cardiology',
    doctor: DOCTORS[1],
    date: 'Jul 28, 2026',
    time: '04:00 PM',
    status: 'Call Hospital',
  },
];
