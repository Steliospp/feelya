const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'feelya-secret-key-change-in-production';

// --- Database Setup ---
const db = new Database(path.join(__dirname, 'feelya.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS organisations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size TEXT DEFAULT '',
    plan TEXT DEFAULT 'starter',
    invite_code TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT DEFAULT '',
    description TEXT DEFAULT '',
    avatar_color TEXT DEFAULT '#6366f1',
    role TEXT DEFAULT 'employee',
    job_title TEXT DEFAULT '',
    org_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organisations(id)
  );

  CREATE TABLE IF NOT EXISTS therapists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    accreditation TEXT NOT NULL,
    photo TEXT DEFAULT '',
    specialisations TEXT NOT NULL,
    languages TEXT DEFAULT 'English',
    gender TEXT DEFAULT '',
    intro_video_price REAL,
    intro_audio_price REAL,
    video_price REAL NOT NULL,
    audio_price REAL NOT NULL,
    video_duration INTEGER DEFAULT 50,
    audio_duration INTEGER DEFAULT 50,
    intro_duration INTEGER DEFAULT 30,
    bio TEXT DEFAULT '',
    about TEXT DEFAULT '',
    focus_areas TEXT DEFAULT '',
    credentials TEXT DEFAULT '',
    experience TEXT DEFAULT '',
    methodologies TEXT DEFAULT '',
    professional_bodies TEXT DEFAULT '',
    next_available TEXT DEFAULT '',
    rating REAL DEFAULT 4.8,
    review_count INTEGER DEFAULT 0,
    session_type TEXT DEFAULT 'both',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    therapist_id INTEGER NOT NULL,
    session_type TEXT NOT NULL,
    session_format TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price REAL NOT NULL,
    status TEXT DEFAULT 'upcoming',
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (therapist_id) REFERENCES therapists(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS self_test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    answers TEXT NOT NULL,
    result_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// --- Migrate: add new profile columns if missing ---
try {
  const cols = db.prepare("PRAGMA table_info(therapists)").all().map(c => c.name);
  const newCols = [
    ['about', 'TEXT DEFAULT ""'],
    ['focus_areas', 'TEXT DEFAULT ""'],
    ['credentials', 'TEXT DEFAULT ""'],
    ['experience', 'TEXT DEFAULT ""'],
    ['methodologies', 'TEXT DEFAULT ""'],
    ['professional_bodies', 'TEXT DEFAULT ""'],
  ];
  for (const [col, def] of newCols) {
    if (!cols.includes(col)) {
      db.exec(`ALTER TABLE therapists ADD COLUMN ${col} ${def}`);
    }
  }
} catch (e) { /* columns already exist */ }

// --- Seed Therapists ---
const therapistCount = db.prepare('SELECT COUNT(*) as count FROM therapists').get();
if (therapistCount.count === 0) {
  const insertTherapist = db.prepare(`
    INSERT INTO therapists (name, title, accreditation, specialisations, languages, gender, intro_video_price, intro_audio_price, video_price, audio_price, video_duration, audio_duration, intro_duration, bio, about, focus_areas, credentials, experience, methodologies, professional_bodies, next_available, rating, review_count, session_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const therapists = [
    ['Dr. Sarah Mitchell', 'Clinical Psychologist', 'HCPC', 'Anxiety,Depression,Stress,CBT', 'English', 'Female', 45, 45, 90, 90, 50, 50, 30,
      'Dr. Mitchell is a clinical psychologist with over 15 years of experience helping individuals navigate anxiety, depression, and stress. She uses evidence-based approaches including CBT and mindfulness techniques.',
      'You might be looking to resolve an issue or live more fully but whatever it might be I can offer you the hand of support. I believe that you have everything you need but sometimes you might need space to explore how you might go about it. Our relationship will be like no other. There will be no jargon but rather a felt experience of warmth, compassion, non-judgement and empathy felt between us. I believe that if we can achieve this in our sessions then you will have everything you need to live effectively with what you bring.',
      'Anxiety | Depression | Stress | CBT | Burnout',
      'HCPC Registered | DClinPsy | BSc Psychology | BUPA registered psychotherapist',
      'I have worked in the NHS for over 15 years across primary and secondary care settings, providing evidence-based therapy for anxiety, depression and stress-related conditions. I have also worked in a large corporate employee assistance programme offering counselling to a range of clients from many backgrounds. This gives me a wealth of experience in both shorter term therapy (6 sessions or less) and longer term complex cases.',
      'We will spend 50 minutes together and you will decide what you wish to bring to the session. During our sessions we will explore what has brought you to therapy. I will listen to you, reflect back what I think I have heard, and highlight emerging patterns. The methodologies I use are: Cognitive Behavioural Therapy (CBT), Mindfulness-Based Approaches, and Evidence-Based Interventions.',
      'HCPC,BPS',
      'Today, 6:00 PM', 4.9, 127, 'both'],
    ['Dr. James Cooper', 'Counselling Psychologist', 'BACP', 'Relationships,Trauma,Self-esteem,Grief', 'English', 'Male', 40, 40, 80, 80, 50, 50, 30,
      'Dr. Cooper specialises in relationship difficulties and trauma recovery. With a warm, person-centred approach, he creates a safe space for clients to explore their challenges and build resilience.',
      'I offer a warm and supportive therapeutic space where you can explore the challenges you face. Whether you are struggling with relationship difficulties, recovering from trauma, or working through grief, I am here to walk alongside you on your journey towards healing and growth.',
      'Relationships | Trauma | Self-esteem | Grief | Loss',
      'MBACP (Accred) | PGDip Counselling Psychology | BA Psychology',
      'I have over 10 years of experience working in both NHS and private practice settings. My work has focused primarily on relationship difficulties, trauma recovery, and bereavement. I have extensive experience with couples therapy and individual counselling for attachment-related issues.',
      'My approach is person-centred at its core, meaning I follow your lead and create a safe, non-judgemental space. I also integrate elements of psychodynamic therapy to help understand how past experiences shape current patterns. Sessions are 50 minutes and we will work at a pace that feels right for you.',
      'BACP',
      'Tomorrow, 10:00 AM', 4.8, 98, 'both'],
    ['Dr. Amara Okafor', 'Psychotherapist', 'UKCP', 'Depression,Anxiety,Cultural Identity,LGBTQ+', 'English,French', 'Female', 50, 50, 95, 95, 50, 50, 30,
      'Dr. Okafor brings a culturally sensitive approach to therapy, specialising in identity exploration, depression, and anxiety. She integrates psychodynamic and integrative therapeutic models.',
      'I believe therapy should be a space where all aspects of who you are can be explored without judgement. I bring a culturally sensitive and affirming approach to my practice, recognising that identity, culture, and lived experience are central to mental health and wellbeing.',
      'Depression | Anxiety | Cultural Identity | LGBTQ+ | Intersectional Therapy',
      'MUKCP | MSc Psychotherapy | BA Cultural Studies | Certified EMDR Practitioner',
      'I have worked in diverse therapeutic settings across London and Paris, bringing a multicultural perspective to my practice. My experience includes working with marginalised communities, LGBTQ+ individuals, and clients navigating complex identity issues. I have a particular interest in how culture and identity intersect with mental health.',
      'I use an integrative approach, drawing from psychodynamic therapy, relational therapy, and culturally responsive frameworks. I may also incorporate EMDR for trauma processing. Our first session will focus on building our therapeutic relationship and understanding what you hope to achieve.',
      'UKCP,BACP',
      'Today, 8:00 PM', 5.0, 64, 'both'],
    ['Dr. Michael Chen', 'Clinical Psychologist', 'HCPC', 'OCD,Phobias,Panic Disorder,Anxiety', 'English,Mandarin', 'Male', 45, 45, 85, 85, 50, 50, 30,
      'Dr. Chen is an expert in anxiety disorders, particularly OCD and phobias. He uses exposure therapy and CBT to help clients overcome their fears and regain control of their lives.',
      'I specialise in helping people overcome anxiety disorders that can feel overwhelming and debilitating. Whether it is OCD, phobias, or panic attacks, I use proven therapeutic techniques to help you regain control and live the life you want to lead.',
      'OCD | Phobias | Panic Disorder | Anxiety | Health Anxiety',
      'HCPC Registered | DClinPsy | MSc Clinical Psychology | Certified in ERP',
      'I have spent over 12 years specialising in anxiety disorders, working in specialist NHS anxiety clinics and in private practice. I have treated hundreds of clients with OCD, phobias, and panic disorder using evidence-based approaches. My special interest is in exposure and response prevention (ERP) for OCD.',
      'My primary approach is Cognitive Behavioural Therapy (CBT) with a strong emphasis on Exposure and Response Prevention (ERP) for OCD. I also use graded exposure therapy for phobias and interoceptive exposure for panic disorder. Treatment is structured, goal-oriented, and collaborative.',
      'HCPC,BPS',
      'Wed, 2:00 PM', 4.7, 156, 'both'],
    ['Emma Richardson', 'Integrative Therapist', 'BACP', 'Stress,Work-Life Balance,Burnout,Mindfulness', 'English', 'Female', 35, 35, 70, 70, 50, 50, 30,
      'Emma helps professionals manage stress and burnout through integrative therapy combining CBT, mindfulness, and solution-focused techniques. She understands the pressures of modern work life.',
      'I understand the unique pressures that modern working life brings. Whether you are dealing with burnout, struggling with work-life balance, or simply feeling overwhelmed, I am here to help you find sustainable ways to manage stress and rediscover what matters most to you.',
      'Stress | Work-Life Balance | Burnout | Mindfulness | Self-Care',
      'MBACP (Reg) | Dip. Integrative Counselling | Mindfulness Teacher Training',
      'I have worked extensively with corporate professionals and those in high-pressure roles. My background includes working in employee assistance programmes and corporate wellbeing services. I understand workplace dynamics and the toll that chronic stress can take on both mental and physical health.',
      'I take an integrative approach, blending CBT techniques with mindfulness practices and solution-focused therapy. This means I tailor my approach to what works best for you. I may use relaxation techniques, cognitive restructuring, or guided mindfulness depending on your needs.',
      'BACP',
      'Today, 7:30 PM', 4.9, 89, 'both'],
    ['Dr. Robert Hayes', 'Psychiatrist & Psychotherapist', 'HCPC', 'Depression,Bipolar,PTSD,Complex Trauma', 'English', 'Male', 60, 60, 120, 120, 50, 50, 30,
      'Dr. Hayes is a dual-qualified psychiatrist and psychotherapist with extensive experience in mood disorders and complex trauma. He provides a holistic approach to mental health treatment.',
      'As both a psychiatrist and psychotherapist, I bring a unique perspective to mental health treatment. I understand that complex conditions like PTSD, bipolar disorder, and treatment-resistant depression often require a holistic approach that considers the whole person.',
      'Depression | Bipolar | PTSD | Complex Trauma | Treatment-Resistant Conditions',
      'HCPC Registered | MRCPsych | MBBS | PGDip Psychotherapy | GMC Registered',
      'I have over 20 years of experience in psychiatry and psychotherapy. My career has spanned NHS inpatient and outpatient services, crisis teams, and specialist trauma clinics. I have particular expertise in complex cases that have not responded to standard treatment approaches.',
      'I offer a holistic approach combining psychotherapy with psychiatric understanding. Depending on your needs, I may use trauma-focused CBT, EMDR, or psychodynamic approaches. For complex cases, I take a phased approach: stabilisation, processing, and integration.',
      'HCPC,Royal College of Psychiatrists,GMC',
      'Thu, 11:00 AM', 4.8, 203, 'both'],
    ['Priya Sharma', 'Counsellor', 'BACP', 'Anxiety,Self-esteem,Life Transitions,Young Adults', 'English,Hindi', 'Female', null, null, 65, 65, 50, 50, 30,
      'Priya specialises in helping young adults navigate life transitions, build confidence, and manage anxiety. Her warm, empathetic approach makes clients feel immediately at ease.',
      'I believe everyone deserves to feel heard and supported. I specialise in working with young adults who may be navigating major life changes, building their sense of self, or managing anxiety that feels overwhelming. My approach is warm, genuine, and completely non-judgemental.',
      'Anxiety | Self-esteem | Life Transitions | Young Adults | Identity',
      'MBACP (Reg) | Dip. Person-Centred Counselling | BA Psychology',
      'I have worked with young adults and university students in both educational settings and private practice. My experience includes supporting clients through career changes, relationship breakdowns, academic pressures, and the challenges of early adulthood. I also have experience working with clients from South Asian backgrounds navigating cultural expectations.',
      'My core approach is person-centred counselling, which means I follow your lead and provide a safe space for you to explore your thoughts and feelings at your own pace. I may also draw on elements of CBT and narrative therapy when helpful.',
      'BACP',
      'Tomorrow, 3:00 PM', 4.9, 72, 'both'],
    ['Dr. William Foster', 'Psychoanalyst', 'BPS', 'Personality,Deep-rooted Issues,Childhood Trauma,Identity', 'English', 'Male', 55, 55, 100, 100, 50, 50, 30,
      'Dr. Foster offers psychoanalytic therapy for those seeking deep understanding of recurring patterns and unresolved childhood experiences. He provides a thoughtful, exploratory therapeutic space.',
      'I offer a space for deep exploration and understanding. If you find yourself repeating the same patterns, struggling with relationships, or feeling that something from your past continues to affect your present, psychoanalytic therapy can help you understand the unconscious forces at play.',
      'Personality | Deep-rooted Issues | Childhood Trauma | Identity | Recurring Patterns',
      'CPsychol (BPS) | Doctorate in Psychoanalytic Psychotherapy | MSc Psychology',
      'I have over 18 years of experience in psychoanalytic practice, working in the Tavistock and Portman NHS Trust and in private practice. My work focuses on long-term, in-depth therapy for clients seeking to understand deep-rooted patterns and unresolved childhood experiences.',
      'I practise psychoanalytic psychotherapy, which involves exploring unconscious processes, early experiences, and the therapeutic relationship itself as a tool for understanding. Sessions are 50 minutes and I typically recommend meeting weekly to build the therapeutic relationship needed for deep work.',
      'BPS,British Psychoanalytic Council',
      'Fri, 9:00 AM', 4.6, 145, 'both']
  ];

  for (const t of therapists) {
    insertTherapist.run(...t);
  }
}

// --- Seed Demo Users ---
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  const demoPassword = bcrypt.hashSync('password', 12);

  // Create demo organisation
  const orgResult = db.prepare(
    'INSERT INTO organisations (name, size, invite_code) VALUES (?, ?, ?)'
  ).run('Acme Corp', '50-200', 'DEMO1234');
  const orgId = orgResult.lastInsertRowid;

  // Employee
  db.prepare(
    'INSERT INTO users (first_name, last_name, email, password, avatar_color, role, job_title, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run('Alex', 'Johnson', 'employee@demo.com', demoPassword, '#6366f1', 'employee', 'Software Engineer', orgId);

  // HR Admin
  db.prepare(
    'INSERT INTO users (first_name, last_name, email, password, avatar_color, role, job_title, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run('Sarah', 'Williams', 'hr@demo.com', demoPassword, '#ec4899', 'admin', 'HR Director', orgId);

  // Super Admin
  db.prepare(
    'INSERT INTO users (first_name, last_name, email, password, avatar_color, role, job_title, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run('Admin', 'User', 'admin@feelya.com', demoPassword, '#14b8a6', 'superadmin', 'Platform Admin', null);

  // Therapist
  db.prepare(
    'INSERT INTO users (first_name, last_name, email, password, avatar_color, role, job_title, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run('Dr. Sarah', 'Mitchell', 'therapist@demo.com', demoPassword, '#8b5cf6', 'therapist', 'Clinical Psychologist', null);
}

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
// Serve React build output
app.use(express.static(path.join(__dirname, 'dist')));

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Helper: Generate invite code ---
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// --- Auth Routes ---
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password, companyName, companySize, role } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const hash = bcrypt.hashSync(password, 12);
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  let orgId = null;
  let userRole = 'employee';

  // If company name is provided, create an organisation and make user admin
  if (companyName) {
    const inviteCode = generateInviteCode();
    const orgResult = db.prepare(
      'INSERT INTO organisations (name, size, invite_code) VALUES (?, ?, ?)'
    ).run(companyName, companySize || '', inviteCode);
    orgId = orgResult.lastInsertRowid;
    userRole = 'admin';
  }

  const result = db.prepare(
    'INSERT INTO users (first_name, last_name, email, password, avatar_color, role, job_title, org_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(firstName, lastName, email, hash, color, userRole, role || '', orgId);

  // Welcome notification
  const welcomeMsg = orgId
    ? `Welcome to Feelya! Your organisation "${companyName}" is set up and ready. Share your invite link to onboard your team.`
    : 'Welcome to Feelya! Your account has been created. Start by finding a therapist that suits your needs.';

  db.prepare(
    'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)'
  ).run(result.lastInsertRowid, 'Welcome to Feelya!', welcomeMsg, 'success');

  const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, token });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, token });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// --- Join Org via Invite Code ---
app.post('/api/join-org', authMiddleware, (req, res) => {
  const { inviteCode } = req.body;
  if (!inviteCode) return res.status(400).json({ error: 'Invite code is required' });

  const org = db.prepare('SELECT * FROM organisations WHERE invite_code = ?').get(inviteCode.toUpperCase());
  if (!org) return res.status(404).json({ error: 'Invalid invite code' });

  db.prepare('UPDATE users SET org_id = ?, role = ? WHERE id = ?').run(org.id, 'employee', req.user.id);

  db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
    .run(req.user.id, 'Organisation Joined', `You've joined ${org.name}. You now have access to your company's wellbeing programme.`, 'success');

  res.json({ success: true, orgName: org.name });
});

// --- User Routes ---
app.get('/api/me', authMiddleware, (req, res) => {
  const user = db.prepare(`
    SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.description, u.avatar_color, u.role, u.job_title, u.org_id, u.created_at,
           o.name as org_name, o.size as org_size, o.plan as org_plan, o.invite_code as org_invite_code
    FROM users u
    LEFT JOIN organisations o ON u.org_id = o.id
    WHERE u.id = ?
  `).get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.put('/api/me', authMiddleware, (req, res) => {
  const { firstName, lastName, phone, description } = req.body;
  db.prepare('UPDATE users SET first_name = ?, last_name = ?, phone = ?, description = ? WHERE id = ?')
    .run(firstName, lastName, phone || '', description || '', req.user.id);
  res.json({ success: true });
});

app.put('/api/me/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  const hash = bcrypt.hashSync(newPassword, 12);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, req.user.id);
  res.json({ success: true });
});

// --- Organisation / Admin Routes ---
app.get('/api/org/dashboard', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT org_id, role FROM users WHERE id = ?').get(req.user.id);
  if (!user || !user.org_id || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const org = db.prepare('SELECT * FROM organisations WHERE id = ?').get(user.org_id);
  const totalEmployees = db.prepare('SELECT COUNT(*) as count FROM users WHERE org_id = ?').get(user.org_id);
  const activeEmployees = db.prepare(`
    SELECT COUNT(DISTINCT user_id) as count FROM sessions
    WHERE user_id IN (SELECT id FROM users WHERE org_id = ?)
  `).get(user.org_id);

  const totalSessions = db.prepare(`
    SELECT COUNT(*) as count FROM sessions
    WHERE user_id IN (SELECT id FROM users WHERE org_id = ?)
  `).get(user.org_id);

  const completedSessions = db.prepare(`
    SELECT COUNT(*) as count FROM sessions
    WHERE user_id IN (SELECT id FROM users WHERE org_id = ?) AND status = 'completed'
  `).get(user.org_id);

  const upcomingSessions = db.prepare(`
    SELECT COUNT(*) as count FROM sessions
    WHERE user_id IN (SELECT id FROM users WHERE org_id = ?) AND status = 'upcoming'
  `).get(user.org_id);

  // Avg wellbeing from self-test scores
  const avgWellbeing = db.prepare(`
    SELECT AVG(40 - score) * 2.5 as avg_score FROM self_test_results
    WHERE user_id IN (SELECT id FROM users WHERE org_id = ?)
  `).get(user.org_id);

  // Top specialisations used
  const sessionsWithSpecs = db.prepare(`
    SELECT t.specialisations FROM sessions s
    JOIN therapists t ON s.therapist_id = t.id
    WHERE s.user_id IN (SELECT id FROM users WHERE org_id = ?)
  `).all(user.org_id);

  const specCounts = {};
  sessionsWithSpecs.forEach(s => {
    s.specialisations.split(',').forEach(spec => {
      const trimmed = spec.trim();
      specCounts[trimmed] = (specCounts[trimmed] || 0) + 1;
    });
  });
  const topSpecs = Object.entries(specCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(s => s[0]);

  // Recent team activity (anonymised)
  const recentActivity = db.prepare(`
    SELECT s.session_format, s.date, s.time, s.status, t.name as therapist_name, t.specialisations
    FROM sessions s
    JOIN therapists t ON s.therapist_id = t.id
    WHERE s.user_id IN (SELECT id FROM users WHERE org_id = ?)
    ORDER BY s.created_at DESC LIMIT 10
  `).all(user.org_id);

  const engagementRate = totalEmployees.count > 0
    ? Math.round((activeEmployees.count / totalEmployees.count) * 100)
    : 0;

  res.json({
    org,
    totalEmployees: totalEmployees.count,
    activeEmployees: activeEmployees.count,
    engagementRate,
    totalSessions: totalSessions.count,
    completedSessions: completedSessions.count,
    upcomingSessions: upcomingSessions.count,
    avgWellbeing: Math.round(avgWellbeing.avg_score || 72),
    topSpecialisations: topSpecs.length > 0 ? topSpecs : ['Anxiety', 'Stress', 'Burnout'],
    recentActivity
  });
});

app.get('/api/org/team', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT org_id, role FROM users WHERE id = ?').get(req.user.id);
  if (!user || !user.org_id || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Return anonymised team data — names and emails but NOT session details
  const team = db.prepare(`
    SELECT id, first_name, last_name, email, role, job_title, avatar_color, created_at
    FROM users WHERE org_id = ?
    ORDER BY created_at ASC
  `).all(user.org_id);

  res.json(team);
});

app.put('/api/org/team/:id/role', authMiddleware, (req, res) => {
  const admin = db.prepare('SELECT org_id, role FROM users WHERE id = ?').get(req.user.id);
  if (!admin || admin.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const targetUser = db.prepare('SELECT * FROM users WHERE id = ? AND org_id = ?').get(req.params.id, admin.org_id);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  const { role } = req.body;
  if (!['admin', 'employee'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ success: true });
});

// --- Therapist Routes ---
app.get('/api/therapists', authMiddleware, (req, res) => {
  const { specialisation, gender, language, sessionType, maxPrice } = req.query;
  let query = 'SELECT * FROM therapists WHERE 1=1';
  const params = [];

  if (specialisation) {
    query += ' AND specialisations LIKE ?';
    params.push(`%${specialisation}%`);
  }
  if (gender) {
    query += ' AND gender = ?';
    params.push(gender);
  }
  if (language) {
    query += ' AND languages LIKE ?';
    params.push(`%${language}%`);
  }
  if (sessionType === 'video') {
    query += ' AND (session_type = "video" OR session_type = "both")';
  } else if (sessionType === 'audio') {
    query += ' AND (session_type = "audio" OR session_type = "both")';
  }
  if (maxPrice) {
    query += ' AND video_price <= ?';
    params.push(Number(maxPrice));
  }

  query += ' ORDER BY rating DESC';
  const therapists = db.prepare(query).all(...params);
  res.json(therapists);
});

app.get('/api/therapists/:id', authMiddleware, (req, res) => {
  const therapist = db.prepare('SELECT * FROM therapists WHERE id = ?').get(req.params.id);
  if (!therapist) return res.status(404).json({ error: 'Therapist not found' });
  res.json(therapist);
});

// --- Session Routes ---
app.get('/api/sessions', authMiddleware, (req, res) => {
  const sessions = db.prepare(`
    SELECT s.*, t.name as therapist_name, t.title as therapist_title, t.accreditation as therapist_accreditation, t.specialisations as therapist_specialisations
    FROM sessions s
    JOIN therapists t ON s.therapist_id = t.id
    WHERE s.user_id = ?
    ORDER BY s.date DESC, s.time DESC
  `).all(req.user.id);
  res.json(sessions);
});

app.post('/api/sessions', authMiddleware, (req, res) => {
  const { therapistId, sessionType, sessionFormat, date, time, duration, price } = req.body;
  const result = db.prepare(
    'INSERT INTO sessions (user_id, therapist_id, session_type, session_format, date, time, duration, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, therapistId, sessionType, sessionFormat, date, time, duration, price);

  const therapist = db.prepare('SELECT name FROM therapists WHERE id = ?').get(therapistId);
  db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
    .run(req.user.id, 'Session Booked', `Your ${sessionFormat} session with ${therapist.name} on ${date} at ${time} has been confirmed.`, 'success');

  res.json({ success: true, id: result.lastInsertRowid });
});

app.put('/api/sessions/:id/cancel', authMiddleware, (req, res) => {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  db.prepare('UPDATE sessions SET status = ? WHERE id = ?').run('cancelled', req.params.id);

  const therapist = db.prepare('SELECT name FROM therapists WHERE id = ?').get(session.therapist_id);
  db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
    .run(req.user.id, 'Session Cancelled', `Your session with ${therapist.name} on ${session.date} has been cancelled.`, 'warning');

  res.json({ success: true });
});

// --- Notification Routes ---
app.get('/api/notifications', authMiddleware, (req, res) => {
  const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.user.id);
  res.json(notifications);
});

app.put('/api/notifications/:id/read', authMiddleware, (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

app.put('/api/notifications/read-all', authMiddleware, (req, res) => {
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

// --- Self-Test Routes ---
app.post('/api/self-test', authMiddleware, (req, res) => {
  const { answers, score, resultText } = req.body;
  db.prepare('INSERT INTO self_test_results (user_id, score, answers, result_text) VALUES (?, ?, ?, ?)')
    .run(req.user.id, score, JSON.stringify(answers), resultText);

  db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
    .run(req.user.id, 'Self-Test Completed', `You scored ${score}/40. ${resultText}`, 'info');

  res.json({ success: true, score, resultText });
});

app.get('/api/self-test/history', authMiddleware, (req, res) => {
  const results = db.prepare('SELECT * FROM self_test_results WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(results);
});

// --- Dashboard Stats ---
app.get('/api/dashboard', authMiddleware, (req, res) => {
  const upcomingSessions = db.prepare("SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND status = 'upcoming'").get(req.user.id);
  const completedSessions = db.prepare("SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND status = 'completed'").get(req.user.id);
  const unreadNotifications = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0').get(req.user.id);

  const nextSession = db.prepare(`
    SELECT s.*, t.name as therapist_name, t.title as therapist_title
    FROM sessions s JOIN therapists t ON s.therapist_id = t.id
    WHERE s.user_id = ? AND s.status = 'upcoming'
    ORDER BY s.date ASC, s.time ASC LIMIT 1
  `).get(req.user.id);

  const recentNotifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(req.user.id);

  // Total sessions across all org employees (for B2B dashboard)
  const user = db.prepare('SELECT org_id, role FROM users WHERE id = ?').get(req.user.id);
  let totalEmployeeSessions = 0;
  let sessionBudgetUsed = 0;
  if (user && user.org_id) {
    const empSessions = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(SUM(price), 0) as total_cost FROM sessions
      WHERE user_id IN (SELECT id FROM users WHERE org_id = ?)
    `).get(user.org_id);
    totalEmployeeSessions = empSessions.count;
    sessionBudgetUsed = empSessions.total_cost;
  }

  res.json({
    upcomingSessions: upcomingSessions.count,
    completedSessions: completedSessions.count,
    unreadNotifications: unreadNotifications.count,
    totalEmployeeSessions,
    sessionBudgetUsed,
    nextSession,
    recentNotifications
  });
});

// --- SPA Fallback: all non-API routes serve React index.html ---
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Feelya server running at http://localhost:${PORT}`);
});
