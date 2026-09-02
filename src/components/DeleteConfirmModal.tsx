import React from 'react';
import { AlertTriangle, X, Trash2, Users } from 'lucide-react';
import { Participant } from '../types';

interface DeleteConfirmModalProps {
  participant?: Participant | null;
  participantsList?: Participant[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  participant,
  participantsList,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const isBatch = Boolean(participantsList && participantsList.length > 0);
  const count = isBatch ? participantsList!.length : 1;

  if (!isBatch && !participant) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            {isBatch ? <Users className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isBatch ? `¿Eliminar ${count} participantes seleccionados?` : '¿Eliminar Participante?'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {isBatch ? (
              <>
                Esta acción eliminará permanentemente a <strong className="text-slate-900">{count} participantes</strong> de la base de datos oficial. Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                Esta acción eliminará permanentemente el registro de <strong className="text-slate-900">{participant!.nombre} {participant!.apellido}</strong> (<code>@{participant!.usuario.replace(/^@/, '')}</code>) de la base de datos oficial.
              </>
            )}
          </p>
        </div>

        {isBatch ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 max-h-40 overflow-y-auto divide-y divide-slate-100">
            {participantsList!.map((p) => (
              <div key={p.id} className="py-1.5 flex items-center justify-between">
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{p.nombre} {p.apellido}</span>
                <span className="font-mono text-[11px] text-blue-700">@{p.usuario.replace(/^@/, '')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1">
            <div><strong>Lugar:</strong> {participant!.lugar_representa}</div>
            <div><strong>Categoría:</strong> <span className="capitalize">{participant!.categoria.replace('_', ' ')}</span></div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Eliminando...' : isBatch ? `Eliminar (${count})` : 'Sí, Eliminar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
