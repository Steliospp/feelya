import Card from './card';
import Avatar from './avatar';
import Badge from './badge';
import Button from './button';
import { Calendar, Clock, Video } from 'lucide-react';

export default function HeroSessionCard({ session, onJoin, onReschedule }) {
  return (
    <Card className="!p-0 overflow-hidden !border-border/70 shadow-sm">
      <div className="px-6 py-5">
        <div className="text-[12px] font-medium uppercase tracking-wider text-text-muted mb-4">
          Next session
        </div>

        <div className="flex items-center gap-4">
          <Avatar name={session.therapist} color={session.color} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-semibold text-text-primary">{session.therapist}</div>
            <Badge variant="default" className="mt-1">{session.topic}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 mt-4 text-[13px] text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-text-muted" /> {session.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-text-muted" /> {session.time}
          </span>
          <span className="flex items-center gap-1.5">
            <Video className="w-4 h-4 text-text-muted" /> {session.mode}
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
        <p className="text-[12px] text-text-muted mt-3">
          You can join 5 min before. We'll remind you.
        </p>
      </div>
    </Card>
  );
}
