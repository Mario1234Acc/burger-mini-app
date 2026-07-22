import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 sticky top-0 z-10">
          <h3 className="font-bold text-zinc-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      ` }} />
    </div>
  );
};
