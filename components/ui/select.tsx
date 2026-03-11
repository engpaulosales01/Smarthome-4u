import { cn } from '@/lib/utils';

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('h-10 w-full rounded-md border border-input bg-white px-3 text-sm')} {...props} />;
}
