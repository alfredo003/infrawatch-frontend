import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type InlineErrorProps = {
  message?: string | null;
  className?: string;
};

export default function InlineError({ message, className }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        'mt-3 bg-red-900/50 border border-red-600 rounded-lg p-3 flex items-start space-x-3',
        className,
      )}
    >
      <AlertTriangle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-red-100 font-mono">{message}</div>
    </div>
  );
}
