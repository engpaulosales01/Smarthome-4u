'use client';

import { useToastStore } from './toast';

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-md border bg-white px-4 py-2 text-sm shadow">{toast.message}</div>
      ))}
    </div>
  );
}
