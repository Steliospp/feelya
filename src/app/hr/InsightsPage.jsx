import Card from '../../components/ui/card';
import Badge from '../../components/ui/badge';

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
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-text-primary">Insights</h1>
        <p className="text-[15px] text-text-secondary mt-1">Engagement trends and programme analytics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="!p-5">
          <div className="text-[13px] text-text-secondary mb-1">Sessions this month</div>
          <div className="text-[28px] font-semibold text-text-primary">{latest.sessions}</div>
          <div className="text-[13px] text-success font-medium mt-1">+18% vs last month</div>
        </Card>
        <Card className="!p-5">
          <div className="text-[13px] text-text-secondary mb-1">Workshop attendance</div>
          <div className="text-[28px] font-semibold text-text-primary">{latest.workshops}</div>
          <div className="text-[13px] text-success font-medium mt-1">+21% vs last month</div>
        </Card>
        <Card className="!p-5">
          <div className="text-[13px] text-text-secondary mb-1">Satisfaction score</div>
          <div className="text-[28px] font-semibold text-text-primary">{latest.satisfaction}/5</div>
          <div className="text-[13px] text-success font-medium mt-1">+0.1 vs last month</div>
        </Card>
      </div>

      {/* Sessions over time */}
      <Card className="mb-6 !p-5">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Sessions over time</h2>
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
      </Card>

      {/* Top topics */}
      <Card className="!p-5">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Top topics</h2>
        <div className="space-y-3">
          {topTopics.map((t) => (
            <div key={t.name} className="flex items-center gap-3">
              <Badge>{t.name}</Badge>
              <div className="flex-1 h-2 bg-surface-dim rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-violet rounded-full" style={{ width: `${t.percentage}%` }} />
              </div>
              <span className="text-[13px] text-text-secondary w-12 text-right">{t.percentage}%</span>
              <span className="text-[12px] text-text-muted w-12 text-right">{t.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
