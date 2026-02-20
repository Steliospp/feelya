import { useState } from 'react';
import { BookOpen, Wind, Headphones, Phone, ArrowRight, Search } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';

const categories = ['All', 'Articles', 'Tools', 'Audio', 'Crisis'];

const resources = [
  { id: 1, title: '2-minute breathing exercise', type: 'Tool', time: '2 min', icon: Wind, category: 'Tools' },
  { id: 2, title: 'How to calm racing thoughts', type: 'Article', time: '3 min', icon: BookOpen, category: 'Articles' },
  { id: 3, title: 'Setting boundaries at work', type: 'Guide', time: '5 min', icon: BookOpen, category: 'Articles' },
  { id: 4, title: 'Body scan meditation', type: 'Audio', time: '10 min', icon: Headphones, category: 'Audio' },
  { id: 5, title: 'Journaling for anxiety', type: 'Tool', time: '5 min', icon: Wind, category: 'Tools' },
  { id: 6, title: 'Understanding burnout', type: 'Article', time: '4 min', icon: BookOpen, category: 'Articles' },
  { id: 7, title: 'Progressive muscle relaxation', type: 'Audio', time: '8 min', icon: Headphones, category: 'Audio' },
  { id: 8, title: 'Building daily confidence habits', type: 'Article', time: '4 min', icon: BookOpen, category: 'Articles' },
];

const crisisResources = [
  { id: 'c1', title: 'Samaritans', desc: 'Free 24/7 support', phone: '116 123' },
  { id: 'c2', title: 'Crisis Text Line', desc: 'Text support', phone: 'Text SHOUT to 85258' },
  { id: 'c3', title: 'NHS Urgent Mental Health', desc: 'Get help now', phone: '111' },
];

export default function ResourcesPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = resources.filter((r) => {
    const matchesFilter = filter === 'All' || r.category === filter;
    const matchesSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="text-[26px] font-semibold text-text-primary mb-1">Resources</h1>
      <p className="text-[14px] text-text-secondary mb-4">Articles, tools, and support when you need it.</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-surface border border-border-light rounded-[12px] text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      <ChipRow className="mb-5">
        {categories.map((c) => (
          <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</Chip>
        ))}
      </ChipRow>

      {/* Crisis support — always visible when Crisis filter is active or as a section */}
      {(filter === 'Crisis' || filter === 'All') && (
        <section className="mb-6">
          <h2 className="text-[16px] font-semibold text-text-primary mb-3">Crisis support</h2>
          <Card className="!p-0 overflow-hidden">
            {crisisResources.map((r, i) => (
              <div key={r.id}>
                {i > 0 && <div className="border-t border-border-light" />}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-[10px] bg-danger-bg flex items-center justify-center text-danger shrink-0">
                    <Phone className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-text-primary">{r.title}</div>
                    <div className="text-[12px] text-text-muted">{r.desc}</div>
                  </div>
                  <span className="text-[13px] font-medium text-primary shrink-0">{r.phone}</span>
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Resources list */}
      {filter !== 'Crisis' && (
        <section>
          {filter === 'All' && <h2 className="text-[16px] font-semibold text-text-primary mb-3">Browse</h2>}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[14px] text-text-muted">No resources found.</p>
            </div>
          ) : (
            <Card className="!p-0 overflow-hidden">
              {filtered.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={r.id}>
                    {i > 0 && <div className="border-t border-border-light" />}
                    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-dim transition-colors">
                      <div className="w-9 h-9 rounded-[10px] bg-primary-50 flex items-center justify-center text-primary shrink-0">
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-text-primary truncate">{r.title}</div>
                        <div className="text-[12px] text-text-muted">{r.type} &middot; {r.time}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
