import { cn } from '../../lib/utils';

export default function PageHeader({ title, description, className, children }) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-text-primary tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] text-text-secondary mt-1">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
