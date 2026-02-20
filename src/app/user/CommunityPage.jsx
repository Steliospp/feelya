import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Heart, Plus } from 'lucide-react';
import SearchInput from '@/components/ui/search-input';
import { Chip, ChipRow } from '@/components/ui/chip';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

const communityTopics = ['All', 'Anxiety', 'Confidence', 'Relationships', 'Career', 'Burnout', 'Parenting'];

const threads = [
  { id: 1, title: 'How do you deal with Sunday anxiety?', preview: 'Every Sunday evening I get this dread about the week ahead. Does anyone else experience this?', author: 'Anonymous', time: '2h ago', replies: 14, likes: 23, topic: 'Anxiety' },
  { id: 2, title: 'Tips for speaking up in meetings', preview: "I'm naturally quiet and struggle to contribute in team meetings. Any strategies?", author: 'Anonymous', time: '5h ago', replies: 8, likes: 31, topic: 'Confidence' },
  { id: 3, title: 'Setting boundaries with a micromanaging boss', preview: "My manager checks in constantly. How do I set healthy boundaries without causing friction?", author: 'Anonymous', time: '1d ago', replies: 22, likes: 45, topic: 'Career' },
  { id: 4, title: 'Morning routines that actually help', preview: "I've tried everything — cold showers, 5am wakeups. What genuinely works for you?", author: 'Anonymous', time: '1d ago', replies: 19, likes: 38, topic: 'Burnout' },
  { id: 5, title: 'How to be honest about feelings in a relationship', preview: 'I find it really hard to be vulnerable with my partner. Any advice on opening up?', author: 'Anonymous', time: '2d ago', replies: 11, likes: 27, topic: 'Relationships' },
];

export default function CommunityPage() {
  const [activeTopic, setActiveTopic] = useState('All');
  const navigate = useNavigate();

  const filtered = activeTopic === 'All' ? threads : threads.filter((t) => t.topic === activeTopic);

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[28px] font-semibold text-text-primary">Community</h1>
        <Button variant="primary" size="sm" onClick={() => navigate('/app/community/new')}>
          <Plus className="w-4 h-4" /> Post
        </Button>
      </div>

      <SearchInput placeholder="Search discussions..." className="mb-4" />

      <ChipRow className="mb-5">
        {communityTopics.map((t) => (
          <Chip key={t} active={activeTopic === t} onClick={() => setActiveTopic(t)}>{t}</Chip>
        ))}
      </ChipRow>

      <div className="space-y-2">
        {filtered.map((thread) => (
          <Card key={thread.id} className="!p-4 cursor-pointer hover:shadow-elevated transition-shadow" onClick={() => navigate(`/app/community/${thread.id}`)}>
            <div className="text-[15px] font-semibold text-text-primary">{thread.title}</div>
            <p className="text-[14px] text-text-secondary mt-1 line-clamp-2">{thread.preview}</p>
            <div className="flex items-center gap-4 mt-3 text-[12px] text-text-muted">
              <span>{thread.author}</span>
              <span>{thread.time}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {thread.replies}</span>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {thread.likes}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
