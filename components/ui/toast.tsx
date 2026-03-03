'use client';

import { create } from 'zustand';

type Toast = { id: number; message: string };

type ToastState = {
  toasts: Toast[];
  add: (message: string) => void;
  remove: (id: number) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message) => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })), 2500);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
}));

export function useToast() {
  const add = useToastStore((state) => state.add);
  return { toast: ({ description }: { description: string }) => add(description) };
}
