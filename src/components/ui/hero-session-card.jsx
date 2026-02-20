import Card from './card';
import Avatar from './avatar';
import Badge from './badge';
import Button from './button';
import { Calendar, Clock, Video } from 'lucide-react';

export default function HeroSessionCard({ session, onJoin, onReschedule }) {
  return (
    <Card elevation={2} className="!p-0 overflow-hidden">
      {/* Tinted header strip */}
      <div className="bg-gradient-to-r from-primary-50 via-primary-50/60 to-transparent px-6 py-4">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-primary/70">
          Next session
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div className="flex items-center gap-4">
          <Avatar name={session.therapist} color={session.color} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="text-[17px] font-semibold text-text-primary">{session.therapist}</div>
            <Badge variant="default" className="mt-1.5">{session.topic}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 mt-5 text-[14px] text-text-secondary">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/60" /> {session.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary/60" /> {session.time}
          </span>
          <span className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary/60" /> {session.mode}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <Button variant="outline" size="md" onClick={onReschedule}>
            Reschedule
          </Button>
          <Button variant="primary" size="md" onClick={onJoin}>
            <Video className="w-4 h-4" /> Join session
          </Button>
        </div>
        <p className="text-[13px] text-text-muted mt-3">
          You can join 5 min before. We'll remind you.
        </p>
      </div>
    </Card>
  );
}
