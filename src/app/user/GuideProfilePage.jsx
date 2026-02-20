import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MessageCircle, Calendar, Shield } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';

const guide = {
  id: 'g1',
  name: 'Dr Sarah Chen',
  color: '#c4b5fd',
  licensed: true,
  rating: 4.9,
  sessions: 1240,
  bio: 'I specialise in anxiety, stress, and burnout using evidence-based approaches including CBT and mindfulness. I believe everyone deserves a safe space to be heard.',
  specialties: ['Anxiety', 'Stress', 'Burnout', 'CBT', 'Mindfulness'],
  style: ['Calm', 'Direct', 'Empathetic'],
  availability: [
    { day: 'Mon 24 Feb', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'] },
    { day: 'Tue 25 Feb', slots: ['10:00 AM', '11:00 AM', '3:00 PM'] },
    { day: 'Wed 26 Feb', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] },
    { day: 'Thu 27 Feb', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
  ],
};

export default function GuideProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="px-4 pt-4 pb-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-surface-dim transition-colors cursor-pointer border-none mb-4">
        <ArrowLeft className="w-5 h-5 text-text-primary" />
      </button>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar name={guide.name} color={guide.color} size="xl" />
        <h1 className="text-[22px] font-semibold text-text-primary mt-3">{guide.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          {guide.licensed && <Badge variant="success"><Shield className="w-3 h-3 mr-1" /> Licensed</Badge>}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="text-[14px] font-medium text-text-primary">{guide.rating}</span>
          </div>
          <span className="text-[13px] text-text-secondary">{guide.sessions.toLocaleString()} chats</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Button variant="primary" size="lg" full onClick={() => navigate('/app/start')}>
          <MessageCircle className="w-5 h-5" /> Start chat now
        </Button>
      </div>
      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="md" full>
          <Calendar className="w-4 h-4" /> Schedule
        </Button>
        <Button variant="outline" size="md" full>
          <MessageCircle className="w-4 h-4" /> Message
        </Button>
      </div>

      {/* About */}
      <Card className="mb-4">
        <h2 className="text-[16px] font-semibold text-text-primary mb-2">About</h2>
        <p className="text-[14px] text-text-secondary leading-relaxed">{guide.bio}</p>
      </Card>

      {/* Specialties */}
      <Card className="mb-4">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {guide.specialties.map((s) => <Badge key={s}>{s}</Badge>)}
        </div>
      </Card>

      {/* Style */}
      <Card className="mb-4">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">Style</h2>
        <div className="flex flex-wrap gap-2">
          {guide.style.map((s) => <Badge key={s} variant="muted">{s}</Badge>)}
        </div>
      </Card>

      {/* Availability */}
      <Card id="availability">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">Availability</h2>
        <div className="space-y-4">
          {guide.availability.map((day) => (
            <div key={day.day}>
              <div className="text-[13px] font-medium text-text-secondary mb-2">{day.day}</div>
              <div className="flex flex-wrap gap-2">
                {day.slots.map((slot) => (
                  <Chip key={slot} onClick={() => {}}>{slot}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
