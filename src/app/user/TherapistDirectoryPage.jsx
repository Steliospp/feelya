import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Search } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Card from '../../components/ui/card';
import Avatar from '../../components/ui/avatar';
import Badge from '../../components/ui/badge';

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
      <h1 className="text-[28px] font-semibold text-text-primary mb-1">Therapists</h1>
      <p className="text-[14px] text-text-secondary mb-4">Company-approved professionals available to you.</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-surface border border-border-light rounded-[12px] text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      {/* Filter chips */}
      <ChipRow className="mb-5">
        {specialties.map((s) => (
          <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>{s}</Chip>
        ))}
      </ChipRow>

      {/* Therapist list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-text-muted">No therapists found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <Card
              key={t.id}
              className="!p-4 cursor-pointer hover:shadow-elevated transition-shadow"
              onClick={() => navigate(`/app/therapist/${t.id}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar name={t.name} color={t.color} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-text-primary truncate">{t.name}</span>
                    {t.licensed && (
                      <span className="flex items-center gap-0.5 text-success">
                        <Shield className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-text-secondary mt-0.5">{t.credentials}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-[12px] text-text-secondary">{t.rating}</span>
                    </div>
                    <span className="text-[12px] text-text-muted">&middot;</span>
                    <span className="text-[12px] text-text-muted">{t.sessions.toLocaleString()} sessions</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {t.specialties.map((s) => (
                  <Badge key={s} variant="muted">{s}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
