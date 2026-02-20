import { cn } from '../../lib/utils';

export default function PageHeader({ title, description, className, children }) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-text-primary tracking-tight font-serif">
            {title}
          </h1>
          {description && (
            <p className="text-[15px] text-text-secondary mt-1.5">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
