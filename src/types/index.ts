export interface UserInfo {
  initials: string;
  name: string;
  avatar: string;
}

export interface Clinic {
  id: number;
  name: string;
  type: string;
  specialties: string[];
  address: string;
  distance: string;
  color: string;
  image: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  exp: string;
}

export interface MedicalRecord {
  id: number;
  patient: string;
  date: string;
  clinic: string;
  status: string;
  type: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

export interface Appointment {
  id: number;
  clinic: Clinic;
  service: string;
  doctor: Doctor;
  date: string;
  time: string;
  status: string;
  patientName?: string;
  note?: string;
  room?: string;
  clinicNote?: string;
  cancelReason?: string;
}
