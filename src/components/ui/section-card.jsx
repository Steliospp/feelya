import Card from './card';
import { cn } from '../../lib/utils';

export default function SectionCard({ title, action, className, noPadding, children }) {
  return (
    <Card className={cn(noPadding ? '!p-0' : '!p-5', className)}>
      {(title || action) && (
        <div className={cn(
          'flex items-center justify-between',
          noPadding ? 'px-5 pt-5 pb-3' : 'mb-4'
        )}>
          {title && <h2 className="text-[15px] font-semibold text-text-primary">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}
