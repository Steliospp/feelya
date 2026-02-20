import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Wind, ArrowRight, Star, MessageCircle } from 'lucide-react';
import Avatar from '../../components/ui/avatar';
import Card from '../../components/ui/card';
import SearchInput from '../../components/ui/search-input';
import { Chip, ChipRow } from '../../components/ui/chip';
import Button from '../../components/ui/button';
import Badge from '../../components/ui/badge';
import { useState } from 'react';

const topics = ['Anxiety', 'Confidence', 'Career', 'Relationships', 'Stress', 'Burnout', 'Fitness', 'Sleep'];

const quickReads = [
  { id: 1, title: 'How to calm racing thoughts', type: 'Article', time: '3 min', icon: <BookOpen className="w-5 h-5" /> },
  { id: 2, title: '2-minute breathing exercise', type: 'Tool', time: '2 min', icon: <Wind className="w-5 h-5" /> },
  { id: 3, title: 'Setting boundaries at work', type: 'Guide', time: '5 min', icon: <BookOpen className="w-5 h-5" /> },
];

const topGuides = [
  { id: 'g1', name: 'Dr Sarah Chen', tags: ['Anxiety', 'CBT'], rating: 4.9, sessions: 1240, color: '#c4b5fd', licensed: true },
  { id: 'g2', name: 'James Okafor', tags: ['Confidence', 'Career'], rating: 4.8, sessions: 890, color: '#a5b4fc', licensed: false },
  { id: 'g3', name: 'Priya Sharma', tags: ['Stress', 'Burnout'], rating: 4.9, sessions: 1100, color: '#86efac', licensed: true },
  { id: 'g4', name: 'Tom Williams', tags: ['Relationships'], rating: 4.7, sessions: 620, color: '#fbbf24', licensed: false },
];

const lastGuide = {
  id: 'g1',
  name: 'Dr Sarah Chen',
  rating: 4.9,
  sessions: 1240,
  color: '#c4b5fd',
  tags: ['Anxiety', 'CBT', 'Licensed'],
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(null);
  const firstName = user?.first_name || 'there';

  return (
    <div className="px-4 pt-4 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-text-primary leading-tight">{getGreeting()}, {firstName}</h1>
          <p className="text-[15px] text-text-secondary mt-0.5">What's on your mind today?</p>
        </div>
        <button onClick={() => navigate('/app/profile')} className="cursor-pointer bg-transparent border-none p-0">
          <Avatar name={`${user?.first_name} ${user?.last_name}`} color={user?.avatar_color} size="md" />
        </button>
      </div>

      {/* Search */}
      <SearchInput placeholder="Search topics, guides..." />

      {/* Topic chips */}
      <ChipRow>
        {topics.map((t) => (
          <Chip key={t} active={activeTopic === t} onClick={() => setActiveTopic(activeTopic === t ? null : t)}>
            {t}
          </Chip>
        ))}
      </ChipRow>

      {/* Primary CTA card */}
      <Card className="bg-gradient-to-br from-primary to-violet !text-white p-5">
        <h2 className="text-[18px] font-semibold">Start a chat</h2>
        <p className="text-[14px] opacity-80 mt-1">Pick a topic and we'll connect you fast.</p>
        <Button variant="white" size="md" className="mt-4" onClick={() => navigate('/app/start')}>
          Choose topic <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>

      {/* Quick reads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-text-primary">Quick reads</h2>
          <button className="text-[13px] font-medium text-primary cursor-pointer bg-transparent border-none no-underline hover:no-underline">See all</button>
        </div>
        <div className="space-y-2">
          {quickReads.map((r) => (
            <Card key={r.id} className="flex items-center gap-3 !p-3 cursor-pointer hover:shadow-elevated transition-shadow">
              <div className="w-10 h-10 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary shrink-0">
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-text-primary truncate">{r.title}</div>
                <div className="text-[12px] text-text-secondary">{r.type} &middot; {r.time}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
            </Card>
          ))}
        </div>
      </div>

      {/* Your last guide */}
      <div>
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">Your last guide</h2>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <Avatar name={lastGuide.name} color={lastGuide.color} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-text-primary">{lastGuide.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                <span className="text-[13px] text-text-secondary">{lastGuide.rating} &middot; {lastGuide.sessions} chats</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {lastGuide.tags.map((t) => (
              <Badge key={t} variant="default">{t}</Badge>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/app/guide/${lastGuide.id}`)}>
              View profile
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="w-4 h-4" /> Message
            </Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/app/guide/${lastGuide.id}`)}>
              Rebook
            </Button>
          </div>
        </Card>
      </div>

      {/* Top guides carousel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-text-primary">Top guides</h2>
          <button className="text-[13px] font-medium text-primary cursor-pointer bg-transparent border-none no-underline hover:no-underline" onClick={() => navigate('/app/guides')}>See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
          {topGuides.map((g) => (
            <Card
              key={g.id}
              className="min-w-[160px] !p-4 cursor-pointer hover:shadow-elevated transition-shadow shrink-0"
              onClick={() => navigate(`/app/guide/${g.id}`)}
            >
              <Avatar name={g.name} color={g.color} size="lg" className="mx-auto" />
              <div className="text-[14px] font-semibold text-text-primary text-center mt-2">{g.name}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-[12px] text-text-secondary">{g.rating}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {g.tags.slice(0, 2).map((t) => (
                  <Badge key={t} variant="muted">{t}</Badge>
                ))}
              </div>
              {g.licensed && <Badge variant="success" className="mx-auto mt-2">Licensed</Badge>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
