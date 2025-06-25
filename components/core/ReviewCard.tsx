import { cn } from '@/lib/utils';
import { ReactElement } from 'react';

export const ReviewCard = ({
  icon,
  name,
  body,
}: {
  icon: ReactElement;
  name: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        'relative w-80 overflow-hidden rounded-xl border p-4 cursor-default',
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <div className="text-primary">{icon}</div>
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</blockquote>
    </figure>
  );
};
