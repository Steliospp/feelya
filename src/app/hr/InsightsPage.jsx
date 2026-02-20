import Card from '../../components/ui/card';
import PageHeader from '../../components/ui/page-header';
import StatCard from '../../components/ui/stat-card';
import SectionCard from '../../components/ui/section-card';
import { CalendarDays, Users, Star } from 'lucide-react';

const monthlyData = [
  { month: 'Sep', sessions: 180, workshops: 45, satisfaction: 4.5 },
  { month: 'Oct', sessions: 210, workshops: 52, satisfaction: 4.6 },
  { month: 'Nov', sessions: 245, workshops: 61, satisfaction: 4.7 },
  { month: 'Dec', sessions: 198, workshops: 38, satisfaction: 4.6 },
  { month: 'Jan', sessions: 290, workshops: 72, satisfaction: 4.8 },
  { month: 'Feb', sessions: 342, workshops: 87, satisfaction: 4.9 },
];

const topTopics = [
  { name: 'Anxiety', percentage: 28, count: 96 },
  { name: 'Stress', percentage: 22, count: 75 },
  { name: 'Burnout', percentage: 18, count: 62 },
  { name: 'Career', percentage: 14, count: 48 },
  { name: 'Relationships', percentage: 10, count: 34 },
  { name: 'Confidence', percentage: 8, count: 27 },
];

export default function InsightsPage() {
  const latest = monthlyData[monthlyData.length - 1];

  return (
    <div>
      <PageHeader title="Insights" description="Engagement trends and programme analytics" />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<CalendarDays className="w-5 h-5" />}
          iconClassName="text-primary bg-primary-50"
          label="Sessions this month"
          value={String(latest.sessions)}
          change="+18%"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          iconClassName="text-violet bg-violet/10"
          label="Workshop attendance"
          value={String(latest.workshops)}
          change="+21%"
        />
        <StatCard
          icon={<Star className="w-5 h-5" />}
          iconClassName="text-warning bg-warning-bg"
          label="Satisfaction score"
          value={`${latest.satisfaction}/5`}
          change="+0.1"
        />
      </div>

      {/* Sessions over time */}
      <SectionCard title="Sessions over time" className="mb-8">
        <div className="flex items-end gap-3 h-[160px]">
          {monthlyData.map((d) => {
            const height = (d.sessions / 400) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[12px] font-medium text-text-primary">{d.sessions}</div>
                <div className="w-full rounded-t-[6px] bg-gradient-to-t from-primary to-violet transition-all" style={{ height: `${height}%` }} />
                <div className="text-[12px] text-text-muted">{d.month}</div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Top topics */}
      <SectionCard title="Top topics">
        <div className="space-y-3.5">
          {topTopics.map((t) => (
            <div key={t.name} className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-primary bg-primary-50 border border-primary/10 px-2.5 py-0.5 rounded-full">{t.name}</span>
              <div className="flex-1 h-2 bg-surface-dim rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-violet rounded-full" style={{ width: `${t.percentage}%` }} />
              </div>
              <span className="text-[13px] text-text-secondary w-12 text-right">{t.percentage}%</span>
              <span className="text-[12px] text-text-muted w-12 text-right">{t.count}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
