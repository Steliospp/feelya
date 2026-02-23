import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/app.css';

const MOCK_THERAPISTS = {
  1: {
    id: 1, name: 'Dr. Sarah Mitchell', title: 'Clinical Psychologist', accreditation: 'HCPC',
    specialisations: 'Anxiety,Depression,Stress,CBT', languages: 'English', gender: 'Female',
    intro_video_price: 45, intro_audio_price: 45, video_price: 90, audio_price: 90,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Dr. Mitchell is a clinical psychologist with over 15 years of experience helping individuals navigate anxiety, depression, and stress. She uses evidence-based approaches including CBT and mindfulness techniques.',
    about: 'You might be looking to resolve an issue or live more fully but whatever it might be I can offer you the hand of support. I believe that you have everything you need but sometimes you might need space to explore how you might go about it. Our relationship will be like no other. There will be no jargon but rather a felt experience of warmth, compassion, non-judgement and empathy felt between us. I believe that if we can achieve this in our sessions then you will have everything you need to live effectively with what you bring.',
    focus_areas: 'Anxiety | Depression | Stress | CBT | Burnout',
    credentials: 'HCPC Registered | DClinPsy | BSc Psychology | BUPA registered psychotherapist',
    experience: 'I have worked in the NHS for over 15 years across primary and secondary care settings, providing evidence-based therapy for anxiety, depression and stress-related conditions. I have also worked in a large corporate employee assistance programme offering counselling to a range of clients from many backgrounds. This gives me a wealth of experience in both shorter term therapy (6 sessions or less) and longer term complex cases.',
    methodologies: 'We will spend 50 minutes together and you will decide what you wish to bring to the session. During our sessions we will explore what has brought you to therapy. I will listen to you, reflect back what I think I have heard, and highlight emerging patterns. The methodologies I use are: Cognitive Behavioural Therapy (CBT), Mindfulness-Based Approaches, and Evidence-Based Interventions.',
    professional_bodies: 'HCPC,BPS',
    next_available: 'Today, 6:00 PM', rating: 4.9, review_count: 127,
  },
  2: {
    id: 2, name: 'Dr. James Cooper', title: 'Counselling Psychologist', accreditation: 'BACP',
    specialisations: 'Relationships,Trauma,Self-esteem,Grief', languages: 'English', gender: 'Male',
    intro_video_price: 40, intro_audio_price: 40, video_price: 80, audio_price: 80,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Dr. Cooper specialises in relationship difficulties and trauma recovery. With a warm, person-centred approach, he creates a safe space for clients to explore their challenges and build resilience.',
    about: 'I offer a warm and supportive therapeutic space where you can explore the challenges you face. Whether you are struggling with relationship difficulties, recovering from trauma, or working through grief, I am here to walk alongside you on your journey towards healing and growth.',
    focus_areas: 'Relationships | Trauma | Self-esteem | Grief | Loss',
    credentials: 'MBACP (Accred) | PGDip Counselling Psychology | BA Psychology',
    experience: 'I have over 10 years of experience working in both NHS and private practice settings. My work has focused primarily on relationship difficulties, trauma recovery, and bereavement. I have extensive experience with couples therapy and individual counselling for attachment-related issues.',
    methodologies: 'My approach is person-centred at its core, meaning I follow your lead and create a safe, non-judgemental space. I also integrate elements of psychodynamic therapy to help understand how past experiences shape current patterns. Sessions are 50 minutes and we will work at a pace that feels right for you.',
    professional_bodies: 'BACP',
    next_available: 'Tomorrow, 10:00 AM', rating: 4.8, review_count: 98,
  },
  3: {
    id: 3, name: 'Dr. Amara Okafor', title: 'Psychotherapist', accreditation: 'UKCP',
    specialisations: 'Depression,Anxiety,Cultural Identity,LGBTQ+', languages: 'English,French', gender: 'Female',
    intro_video_price: 50, intro_audio_price: 50, video_price: 95, audio_price: 95,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Dr. Okafor brings a culturally sensitive approach to therapy, specialising in identity exploration, depression, and anxiety. She integrates psychodynamic and integrative therapeutic models.',
    about: 'I believe therapy should be a space where all aspects of who you are can be explored without judgement. I bring a culturally sensitive and affirming approach to my practice, recognising that identity, culture, and lived experience are central to mental health and wellbeing.',
    focus_areas: 'Depression | Anxiety | Cultural Identity | LGBTQ+ | Intersectional Therapy',
    credentials: 'MUKCP | MSc Psychotherapy | BA Cultural Studies | Certified EMDR Practitioner',
    experience: 'I have worked in diverse therapeutic settings across London and Paris, bringing a multicultural perspective to my practice. My experience includes working with marginalised communities, LGBTQ+ individuals, and clients navigating complex identity issues. I have a particular interest in how culture and identity intersect with mental health.',
    methodologies: 'I use an integrative approach, drawing from psychodynamic therapy, relational therapy, and culturally responsive frameworks. I may also incorporate EMDR for trauma processing. Our first session will focus on building our therapeutic relationship and understanding what you hope to achieve.',
    professional_bodies: 'UKCP,BACP',
    next_available: 'Today, 8:00 PM', rating: 5.0, review_count: 64,
  },
  4: {
    id: 4, name: 'Dr. Michael Chen', title: 'Clinical Psychologist', accreditation: 'HCPC',
    specialisations: 'OCD,Phobias,Panic Disorder,Anxiety', languages: 'English,Mandarin', gender: 'Male',
    intro_video_price: 45, intro_audio_price: 45, video_price: 85, audio_price: 85,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Dr. Chen is an expert in anxiety disorders, particularly OCD and phobias. He uses exposure therapy and CBT to help clients overcome their fears and regain control of their lives.',
    about: 'I specialise in helping people overcome anxiety disorders that can feel overwhelming and debilitating. Whether it is OCD, phobias, or panic attacks, I use proven therapeutic techniques to help you regain control and live the life you want to lead.',
    focus_areas: 'OCD | Phobias | Panic Disorder | Anxiety | Health Anxiety',
    credentials: 'HCPC Registered | DClinPsy | MSc Clinical Psychology | Certified in ERP',
    experience: 'I have spent over 12 years specialising in anxiety disorders, working in specialist NHS anxiety clinics and in private practice. I have treated hundreds of clients with OCD, phobias, and panic disorder using evidence-based approaches. My special interest is in exposure and response prevention (ERP) for OCD.',
    methodologies: 'My primary approach is Cognitive Behavioural Therapy (CBT) with a strong emphasis on Exposure and Response Prevention (ERP) for OCD. I also use graded exposure therapy for phobias and interoceptive exposure for panic disorder. Treatment is structured, goal-oriented, and collaborative.',
    professional_bodies: 'HCPC,BPS',
    next_available: 'Wed, 2:00 PM', rating: 4.7, review_count: 156,
  },
  5: {
    id: 5, name: 'Emma Richardson', title: 'Integrative Therapist', accreditation: 'BACP',
    specialisations: 'Stress,Work-Life Balance,Burnout,Mindfulness', languages: 'English', gender: 'Female',
    intro_video_price: 35, intro_audio_price: 35, video_price: 70, audio_price: 70,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Emma helps professionals manage stress and burnout through integrative therapy combining CBT, mindfulness, and solution-focused techniques. She understands the pressures of modern work life.',
    about: 'I understand the unique pressures that modern working life brings. Whether you are dealing with burnout, struggling with work-life balance, or simply feeling overwhelmed, I am here to help you find sustainable ways to manage stress and rediscover what matters most to you.',
    focus_areas: 'Stress | Work-Life Balance | Burnout | Mindfulness | Self-Care',
    credentials: 'MBACP (Reg) | Dip. Integrative Counselling | Mindfulness Teacher Training',
    experience: 'I have worked extensively with corporate professionals and those in high-pressure roles. My background includes working in employee assistance programmes and corporate wellbeing services. I understand workplace dynamics and the toll that chronic stress can take on both mental and physical health.',
    methodologies: 'I take an integrative approach, blending CBT techniques with mindfulness practices and solution-focused therapy. This means I tailor my approach to what works best for you. I may use relaxation techniques, cognitive restructuring, or guided mindfulness depending on your needs.',
    professional_bodies: 'BACP',
    next_available: 'Today, 7:30 PM', rating: 4.9, review_count: 89,
  },
  6: {
    id: 6, name: 'Dr. Robert Hayes', title: 'Psychiatrist & Psychotherapist', accreditation: 'HCPC',
    specialisations: 'Depression,Bipolar,PTSD,Complex Trauma', languages: 'English', gender: 'Male',
    intro_video_price: 60, intro_audio_price: 60, video_price: 120, audio_price: 120,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Dr. Hayes is a dual-qualified psychiatrist and psychotherapist with extensive experience in mood disorders and complex trauma. He provides a holistic approach to mental health treatment.',
    about: 'As both a psychiatrist and psychotherapist, I bring a unique perspective to mental health treatment. I understand that complex conditions like PTSD, bipolar disorder, and treatment-resistant depression often require a holistic approach that considers the whole person.',
    focus_areas: 'Depression | Bipolar | PTSD | Complex Trauma | Treatment-Resistant Conditions',
    credentials: 'HCPC Registered | MRCPsych | MBBS | PGDip Psychotherapy | GMC Registered',
    experience: 'I have over 20 years of experience in psychiatry and psychotherapy. My career has spanned NHS inpatient and outpatient services, crisis teams, and specialist trauma clinics. I have particular expertise in complex cases that have not responded to standard treatment approaches.',
    methodologies: 'I offer a holistic approach combining psychotherapy with psychiatric understanding. Depending on your needs, I may use trauma-focused CBT, EMDR, or psychodynamic approaches. For complex cases, I take a phased approach: stabilisation, processing, and integration.',
    professional_bodies: 'HCPC,Royal College of Psychiatrists,GMC',
    next_available: 'Thu, 11:00 AM', rating: 4.8, review_count: 203,
  },
  7: {
    id: 7, name: 'Priya Sharma', title: 'Counsellor', accreditation: 'BACP',
    specialisations: 'Anxiety,Self-esteem,Life Transitions,Young Adults', languages: 'English,Hindi', gender: 'Female',
    intro_video_price: null, intro_audio_price: null, video_price: 65, audio_price: 65,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Priya specialises in helping young adults navigate life transitions, build confidence, and manage anxiety. Her warm, empathetic approach makes clients feel immediately at ease.',
    about: 'I believe everyone deserves to feel heard and supported. I specialise in working with young adults who may be navigating major life changes, building their sense of self, or managing anxiety that feels overwhelming. My approach is warm, genuine, and completely non-judgemental.',
    focus_areas: 'Anxiety | Self-esteem | Life Transitions | Young Adults | Identity',
    credentials: 'MBACP (Reg) | Dip. Person-Centred Counselling | BA Psychology',
    experience: 'I have worked with young adults and university students in both educational settings and private practice. My experience includes supporting clients through career changes, relationship breakdowns, academic pressures, and the challenges of early adulthood. I also have experience working with clients from South Asian backgrounds navigating cultural expectations.',
    methodologies: 'My core approach is person-centred counselling, which means I follow your lead and provide a safe space for you to explore your thoughts and feelings at your own pace. I may also draw on elements of CBT and narrative therapy when helpful.',
    professional_bodies: 'BACP',
    next_available: 'Tomorrow, 3:00 PM', rating: 4.9, review_count: 72,
  },
  8: {
    id: 8, name: 'Dr. William Foster', title: 'Psychoanalyst', accreditation: 'BPS',
    specialisations: 'Personality,Deep-rooted Issues,Childhood Trauma,Identity', languages: 'English', gender: 'Male',
    intro_video_price: 55, intro_audio_price: 55, video_price: 100, audio_price: 100,
    video_duration: 50, audio_duration: 50, intro_duration: 30,
    bio: 'Dr. Foster offers psychoanalytic therapy for those seeking deep understanding of recurring patterns and unresolved childhood experiences. He provides a thoughtful, exploratory therapeutic space.',
    about: 'I offer a space for deep exploration and understanding. If you find yourself repeating the same patterns, struggling with relationships, or feeling that something from your past continues to affect your present, psychoanalytic therapy can help you understand the unconscious forces at play.',
    focus_areas: 'Personality | Deep-rooted Issues | Childhood Trauma | Identity | Recurring Patterns',
    credentials: 'CPsychol (BPS) | Doctorate in Psychoanalytic Psychotherapy | MSc Psychology',
    experience: 'I have over 18 years of experience in psychoanalytic practice, working in the Tavistock and Portman NHS Trust and in private practice. My work focuses on long-term, in-depth therapy for clients seeking to understand deep-rooted patterns and unresolved childhood experiences.',
    methodologies: 'I practise psychoanalytic psychotherapy, which involves exploring unconscious processes, early experiences, and the therapeutic relationship itself as a tool for understanding. Sessions are 50 minutes and I typically recommend meeting weekly to build the therapeutic relationship needed for deep work.',
    professional_bodies: 'BPS,British Psychoanalytic Council',
    next_available: 'Fri, 9:00 AM', rating: 4.6, review_count: 145,
  },
};

export default function TherapistProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try API first, fall back to mock data
    fetch(`/api/therapists/${id}`, { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setTherapist(data); setLoading(false); })
      .catch(() => {
        const mock = MOCK_THERAPISTS[id];
        if (mock) setTherapist(mock);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state__title">Therapist not found</div>
          <p className="empty-state__desc">The therapist you're looking for doesn't exist.</p>
          <button className="btn btn--outline btn--sm" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const specs = therapist.specialisations ? therapist.specialisations.split(',').map(s => s.trim()) : [];
  const langs = therapist.languages ? therapist.languages.split(',').map(l => l.trim()) : [];
  const bodies = therapist.professional_bodies ? therapist.professional_bodies.split(',').map(b => b.trim()) : [];

  return (
    <div className="page">
      <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>

      {/* Header */}
      <div className="tp__header">
        <div className="tp__avatar">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="white"/></svg>
        </div>
        <div className="tp__header-info">
          <h1 className="tp__name">{therapist.name}</h1>
          <p className="tp__title">{therapist.title}</p>
          <div className="tp__header-meta">
            <div className="tp__rating">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l2.2 4.6L15 6.3l-3.5 3.4.8 4.8L8 12.2 3.7 14.5l.8-4.8L1 6.3l4.8-.7z"/></svg>
              <span>{therapist.rating}/5</span>
              <span className="tp__review-count">({therapist.review_count} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tp__grid">
        {/* Left column */}
        <div className="tp__main">
          {/* Languages */}
          {langs.length > 0 && (
            <div className="tp__section">
              <h3 className="tp__section-title">Languages</h3>
              <p className="tp__section-text">{langs.join(', ')}</p>
            </div>
          )}

          {/* Specialisations */}
          {specs.length > 0 && (
            <div className="tp__section">
              <h3 className="tp__section-title">Specialisations</h3>
              <div className="tp__tags">
                {specs.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          )}

          {/* Professional Bodies */}
          {bodies.length > 0 && bodies[0] !== '' && (
            <div className="tp__section">
              <h3 className="tp__section-title">Professional Bodies</h3>
              <div className="tp__tags">
                {bodies.map(b => <span key={b} className="tag">{b}</span>)}
              </div>
            </div>
          )}

          {/* About */}
          {therapist.about && (
            <div className="tp__section">
              <h3 className="tp__section-title">About</h3>
              <p className="tp__section-text">{therapist.about}</p>
            </div>
          )}

          {/* Focus Areas */}
          {therapist.focus_areas && (
            <div className="tp__section">
              <h3 className="tp__section-title">Focus Areas</h3>
              <p className="tp__section-text">{therapist.focus_areas}</p>
            </div>
          )}

          {/* Credentials */}
          {therapist.credentials && (
            <div className="tp__section">
              <h3 className="tp__section-title">Credentials</h3>
              <p className="tp__section-text">{therapist.credentials}</p>
            </div>
          )}

          {/* Experience */}
          {therapist.experience && (
            <div className="tp__section">
              <h3 className="tp__section-title">Experience</h3>
              <p className="tp__section-text">{therapist.experience}</p>
            </div>
          )}

          {/* Methodologies */}
          {therapist.methodologies && (
            <div className="tp__section">
              <h3 className="tp__section-title">Methodologies</h3>
              <p className="tp__section-text">{therapist.methodologies}</p>
            </div>
          )}
        </div>

        {/* Right column - Pricing */}
        <div className="tp__sidebar-card">
          <h3 className="tp__section-title">Session Pricing</h3>
          <div className="tp__pricing">
            {therapist.intro_video_price && (
              <div className="tp__price-row">
                <span>Introductory Video</span>
                <strong>&pound;{therapist.intro_video_price}/{therapist.intro_duration}min</strong>
              </div>
            )}
            {therapist.intro_audio_price && (
              <div className="tp__price-row">
                <span>Introductory Audio</span>
                <strong>&pound;{therapist.intro_audio_price}/{therapist.intro_duration}min</strong>
              </div>
            )}
            <div className="tp__price-row">
              <span>Video Session</span>
              <strong>&pound;{therapist.video_price}/{therapist.video_duration}min</strong>
            </div>
            <div className="tp__price-row">
              <span>Audio Session</span>
              <strong>&pound;{therapist.audio_price}/{therapist.audio_duration}min</strong>
            </div>
          </div>
          {therapist.next_available && (
            <div className="tp__availability">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="var(--success)" strokeWidth="1.5"/><path d="M8 5v3l2 1.5" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>Next available: {therapist.next_available}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
