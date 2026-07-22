import { useState, useEffect } from 'react';
import { Calendar, FileText, Home, User } from 'lucide-react';
import { Header } from './components/common/Header';
import { DEFAULT_APPOINTMENTS, USER } from './constants/appData';
import { ClinicDashboardScreen } from './pages/clinic/ClinicDashboardScreen';
import { RoleSelectionScreen } from './pages/RoleSelectionScreen';
import { AppointmentScreen } from './pages/patient/AppointmentScreen';
import { ClinicDetailScreen } from './pages/patient/ClinicDetailScreen';
import { HomeScreen } from './pages/patient/HomeScreen';
import { ProfileScreen } from './pages/patient/ProfileScreen';
import { RecordScreen } from './pages/patient/RecordScreen';
import type { Appointment, Clinic } from './types';

const WebApp = (window as any).Telegram?.WebApp;

export default function App() {
  const [appMode, setAppMode] = useState('ONBOARDING');
  const [globalAppointments, setGlobalAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState('Home');
  const [currentScreen, setCurrentScreen] = useState('MAIN');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(USER);

  useEffect(() => {
    if (WebApp) {
      // 1. Tell Telegram the app is ready & expand to full view height
      WebApp.ready();
      WebApp.expand();

      // 2. Catch the user profile from Telegram
      const tgUser = WebApp.initDataUnsafe?.user;
      if (tgUser) {
        setCurrentUser({
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name || '',
          username: tgUser.username,
          photo_url: tgUser.photo_url,
          // Keep compatibility with existing UI props if needed
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
        });
      }
    }
  }, []);

  const updateAppointment = (id: number, updates: Partial<Appointment>) => {
    setGlobalAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt)));
  };

  const handleClinicSelect = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setCurrentScreen('DETAIL');
  };

  const handleBookingConfirm = (details: Appointment) => {
    const newApt: Appointment = { ...details, id: Date.now(), status: 'Pending' };
    setGlobalAppointments((prev) => [newApt, ...prev]);
    setCurrentScreen('MAIN');
    setActiveTab('Appointment');
  };

  const renderMainTab = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen onSelectClinic={handleClinicSelect} />;
      case 'Appointment':
        return <AppointmentScreen appointments={globalAppointments} />;
      case 'Record':
        return <RecordScreen />;
      case 'Profile':
        return <ProfileScreen onSwitchApp={() => setAppMode('CLINIC')} user={currentUser} />;
      default:
        return <HomeScreen onSelectClinic={handleClinicSelect} />;
    }
  };

  if (appMode === 'ONBOARDING') {
    return (
      <div className="min-h-screen bg-zinc-200 flex flex-col items-center selection:bg-teal-200">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
          <RoleSelectionScreen onSelectRole={(role) => setAppMode(role)} />
        </div>
      </div>
    );
  }

  if (appMode === 'CLINIC') {
    return (
      <div className="min-h-screen bg-zinc-200 flex flex-col items-center selection:bg-teal-200">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
          <ClinicDashboardScreen
            appointments={globalAppointments}
            updateAppointment={updateAppointment}
            onSwitchApp={() => setAppMode('ONBOARDING')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-white flex flex-col items-center font-sans selection:bg-teal-200">
      <div className="w-full max-w-md bg-zinc-50 min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        {currentScreen === 'MAIN' && (
          <>
            {/* Header now receives the live Telegram user */}
            <Header user={currentUser} />

            <div className="overflow-y-auto flex-grow flex flex-col h-full relative pb-28">
              {renderMainTab()}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
              <nav className="bg-white absolute mx-5 bottom-0 left-0 right-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full py-3.5 px-6 flex justify-between items-center border border-zinc-100">
                {[
                  { name: 'Home', icon: Home },
                  { name: 'Appointment', icon: Calendar },
                  { name: 'Record', icon: FileText },
                  { name: 'Profile', icon: User },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      type="button"
                      onClick={() => setActiveTab(tab.name)}
                      className={`relative flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-xl ${
                        isActive ? 'text-teal-600' : 'text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      <Icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={isActive ? 'transform -translate-y-0.5' : ''}
                      />
                      {isActive && <div className="absolute bottom-0 w-1 h-1 bg-teal-600 rounded-full" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        {currentScreen === 'DETAIL' && selectedClinic && (
          <ClinicDetailScreen
            clinic={selectedClinic}
            onBack={() => {
              setCurrentScreen('MAIN');
              setSelectedClinic(null);
            }}
            onBook={handleBookingConfirm}
          />
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
            .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .animate-slide-in-right { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `,
          }}
        />
      </div>
    </div>
  );
}