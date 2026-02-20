import Card from './card';
import { cn } from '../../lib/utils';

export default function StatCard({ icon, label, value, change, iconClassName }) {
  return (
    <Card className="!p-6 text-center">
      {icon && (
        <div className={cn('w-10 h-10 rounded-[12px] flex items-center justify-center mx-auto mb-3', iconClassName)}>
          {icon}
        </div>
      )}
      <div className="text-[28px] font-semibold text-primary tracking-tight">{value}</div>
      <div className="text-[13px] text-text-secondary mt-1">{label}</div>
      {change && (
        <span className="inline-block text-[12px] font-medium text-success mt-1.5">{change}</span>
      )}
    </Card>
  );
}
