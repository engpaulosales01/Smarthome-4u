'use client';

import { cn } from '@/lib/utils';

type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  tabs: { value: string; label: string }[];
};

export function Tabs({ value, onValueChange, tabs }: TabsProps) {
  return (
    <div className="inline-flex rounded-md border border-border p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn('rounded px-3 py-1 text-sm', value === tab.value ? 'bg-primary text-white' : 'text-muted-foreground')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
