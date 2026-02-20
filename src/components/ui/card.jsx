import { cn } from '../../lib/utils';

const elevations = {
  1: 'shadow-card border border-border-light',
  2: 'shadow-elevated border border-border-light',
  3: 'shadow-hero',
};

export default function Card({ className, elevation = 1, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface rounded-[16px] p-4',
        elevations[elevation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-3', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-[16px] font-semibold text-text-primary', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-[13px] text-text-secondary mt-0.5', className)}>{children}</p>;
}
