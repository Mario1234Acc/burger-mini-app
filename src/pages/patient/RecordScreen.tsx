import { useState } from 'react';
import { Eye, Share2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { INITIAL_RECORDS } from '../../constants/appData';

export const RecordScreen = () => {
  const [previewSoap, setPreviewSoap] = useState<any | null>(null);

  return (
    <main className="px-6 animate-fade-in pb-32">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Medical History</h2>
      </div>

      <div className="space-y-3">
        {INITIAL_RECORDS.map((record) => (
          <div key={record.id} className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm mb-0.5">{record.clinic}</h3>
              <p className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5">
                <span className="text-teal-600 font-bold">{record.date}</span> • {record.status}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPreviewSoap(record)}
                className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-colors active:scale-90"
              >
                <Eye size={16} />
              </button>
              <button className="w-9 h-9 rounded-full bg-zinc-50 text-zinc-600 flex items-center justify-center hover:bg-zinc-100 transition-colors active:scale-90 border border-zinc-100">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!previewSoap} onClose={() => setPreviewSoap(null)} title="Clinical Note (SOAP)">
        {previewSoap && previewSoap.soap ? (
          <div className="space-y-5 text-sm text-zinc-800">
            <div className="border-l-2 border-teal-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-teal-50 text-teal-600 flex items-center justify-center text-xs">S</div>
                Subjective
              </h4>
              <p className="text-zinc-600 leading-relaxed">{previewSoap.soap.subjective}</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-xs">O</div>
                Objective
              </h4>
              <p className="text-zinc-600 leading-relaxed">{previewSoap.soap.objective}</p>
            </div>
            <div className="border-l-2 border-amber-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center text-xs">A</div>
                Assessment
              </h4>
              <p className="text-zinc-600 leading-relaxed">{previewSoap.soap.assessment}</p>
            </div>
            <div className="border-l-2 border-purple-500 pl-3">
              <h4 className="font-bold text-zinc-900 flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center text-xs">P</div>
                Plan
              </h4>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line">{previewSoap.soap.plan}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-400">
              <span>Signed by Provider</span>
              <span>{previewSoap.date}</span>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-4">No detailed clinical notes available for this record.</p>
        )}
      </Modal>
    </main>
  );
};
