import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomSheet({ open, onClose, title, children, className }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />
      <div className={cn(
        'absolute bottom-0 left-0 right-0 bg-surface rounded-t-[20px] shadow-sheet animate-slide-up max-h-[85vh] overflow-auto',
        className
      )}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="w-8 h-1 rounded-full bg-border mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          {title && <h2 className="text-[17px] font-semibold text-text-primary">{title}</h2>}
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-dim flex items-center justify-center hover:bg-border transition-colors ml-auto cursor-pointer">
            <X className="w-[18px] h-[18px] text-text-secondary" />
          </button>
        </div>
        <div className="px-4 pb-8 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
