import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Search } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Avatar from '../../components/ui/avatar';
import PageHeader from '../../components/ui/page-header';

const specialties = ['All', 'Anxiety', 'Stress', 'Burnout', 'Career', 'Relationships', 'Sleep', 'CBT'];

const therapists = [
  { id: 'g1', name: 'Dr Sarah Chen', color: '#c4b5fd', licensed: true, rating: 4.9, sessions: 1240, specialties: ['Anxiety', 'CBT', 'Stress'], credentials: 'Clinical Psychologist, PhD' },
  { id: 'g2', name: 'James Okafor', color: '#a5b4fc', licensed: true, rating: 4.8, sessions: 890, specialties: ['Career', 'Burnout'], credentials: 'Counselling Psychologist, MSc' },
  { id: 'g3', name: 'Priya Sharma', color: '#86efac', licensed: true, rating: 4.9, sessions: 1100, specialties: ['Stress', 'Burnout', 'Sleep'], credentials: 'Psychotherapist, BACP' },
  { id: 'g4', name: 'Tom Williams', color: '#fbbf24', licensed: true, rating: 4.7, sessions: 620, specialties: ['Relationships'], credentials: 'Couples Therapist, UKCP' },
  { id: 'g5', name: 'Emma Clarke', color: '#f9a8d4', licensed: true, rating: 4.8, sessions: 780, specialties: ['Sleep', 'Anxiety'], credentials: 'Clinical Psychologist, DClinPsy' },
  { id: 'g6', name: 'David Kim', color: '#67e8f9', licensed: true, rating: 4.6, sessions: 540, specialties: ['Career', 'CBT'], credentials: 'Cognitive Behavioural Therapist' },
];

export default function TherapistDirectoryPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = therapists.filter((t) => {
    const matchesFilter = filter === 'All' || t.specialties.includes(filter);
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <PageHeader title="Therapists" description="Company-approved professionals available to you." />

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 bg-surface border border-border-light rounded-[12px] text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-card"
        />
      </div>

      {/* Filter chips */}
      <ChipRow className="mb-6">
        {specialties.map((s) => (
          <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>{s}</Chip>
        ))}
      </ChipRow>

      {/* Therapist grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-text-muted">No therapists found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <Card
              key={t.id}
              elevation={1}
              className="!p-5 cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
              onClick={() => navigate(`/app/therapist/${t.id}`)}
            >
              <div className="flex items-center gap-4">
                <Avatar name={t.name} color={t.color} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-text-primary truncate">{t.name}</span>
                    {t.licensed && (
                      <span className="flex items-center text-success">
                        <Shield className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-text-secondary mt-0.5">{t.credentials}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      <span className="text-[13px] font-medium text-text-primary">{t.rating}</span>
                    </div>
                    <span className="text-[12px] text-text-muted">&middot;</span>
                    <span className="text-[12px] text-text-muted">{t.sessions.toLocaleString()} sessions</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {t.specialties.map((s) => (
                  <span key={s} className="text-[12px] font-medium text-primary bg-primary-50 border border-primary/10 px-2.5 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
