import { ArrowLeftRight, UserCircle2, Phone, MessageCircle } from 'lucide-react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface ProfileScreenProps {
  onSwitchApp: () => void;
  user: TelegramUser | null;
}

// Helper to safely get the user's display name
const getDisplayName = (user: TelegramUser | null) => {
  if (!user) return 'Guest User';
  return `${user.first_name} ${user.last_name || ''}`.trim();
};

// Helper to get initials if the photo is missing
const getInitials = (user: TelegramUser | null) => {
  if (!user) return 'U';
  const first = user.first_name?.[0] || '';
  const last = user.last_name?.[0] || '';
  return (first + last).toUpperCase() || 'U';
};

export const ProfileScreen = ({ onSwitchApp, user }: ProfileScreenProps) => {
  const displayName = getDisplayName(user);
  const initials = getInitials(user);
  const displayUsername = user?.username ? `@${user.username}` : 'Not linked';

  const patientId = user?.id ? user.id.toString().slice(-6) : '000000'; 

  return (
    <main className="px-6 animate-fade-in pb-32">
      <div className="bg-white rounded-3xl p-6 text-center border border-zinc-100 shadow-sm mb-6 flex flex-col items-center">
        
        {/* Avatar Rendering */}
        {user?.photo_url ? (
           <img 
            src={user.photo_url} 
            alt={displayName} 
            className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-2xl mb-4 border-4 border-white shadow-md">
            {initials}
          </div>
        )}

        <h2 className="font-bold text-xl tracking-tight text-zinc-900">{displayName}</h2>
        <p className="text-teal-600 text-xs font-bold mt-1 bg-teal-50 px-3 py-1 rounded-full">
          Patient ID: {patientId}
        </p>
      </div>

      <h3 className="font-bold text-sm text-zinc-900 mb-3 px-2 uppercase tracking-wider text-zinc-400">
        Personal Info
      </h3>
      
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden mb-6">
        {[
          { label: 'Name', value: displayName, icon: UserCircle2 },
          { label: 'Telegram', value: displayUsername, icon: MessageCircle },
        ].map((item, index, arr) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`flex items-center p-4 ${index !== arr.length - 1 ? 'border-b border-zinc-50' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 mr-3">
                <Icon size={16} />
              </div>
              <div className="flex-grow">
                <p className="text-xs font-semibold text-zinc-500">{item.label}</p>
                <p className="font-bold text-zinc-900 text-sm">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onSwitchApp} className="w-full mb-4 flex items-center justify-center gap-2 p-4 rounded-2xl text-teal-700 bg-teal-50 font-bold hover:bg-teal-100 transition-colors active:scale-95 border border-teal-100/50">
        <ArrowLeftRight size={18} /> Switch to Clinic Portal
      </button>
    </main>
  );
};