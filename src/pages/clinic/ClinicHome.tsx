import type { Clinic } from '../../types';

interface ClinicHomeProps {
  pendingRequestsCount: number;
  fullScheduleCount: number;
  clinicInfo: Clinic;
}

export const ClinicHome = ({ pendingRequestsCount, fullScheduleCount, clinicInfo }: ClinicHomeProps) => {
  return (
    <div className="px-6 space-y-6">
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold mb-2">Admin Overview</p>
            <h2 className="text-xl font-bold text-slate-900">Clinic summary</h2>
          </div>
          <span className="text-xs font-semibold uppercase text-teal-700 bg-teal-100 px-3 py-1 rounded-full">{clinicInfo.type}</span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          {clinicInfo.name} is currently managing {fullScheduleCount} appointment entries and {pendingRequestsCount} pending requests. Use the Appointment tab to review and confirm scheduling decisions, or the Profile tab to keep clinic services and doctors up to date.
        </p>
      </div>
    </div>
  );
};
