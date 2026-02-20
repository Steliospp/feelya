import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Star, MessageCircle, BookOpen, Wind, Calendar, Clock, Video } from 'lucide-react';
import { useState } from 'react';

const topics = ['All', 'Anxiety', 'Confidence', 'Career', 'Relationships', 'Stress', 'Burnout', 'Sleep'];

const quickReads = [
  { id: 1, title: 'How to calm racing thoughts', type: 'Article', time: '3 min', icon: BookOpen, topics: ['Anxiety'] },
  { id: 2, title: '2-minute breathing exercise', type: 'Tool', time: '2 min', icon: Wind, topics: ['Stress', 'Anxiety'] },
  { id: 3, title: 'Setting boundaries at work', type: 'Guide', time: '5 min', icon: BookOpen, topics: ['Career', 'Burnout'] },
  { id: 4, title: 'Building daily confidence habits', type: 'Article', time: '4 min', icon: BookOpen, topics: ['Confidence'] },
];

const topGuides = [
  { id: 'g1', name: 'Dr Sarah Chen', tags: ['Anxiety', 'CBT'], rating: 4.9, sessions: 1240, color: '#c4b5fd', licensed: true },
  { id: 'g2', name: 'James Okafor', tags: ['Confidence', 'Career'], rating: 4.8, sessions: 890, color: '#a5b4fc', licensed: false },
  { id: 'g3', name: 'Priya Sharma', tags: ['Stress', 'Burnout'], rating: 4.9, sessions: 1100, color: '#86efac', licensed: true },
  { id: 'g4', name: 'Tom Williams', tags: ['Relationships'], rating: 4.7, sessions: 620, color: '#fbbf24', licensed: false },
  { id: 'g5', name: 'Emma Clarke', tags: ['Sleep', 'Anxiety'], rating: 4.8, sessions: 780, color: '#f9a8d4', licensed: true },
  { id: 'g6', name: 'David Kim', tags: ['Career', 'Confidence'], rating: 4.6, sessions: 540, color: '#67e8f9', licensed: false },
];

const lastGuide = {
  id: 'g1', name: 'Dr Sarah Chen', rating: 4.9, sessions: 1240, color: '#c4b5fd',
  tags: ['Anxiety', 'CBT', 'Licensed'],
};

const upcomingSessions = [
  { id: 1, guide: 'Dr Sarah Chen', color: '#c4b5fd', topic: 'Anxiety', date: 'Mon 24 Feb', time: '10:00 AM', mode: 'video' },
  { id: 2, guide: 'James Okafor', color: '#a5b4fc', topic: 'Career', date: 'Wed 26 Feb', time: '2:00 PM', mode: 'chat' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState('All');
  const firstName = user?.first_name || 'there';

  const filteredReads = activeTopic === 'All'
    ? quickReads
    : quickReads.filter((r) => r.topics.includes(activeTopic));

  const filteredGuides = activeTopic === 'All'
    ? topGuides
    : topGuides.filter((g) => g.tags.includes(activeTopic));

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-[15px] text-gray-500 mt-1">What's on your mind today?</p>
      </div>

      {/* Topic filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTopic(t)}
            className={`h-8 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-none ${
              activeTopic === t
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={activeTopic !== t ? { border: '1px solid #e5e7eb' } : {}}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left column — primary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Start a chat hero */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-[20px] font-semibold text-gray-900">Start a chat</h2>
            <p className="text-[14px] text-gray-500 mt-1">
              Pick a topic and we'll match you with a guide in minutes.
            </p>
            <button
              onClick={() => navigate('/app/start')}
              className="mt-4 inline-flex items-center gap-2 h-10 px-5 bg-indigo-600 text-white text-[14px] font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer border-none"
            >
              Choose a topic <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick reads */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-semibold text-gray-900">Quick reads</h2>
              <button className="text-[13px] font-medium text-indigo-600 cursor-pointer bg-transparent border-none hover:text-indigo-700">
                View all
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {filteredReads.length === 0 && (
                <div className="px-5 py-8 text-center text-[14px] text-gray-400">
                  No reads for this topic yet.
                </div>
              )}
              {filteredReads.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-gray-900 truncate">{r.title}</div>
                      <div className="text-[12px] text-gray-400 mt-0.5">{r.type} &middot; {r.time}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top guides */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-semibold text-gray-900">Top guides</h2>
              <button
                className="text-[13px] font-medium text-indigo-600 cursor-pointer bg-transparent border-none hover:text-indigo-700"
                onClick={() => navigate('/app/guides')}
              >
                View all
              </button>
            </div>
            {filteredGuides.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 px-5 py-8 text-center text-[14px] text-gray-400">
                No guides for this topic.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredGuides.map((g) => {
                const initials = g.name.split(' ').map((n) => n[0]).join('');
                return (
                  <div
                    key={g.id}
                    onClick={() => navigate(`/app/guide/${g.id}`)}
                    className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0"
                        style={{ backgroundColor: g.color }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium text-gray-900 truncate">{g.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[12px] text-gray-500">{g.rating} &middot; {g.sessions} sessions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {g.tags.map((t) => (
                        <span key={t} className="inline-flex h-5 px-2 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
                          {t}
                        </span>
                      ))}
                      {g.licensed && (
                        <span className="inline-flex h-5 px-2 rounded text-[11px] font-medium bg-emerald-50 text-emerald-600">
                          Licensed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column — secondary */}
        <div className="space-y-6">
          {/* Your last guide */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Your last guide</h3>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-semibold shrink-0"
                style={{ backgroundColor: lastGuide.color }}
              >
                {lastGuide.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="text-[14px] font-medium text-gray-900">{lastGuide.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[12px] text-gray-500">{lastGuide.rating} &middot; {lastGuide.sessions} chats</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {lastGuide.tags.map((t) => (
                <span key={t} className="inline-flex h-5 px-2 rounded text-[11px] font-medium bg-gray-100 text-gray-500">{t}</span>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/app/guide/${lastGuide.id}`)}
                className="flex-1 h-8 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
              >
                View
              </button>
              <button className="flex-1 h-8 text-[13px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors flex items-center justify-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Message
              </button>
              <button
                onClick={() => navigate(`/app/guide/${lastGuide.id}`)}
                className="flex-1 h-8 text-[13px] font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors border-none"
              >
                Rebook
              </button>
            </div>
          </div>

          {/* Upcoming sessions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-gray-900">Upcoming sessions</h3>
              <button
                onClick={() => navigate('/app/activity')}
                className="text-[12px] font-medium text-indigo-600 cursor-pointer bg-transparent border-none hover:text-indigo-700"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map((s) => {
                const initials = s.guide.split(' ').map((n) => n[0]).join('');
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-gray-900 truncate">{s.guide}</div>
                      <div className="text-[12px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {s.date}, {s.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                      {s.mode === 'video' ? <Video className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                      {s.mode}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Resources</h3>
            <div className="space-y-1">
              {[
                { label: 'Crisis support lines', desc: 'Immediate help when you need it' },
                { label: 'Self-assessment tools', desc: 'Track your wellbeing over time' },
                { label: 'Saved articles', desc: '3 saved items' },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-[13px] font-medium text-gray-900">{r.label}</div>
                    <div className="text-[12px] text-gray-400">{r.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
