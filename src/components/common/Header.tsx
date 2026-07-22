import { ChevronLeft } from 'lucide-react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface HeaderProps {
  title?: string;
  user?: TelegramUser | null;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning,';
  if (hour < 18) return 'Good Afternoon,';
  return 'Good Evening,';
};

const getInitials = (user: TelegramUser) => {
  const first = user.first_name?.[0] || '';
  const last = user.last_name?.[0] || '';
  return (first + last).toUpperCase() || '👤';
};

export const Header = ({ title, user, onBack, rightAction }: HeaderProps) => {
  const greeting = getGreeting();
  const initials = user ? getInitials(user) : '';

  return (
    <header className="px-6 py-4 flex items-center justify-between bg-zinc-50/80 backdrop-blur-md sticky top-0 z-20 border-zinc-100">
      {onBack ? (
        <button
          onClick={onBack}
          type="button"
          className="p-2 -ml-2 text-zinc-800 hover:bg-white rounded-full transition-all active:scale-90 shadow-sm border border-zinc-100 bg-white"
        >
          <ChevronLeft size={20} />
        </button>
      ) : user ? (
        <div className="flex items-center gap-3">
          {/* Avatar: Shows Profile Photo if available, or generated Initials */}
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.first_name}
              className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white">
              {initials}
            </div>
          )}

          <div>
            <p className="text-xs text-zinc-500 font-medium">{greeting}</p>
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight leading-tight">
              {user.first_name} {user.last_name || ''}
            </h1>
            {user.username && (
              <p className="text-[11px] text-zinc-400 font-medium leading-none mt-0.5">
                @{user.username}
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* Center Title */}
      {title && (
        <h1 className="text-lg font-bold text-zinc-900 tracking-tight absolute left-1/2 transform -translate-x-1/2">
          {title}
        </h1>
      )}

      {/* Right Action Button Slot */}
      {rightAction && (
        <div className="flex justify-end min-w-[48px]">{rightAction}</div>
      )}
    </header>
  );
};