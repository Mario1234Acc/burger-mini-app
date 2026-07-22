import { ArrowLeftRight } from 'lucide-react';
import { USER } from '../../constants/appData';

interface ProfileScreenProps {
  onSwitchApp: () => void;
}

export const ProfileScreen = ({ onSwitchApp }: ProfileScreenProps) => (
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
        { label: 'Age', value: '28 Years Old' },
        { label: 'Telephone', value: '+855 12 345 678' },
        { label: 'Telegram', value: '@demo_user' },
      ].map((item, index, arr) => (
        <div key={item.label} className={`flex items-center justify-between p-4 ${index !== arr.length - 1 ? 'border-b border-zinc-50' : ''}`}>
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
