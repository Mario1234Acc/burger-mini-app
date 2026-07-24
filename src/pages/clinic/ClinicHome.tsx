import type { Clinic } from '../../types';

interface ClinicHomeProps {
  clinicInfo: Clinic;
}

export const ClinicHome = ({ clinicInfo }: ClinicHomeProps) => {
  return (
    <div className="px-6 space-y-6">
      <div className="bg-white rounded-[32px] p-0 border border-slate-100 shadow-sm overflow-hidden">
        {clinicInfo.coverImage && (
          <div className="w-full h-40 bg-slate-200">
            <img src={clinicInfo.coverImage} alt={`${clinicInfo.name} cover`} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-5 relative">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {clinicInfo.image && (
                <div className="w-16 h-16 border border-teal-500 shadow-xl rounded-lg overflow-hidden absolute -top-8 right-5">
                  <img src={clinicInfo.image} alt={`${clinicInfo.name} logo`} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-900">{clinicInfo.name}</h2>
                <p className="text-sm text-slate-500">{clinicInfo.type}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Use the Appointment tab to review and confirm scheduling decisions, or the Profile tab to keep clinic services and doctors up to date.
          </p>
        </div>
      </div>
    </div>
  );
};
