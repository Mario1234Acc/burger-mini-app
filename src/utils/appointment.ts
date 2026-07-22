import { AlertCircle, CalendarCheck, CheckCircle2, Clock, Phone, X } from 'lucide-react';

export const getAppointmentStatusDisplay = (status: string) => {
  switch (status) {
    case 'Approved':
      return { style: 'text-teal-700 bg-teal-50', icon: CheckCircle2 };
    case 'Pending':
      return { style: 'text-amber-700 bg-amber-50', icon: Clock };
    case 'Ready':
      return { style: 'text-blue-700 bg-blue-50', icon: CalendarCheck };
    case 'Call Hospital':
      return { style: 'text-red-700 bg-red-50', icon: Phone };
    case 'Cancelled':
      return { style: 'text-zinc-500 bg-zinc-100', icon: X };
    default:
      return { style: 'text-teal-700 bg-teal-50', icon: CheckCircle2 };
  }
};

export const getAppointmentStatusMessage = (status: string, cancelReason?: string) => {
  switch (status) {
    case 'Approved':
      return 'Your appointment is confirmed. Please arrive 15 minutes early.';
    case 'Pending':
      return 'Waiting for clinic confirmation. We will notify you shortly.';
    case 'Call Hospital':
      return 'Attention needed. Please call the facility to confirm details.';
    case 'Ready':
      return 'Your test results or documents are ready for pickup/review.';
    case 'Cancelled':
      return cancelReason ? `Cancelled: ${cancelReason}` : 'This appointment was cancelled.';
    default:
      return 'Your appointment status is being updated.';
  }
};

export const getAppointmentStatusIcon = (status: string) => {
  switch (status) {
    case 'Approved':
      return CheckCircle2;
    case 'Pending':
      return Clock;
    case 'Ready':
      return CalendarCheck;
    case 'Call Hospital':
      return Phone;
    case 'Cancelled':
      return X;
    default:
      return AlertCircle;
  }
};
