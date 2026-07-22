import { useState } from 'react';
import { Building2, ChevronDown, Filter, MapPin, Search, Stethoscope } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CLINICS } from '../../constants/appData';
import { SpecialtyBadges } from '../../components/common/SpecialtyBadges';
import type { Clinic } from '../../types';

interface HomeScreenProps {
  onSelectClinic: (clinic: Clinic) => void;
}

export const HomeScreen = ({ onSelectClinic }: HomeScreenProps) => {
  const [isMapView, setIsMapView] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterProvince, setFilterProvince] = useState('All');
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  const PROVINCES = ['All', 'Phnom Penh', 'Siem Reap', 'Battambang', 'Kampot', 'Sihanoukville', 'Kandal'];
  const SPECIALTIES = ['All', 'General', 'Cardiology', 'Pediatrics', 'Dental', 'Eye Care', 'Maternity', 'Orthopedics'];

  const filteredClinics = CLINICS.filter((clinic) => {
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

      {/* shadcn Dialog Component */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] p-6 bg-white border-zinc-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900">Filter Clinics</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Province in Cambodia
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-medium appearance-none cursor-pointer"
                >
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province === 'All' ? 'All Provinces' : province}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Specialty
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SPECIALTIES.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty === 'All' ? 'All Specialties' : specialty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-100 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setFilterProvince('All');
                setFilterSpecialty('All');
                setIsFilterOpen(false);
              }}
              className="flex-1 h-14 rounded-xl border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-100"
            >
              Reset
            </Button>
            <Button
              onClick={() => setIsFilterOpen(false)}
              className="flex-[2] h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-[0_8px_20px_rgba(13,148,136,0.25)]"
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};