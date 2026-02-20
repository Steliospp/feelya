import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Calendar, MessageCircle } from 'lucide-react';
import Avatar from '../../components/ui/avatar';
import Badge from '../../components/ui/badge';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import { Chip } from '../../components/ui/chip';

const therapist = {
  id: 'g1',
  name: 'Dr Sarah Chen',
  color: '#c4b5fd',
  licensed: true,
  rating: 4.9,
  sessions: 1240,
  credentials: 'Clinical Psychologist, PhD',
  yearsExperience: 12,
  about: 'I specialise in anxiety, stress, and burnout using evidence-based approaches including CBT and mindfulness. With over 12 years of clinical experience, I believe everyone deserves a safe, non-judgemental space to be heard and supported.',
  specialties: ['Anxiety', 'Stress', 'Burnout', 'CBT', 'Mindfulness'],
  approach: ['Cognitive Behavioural Therapy', 'Mindfulness-Based Stress Reduction', 'Solution-Focused Therapy'],
  availability: [
    { day: 'Mon 24 Feb', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'] },
    { day: 'Tue 25 Feb', slots: ['10:00 AM', '11:00 AM', '3:00 PM'] },
    { day: 'Wed 26 Feb', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] },
    { day: 'Thu 27 Feb', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
  ],
};

export default function TherapistProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div className="max-w-[720px]">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full bg-surface border border-border-light flex items-center justify-center hover:bg-surface-dim hover:shadow-card transition-all cursor-pointer mb-6"
      >
        <ArrowLeft className="w-5 h-5 text-text-primary" />
      </button>

      {/* Hero card */}
      <Card className="!p-0 overflow-hidden mb-6">
        <div className="bg-surface-muted px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar name={therapist.name} color={therapist.color} size="xl" />
            <div>
              <h1 className="text-[22px] font-semibold text-text-primary font-serif">{therapist.name}</h1>
              <p className="text-[14px] text-text-secondary mt-0.5">{therapist.credentials}</p>
              <div className="flex items-center gap-3 mt-2">
                {therapist.licensed && (
                  <Badge variant="success">
                    <Shield className="w-3 h-3 mr-1" /> Licensed
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-[14px] font-medium text-text-primary">{therapist.rating}</span>
                </div>
                <span className="text-[13px] text-text-secondary">{therapist.yearsExperience} years exp.</span>
              </div>
              <p className="text-[12px] text-text-muted mt-1">{therapist.sessions.toLocaleString()} sessions delivered</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 flex gap-3">
          <Button variant="primary" size="md" onClick={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })}>
            <Calendar className="w-4 h-4" /> Schedule session
          </Button>
          <Button variant="outline" size="md">
            <MessageCircle className="w-4 h-4" /> Message
          </Button>
        </div>
      </Card>

      {/* About */}
      <Card className="mb-4 !p-5">
        <h2 className="text-[16px] font-semibold text-text-primary mb-2">About</h2>
        <p className="text-[14px] text-text-secondary leading-relaxed">{therapist.about}</p>
      </Card>

      {/* Specialties */}
      <Card className="mb-4 !p-5">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {therapist.specialties.map((s) => (
            <span key={s} className="text-[12px] font-medium text-primary bg-primary-50 px-2.5 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      </Card>

      {/* Approach */}
      <Card className="mb-4 !p-5">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">Approach</h2>
        <ul className="space-y-2">
          {therapist.approach.map((a) => (
            <li key={a} className="text-[14px] text-text-secondary flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </Card>

      {/* Availability */}
      <Card id="availability" className="!p-5">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Availability</h2>
        <div className="space-y-5">
          {therapist.availability.map((day) => (
            <div key={day.day}>
              <div className="text-[13px] font-medium text-text-secondary mb-2.5">{day.day}</div>
              <div className="flex flex-wrap gap-2">
                {day.slots.map((slot) => {
                  const key = `${day.day}-${slot}`;
                  return (
                    <Chip
                      key={slot}
                      active={selectedSlot === key}
                      onClick={() => setSelectedSlot(key)}
                    >
                      {slot}
                    </Chip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {selectedSlot && (
          <Button variant="primary" size="lg" full className="mt-5">
            Confirm booking
          </Button>
        )}
      </Card>
    </div>
  );
}
