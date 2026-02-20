import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Phone, Video, MessageCircle, Loader2 } from 'lucide-react';
import { Chip, ChipRow } from '../../components/ui/chip';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import SearchInput from '../../components/ui/search-input';
import { cn } from '../../lib/utils';

const categories = [
  { name: 'Anxiety', emoji: '😰' },
  { name: 'Stress', emoji: '😤' },
  { name: 'Confidence', emoji: '💪' },
  { name: 'Career', emoji: '💼' },
  { name: 'Relationships', emoji: '❤️' },
  { name: 'Burnout', emoji: '🔥' },
  { name: 'Sleep', emoji: '😴' },
  { name: 'Grief', emoji: '🕊️' },
  { name: 'Anger', emoji: '😠' },
  { name: 'Self-esteem', emoji: '🪞' },
  { name: 'Loneliness', emoji: '🫂' },
  { name: 'Motivation', emoji: '🚀' },
];

const steps = ['topic', 'extras', 'type', 'mode', 'matching'];

export default function StartPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('topic');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [guideType, setGuideType] = useState(null);
  const [mode, setMode] = useState(null);

  const toggleTopic = (name) => {
    setSelectedTopics((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx <= 0) navigate(-1);
    else setStep(steps[idx - 1]);
  };

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  if (step === 'matching') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h2 className="text-[22px] font-semibold text-text-primary">Finding someone...</h2>
        <p className="text-[15px] text-text-secondary mt-2 max-w-[280px]">We're matching you with the best available {guideType === 'licensed' ? 'professional' : 'guide'}.</p>
        <p className="text-[13px] text-text-muted mt-4">Usually under 2 minutes</p>
        <Button variant="ghost" size="md" className="mt-6" onClick={() => navigate('/app')}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-surface-dim transition-colors cursor-pointer border-none">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary">
            {step === 'topic' && 'What do you want to talk about?'}
            {step === 'extras' && 'Anything else?'}
            {step === 'type' && 'Choose your guide'}
            {step === 'mode' && 'How do you want to connect?'}
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            {step === 'topic' && 'Pick one or more topics'}
            {step === 'extras' && 'Add more topics or continue'}
            {step === 'type' && 'Licensed professionals or peer guides'}
            {step === 'mode' && 'Pick what feels right'}
          </p>
        </div>
      </div>

      {/* Step: Topic */}
      {(step === 'topic' || step === 'extras') && (
        <>
          {step === 'extras' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTopics.map((t) => (
                <Chip key={t} active>{t}</Chip>
              ))}
            </div>
          )}
          <SearchInput placeholder="Search topics..." className="mb-4" />
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => toggleTopic(c.name)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-[12px] text-left transition-all cursor-pointer border',
                  selectedTopics.includes(c.name)
                    ? 'bg-primary-50 border-primary text-primary'
                    : 'bg-surface border-border-light text-text-primary hover:border-primary/30'
                )}
              >
                <span className="text-[20px]">{c.emoji}</span>
                <span className="text-[14px] font-medium">{c.name}</span>
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            size="lg"
            full
            className="mt-6"
            disabled={selectedTopics.length === 0}
            onClick={() => setStep(step === 'topic' ? 'extras' : 'type')}
          >
            Continue
          </Button>
        </>
      )}

      {/* Step: Guide type */}
      {step === 'type' && (
        <div className="space-y-3">
          <Card
            className={cn('cursor-pointer border-2 transition-all', guideType === 'licensed' ? 'border-primary bg-primary-50' : 'border-transparent hover:border-primary/30')}
            onClick={() => setGuideType('licensed')}
          >
            <div className="text-[16px] font-semibold text-text-primary">Licensed Professional</div>
            <p className="text-[14px] text-text-secondary mt-1">Accredited therapists and counsellors with clinical training.</p>
          </Card>
          <Card
            className={cn('cursor-pointer border-2 transition-all', guideType === 'guide' ? 'border-primary bg-primary-50' : 'border-transparent hover:border-primary/30')}
            onClick={() => setGuideType('guide')}
          >
            <div className="text-[16px] font-semibold text-text-primary">Guide</div>
            <p className="text-[14px] text-text-secondary mt-1">Trained listeners who offer support and accountability.</p>
          </Card>
          <Button variant="primary" size="lg" full className="mt-4" disabled={!guideType} onClick={goNext}>Continue</Button>
        </div>
      )}

      {/* Step: Mode */}
      {step === 'mode' && (
        <div className="space-y-3">
          {[
            { id: 'chat', label: 'Chat', desc: 'Text conversation at your pace', icon: <MessageCircle className="w-6 h-6" /> },
            { id: 'call', label: 'Call', desc: 'Voice call for a personal touch', icon: <Phone className="w-6 h-6" /> },
            { id: 'video', label: 'Video', desc: 'Face-to-face connection', icon: <Video className="w-6 h-6" /> },
          ].map((m) => (
            <Card
              key={m.id}
              className={cn(
                'flex items-center gap-4 cursor-pointer border-2 transition-all',
                mode === m.id ? 'border-primary bg-primary-50' : 'border-transparent hover:border-primary/30'
              )}
              onClick={() => setMode(m.id)}
            >
              <div className="w-12 h-12 rounded-[12px] bg-primary-50 flex items-center justify-center text-primary">{m.icon}</div>
              <div>
                <div className="text-[16px] font-semibold text-text-primary">{m.label}</div>
                <div className="text-[14px] text-text-secondary">{m.desc}</div>
              </div>
            </Card>
          ))}
          <Button variant="primary" size="lg" full className="mt-4" disabled={!mode} onClick={goNext}>
            Find someone
          </Button>
        </div>
      )}
    </div>
  );
}
