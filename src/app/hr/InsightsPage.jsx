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

const maxSessions = Math.max(...monthlyData.map((d) => d.sessions));

export default function InsightsPage() {
  const latest = monthlyData[monthlyData.length - 1];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[32px] font-semibold text-neutral-900 tracking-tight">Insights</h1>
        <p className="text-[15px] text-neutral-400 mt-1.5">Engagement trends and programme analytics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Sessions this month', value: latest.sessions, change: '+18% vs last month' },
          { label: 'Workshop attendance', value: latest.workshops, change: '+21% vs last month' },
          { label: 'Satisfaction score', value: `${latest.satisfaction}/5`, change: '+0.1 vs last month' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60">
            <div className="text-[12px] font-medium text-neutral-400 uppercase tracking-wider mb-3">{card.label}</div>
            <div className="text-[32px] font-semibold text-neutral-900 tracking-tight leading-none">{card.value}</div>
            <div className="text-[12px] font-medium text-emerald-500 mt-2">{card.change}</div>
          </div>
        ))}
      </div>

      {/* Sessions over time */}
      <section className="mb-10">
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Sessions over time</h2>
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60">
          <div className="flex items-end gap-4 h-[180px]">
            {monthlyData.map((d) => {
              const height = (d.sessions / maxSessions) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[12px] font-medium text-neutral-900 tabular-nums">{d.sessions}</div>
                  <div
                    className="w-full rounded-md bg-neutral-900 transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-[11px] font-medium text-neutral-400 uppercase">{d.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top topics */}
      <section>
        <h2 className="text-[14px] font-semibold text-neutral-900 mb-4">Top topics</h2>
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-neutral-200/60">
          <div className="space-y-4">
            {topTopics.map((t) => (
              <div key={t.name} className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-neutral-900 w-28 shrink-0">{t.name}</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 rounded-full transition-all"
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
                <span className="text-[13px] font-medium text-neutral-900 w-10 text-right tabular-nums">{t.percentage}%</span>
                <span className="text-[12px] text-neutral-400 w-12 text-right tabular-nums">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
