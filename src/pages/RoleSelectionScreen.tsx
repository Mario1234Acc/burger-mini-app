import { useState } from 'react';
import { Check, ChevronRight, Building2, User } from 'lucide-react';
import { useTypingText } from '../hooks/useTypingText';

interface RoleSelectionScreenProps {
  onSelectRole: (role: string) => void;
}

export const RoleSelectionScreen = ({ onSelectRole }: RoleSelectionScreenProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { text, showCursor } = useTypingText('Welcome to QlinicOS');
  const welcomePart = text.length > 11 ? text.slice(0, 11) : text;
  const brandPart = text.length > 11 ? text.slice(11) : '';

  const roles = [
    { id: 'PATIENT', title: 'Patient Portal', desc: 'Book and manage appointments', icon: User },
    { id: 'CLINIC', title: 'Facility Admin', desc: 'Manage your clinic schedule', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans px-6 py-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] bg-emerald-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

      <div className="mb-10 mt-12 min-h-[110px] relative z-10">
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
          {welcomePart}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">{brandPart}</span>
          <span className={`inline-block w-1.5 h-8 ml-1.5 bg-teal-500 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 rounded-full`}></span>
        </h1>
        <p className={`text-sm text-zinc-500 mt-4 transition-all duration-1000 transform ${text.length >= 'Welcome to QlinicOS'.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
                  ? 'bg-white text-teal-500 shadow-2xl shadow-teal-900/20 transform scale-[1.02] border border-teal-500'
                  : 'bg-white text-zinc-900 border border-zinc-100 shadow-sm hover:shadow-md hover:border-teal-100'
              }`}
              style={{
                opacity: text.length > 5 ? 1 : 0,
                transform: text.length > 5 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${index * 150}ms`,
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
                    <h3 className={`font-bold text-lg mb-0.5 ${isSelected ? 'text-teal-500' : 'text-zinc-900'}`}>{role.title}</h3>
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

      <div className={`mt-auto pt-8 pb-4 relative z-10 transition-all duration-1000 transform ${text.length >= 'Welcome to QlinicOS'.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button
          disabled={!selected}
          onClick={() => selected && onSelectRole(selected)}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-500 flex items-center justify-center gap-2 ${
            selected
              ? 'bg-teal-600 text-white shadow-[0_8px_30px_rgba(13,148,136,0.3)] active:scale-95 transform translate-y-0'
              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed transform translate-y-2'
          }`}
        >
          Continue <ChevronRight size={20} className={selected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} style={{ transition: 'all 0.3s' }} />
        </button>
      </div>
    </div>
  );
};
