/**
 * Shared workshop store (localStorage-backed).
 * Status flow: pending_review → needs_changes → pending_review → approved → published → scheduled → completed
 */

const STORAGE_KEY = 'feelya_workshop_requests';

// Seed data covering every status so each portal has something to show
const SEED = [
  {
    id: 'ws-1',
    companyId: 'comp-1',
    companyName: 'Acme Corp',
    title: 'Managing Stress at Work',
    description: 'Learn practical strategies to manage workplace stress, set healthy boundaries, and prevent burnout.',
    category: 'Stress',
    date: '2026-03-10',
    time: '12:00',
    duration: 60,
    capacity: 20,
    status: 'scheduled',
    createdBy: { id: 'hr-1', name: 'Sam Rivera' },
    therapist: { id: 'th-1', name: 'Dr. Sarah Mitchell' },
    attendees: [],
    comments: [],
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'ws-2',
    companyId: 'comp-1',
    companyName: 'Acme Corp',
    title: 'Building Resilience',
    description: 'Develop mental resilience and learn how to bounce back from setbacks with evidence-based techniques.',
    category: 'Wellbeing',
    date: '2026-03-14',
    time: '13:00',
    duration: 45,
    capacity: 25,
    status: 'scheduled',
    createdBy: { id: 'hr-1', name: 'Sam Rivera' },
    therapist: { id: 'th-1', name: 'Dr. Sarah Mitchell' },
    attendees: [],
    comments: [],
    createdAt: '2026-02-03T09:00:00Z',
  },
  {
    id: 'ws-3',
    companyId: 'comp-1',
    companyName: 'Acme Corp',
    title: 'Mindfulness in the Workplace',
    description: 'An introduction to mindfulness practices you can use at your desk to improve focus and reduce anxiety.',
    category: 'Mindfulness',
    date: '2026-03-20',
    time: '11:00',
    duration: 30,
    capacity: 30,
    status: 'published',
    createdBy: { id: 'hr-1', name: 'Sam Rivera' },
    therapist: null,
    attendees: [],
    comments: [],
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'ws-4',
    companyId: 'comp-1',
    companyName: 'Acme Corp',
    title: 'Understanding Anxiety',
    description: 'Explore the mechanisms of anxiety and learn practical CBT-based tools to manage anxious thoughts.',
    category: 'Anxiety',
    date: '2026-03-25',
    time: '14:00',
    duration: 60,
    capacity: 20,
    status: 'approved',
    createdBy: { id: 'hr-1', name: 'Sam Rivera' },
    therapist: null,
    attendees: [],
    comments: [{ by: 'Jordan Lee', role: 'SUPER_ADMIN', text: 'Looks great — approved.', at: '2026-02-15T10:00:00Z' }],
    createdAt: '2026-02-12T11:00:00Z',
  },
  {
    id: 'ws-5',
    companyId: 'comp-1',
    companyName: 'Acme Corp',
    title: 'Healthy Sleep Habits',
    description: 'Understand the connection between sleep and mental health, and build better evening routines.',
    category: 'Wellbeing',
    date: '2026-04-02',
    time: '12:30',
    duration: 45,
    capacity: 25,
    status: 'pending_review',
    createdBy: { id: 'hr-1', name: 'Sam Rivera' },
    therapist: null,
    attendees: [],
    comments: [],
    createdAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 'ws-6',
    companyId: 'comp-1',
    companyName: 'Acme Corp',
    title: 'Communication Skills for Teams',
    description: 'Improve your professional relationships with assertive communication techniques and conflict resolution.',
    category: 'Relationships',
    date: '2026-04-08',
    time: '10:00',
    duration: 60,
    capacity: 20,
    status: 'needs_changes',
    createdBy: { id: 'hr-1', name: 'Sam Rivera' },
    therapist: null,
    attendees: [],
    comments: [{ by: 'Jordan Lee', role: 'SUPER_ADMIN', text: 'Please add more detail on the intended audience and outcomes.', at: '2026-02-22T16:00:00Z' }],
    createdAt: '2026-02-18T10:00:00Z',
  },
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function save(workshops) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workshops));
}

export function getWorkshops() {
  let ws = load();
  if (!ws) {
    ws = SEED;
    save(ws);
  }
  return ws;
}

export function getWorkshopById(id) {
  return getWorkshops().find(w => w.id === id) || null;
}

export function updateWorkshop(id, updates) {
  const ws = getWorkshops().map(w => w.id === id ? { ...w, ...updates } : w);
  save(ws);
  return ws;
}

export function addWorkshop(workshop) {
  const ws = getWorkshops();
  ws.push(workshop);
  save(ws);
  return ws;
}

// Convenience: generate unique ID
export function newId() {
  return 'ws-' + Date.now().toString(36);
}
