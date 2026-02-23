import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const ASSESSMENTS = [
  {
    id: 'phq9',
    title: 'PHQ-9 Depression Screening',
    description: 'A validated 9-question tool used worldwide to screen for depression and monitor severity.',
    duration: '3 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
        <circle cx="15" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
    preamble: 'Over the last 2 weeks, how often have you been bothered by:',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself \u2014 or that you are a failure or have let yourself or your family down',
      'Trouble concentrating on things, such as reading or watching TV',
      'Moving or speaking so slowly that others could have noticed \u2014 or being fidgety or restless',
      'Thoughts that you would be better off dead, or of hurting yourself in some way',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
    scoring: [
      { min: 0, max: 4, level: 'Minimal', color: 'var(--success)', description: 'Your responses suggest minimal symptoms. Continue taking care of your wellbeing.' },
      { min: 5, max: 9, level: 'Mild', color: '#f59e0b', description: 'Your responses suggest mild symptoms. Consider speaking with a therapist to develop coping strategies.' },
      { min: 10, max: 14, level: 'Moderate', color: '#f97316', description: 'Your responses suggest moderate symptoms. We recommend booking a session with one of our therapists.' },
      { min: 15, max: 19, level: 'Moderately Severe', color: 'var(--danger)', description: 'Your responses suggest moderately severe symptoms. We strongly recommend reaching out to a therapist for support.' },
      { min: 20, max: 27, level: 'Severe', color: 'var(--danger)', description: 'Your responses suggest severe symptoms. Please consider booking a session as soon as possible. If you are in crisis, contact your local emergency services.' },
    ],
  },
  {
    id: 'gad7',
    title: 'GAD-7 Anxiety Screening',
    description: 'A validated 7-question tool to screen for generalised anxiety disorder and gauge severity.',
    duration: '2 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    preamble: 'Over the last 2 weeks, how often have you been bothered by:',
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
    scoring: [
      { min: 0, max: 4, level: 'Minimal', color: 'var(--success)', description: 'Your responses suggest minimal anxiety. Keep up the good work looking after your mental health.' },
      { min: 5, max: 9, level: 'Mild', color: '#f59e0b', description: 'Your responses suggest mild anxiety. Consider exploring our resources or speaking with a therapist.' },
      { min: 10, max: 14, level: 'Moderate', color: '#f97316', description: 'Your responses suggest moderate anxiety. We recommend booking a session with a therapist for personalised support.' },
      { min: 15, max: 21, level: 'Severe', color: 'var(--danger)', description: 'Your responses suggest severe anxiety. Please consider booking a session as soon as possible for professional support.' },
    ],
  },
  {
    id: 'burnout',
    title: 'Workplace Burnout Check',
    description: 'A quick assessment to help you understand if you may be experiencing signs of workplace burnout.',
    duration: '3 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    preamble: 'How often do you experience the following:',
    questions: [
      'I feel emotionally drained by my work',
      'I feel used up at the end of the workday',
      'I feel fatigued when I get up in the morning and have to face another day at work',
      'Working all day is really a strain for me',
      'I feel burned out from my work',
      'I have become less interested in my work since I started this job',
      'I have become less enthusiastic about my work',
      'I doubt the significance of my work',
      'I feel I am not effective in my work',
    ],
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often', value: 3 },
      { label: 'Always', value: 4 },
    ],
    scoring: [
      { min: 0, max: 9, level: 'Low Risk', color: 'var(--success)', description: 'You show minimal signs of burnout. Keep maintaining healthy work-life boundaries.' },
      { min: 10, max: 18, level: 'Some Risk', color: '#f59e0b', description: 'You show some signs of burnout. Consider reviewing your workload and exploring stress management resources.' },
      { min: 19, max: 27, level: 'Moderate Risk', color: '#f97316', description: 'You show moderate signs of burnout. We recommend speaking with a therapist and reviewing your work-life balance.' },
      { min: 28, max: 36, level: 'High Risk', color: 'var(--danger)', description: 'You show significant signs of burnout. Please consider booking a session with a therapist and speaking with your manager about your workload.' },
    ],
  },
  {
    id: 'stress',
    title: 'Perceived Stress Scale',
    description: 'Understand how stressful you perceive your life to be right now with this widely-used assessment.',
    duration: '3 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    preamble: 'In the last month, how often have you:',
    questions: [
      'Been upset because of something that happened unexpectedly',
      'Felt that you were unable to control the important things in your life',
      'Felt nervous and stressed',
      'Felt confident about your ability to handle personal problems',
      'Felt that things were going your way',
      'Found that you could not cope with all the things you had to do',
      'Been able to control irritations in your life',
      'Felt that you were on top of things',
      'Been angered because of things outside your control',
      'Felt difficulties were piling up so high that you could not overcome them',
    ],
    options: [
      { label: 'Never', value: 0 },
      { label: 'Almost never', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Fairly often', value: 3 },
      { label: 'Very often', value: 4 },
    ],
    scoring: [
      { min: 0, max: 13, level: 'Low Stress', color: 'var(--success)', description: 'You perceive relatively low levels of stress. Continue with your current coping strategies.' },
      { min: 14, max: 26, level: 'Moderate Stress', color: '#f59e0b', description: 'You perceive moderate levels of stress. Consider exploring stress management techniques or our resources library.' },
      { min: 27, max: 40, level: 'High Stress', color: 'var(--danger)', description: 'You perceive high levels of stress. We recommend booking a session with a therapist to develop personalised coping strategies.' },
    ],
  },
];

export default function SelfTest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function startTest(test) {
    setSelectedTest(test);
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
  }

  function answerQuestion(value) {
    const newAnswers = { ...answers, [currentQ]: value };
    setAnswers(newAnswers);

    if (currentQ < selectedTest.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const total = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const maxScore = selectedTest.questions.length * (selectedTest.options.length - 1);
      const scoring = selectedTest.scoring.find(s => total >= s.min && total <= s.max);
      setResult({ total, maxScore, ...scoring });
    }
  }

  function goBack() {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  }

  // Test selection screen
  if (!selectedTest) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-header__title">Self-Assessments</h1>
          <p className="page-header__subtitle">
            Confidential, validated tools to help you understand how you're feeling.
            {user?.org_name ? ' Your results are private and never shared with your employer.' : ''}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {ASSESSMENTS.map(test => (
            <div key={test.id} className="card" style={{ cursor: 'pointer' }} onClick={() => startTest(test)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--primary-50)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {test.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{test.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{test.questions.length} questions &middot; {test.duration}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6, marginBottom: 16 }}>{test.description}</p>
              <button className="btn btn--primary btn--sm btn--full">Start Assessment</button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: 20, background: '#eef2ff', borderRadius: 12, border: '1px solid #e0e7ff' }}>
          <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4, fontSize: 13 }}>Privacy Notice</div>
          <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
            These assessments are for your personal insight only. Results are stored locally and are never shared with your employer, HR, or anyone else. If you feel you need support, you can book a confidential session with one of our therapists.
          </div>
        </div>
      </>
    );
  }

  // Results screen
  if (result) {
    const percentage = Math.round((result.total / result.maxScore) * 100);
    return (
      <>
        <div style={{ marginBottom: 24 }}>
          <button className="btn btn--ghost btn--sm" onClick={() => setSelectedTest(null)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Assessments
          </button>
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `${result.color}18`, color: result.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 28, fontWeight: 700,
          }}>
            {result.total}
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginBottom: 8 }}>
            {selectedTest.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            <span className="tag" style={{ background: `${result.color}18`, color: result.color }}>{result.level}</span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{result.total} / {result.maxScore}</span>
          </div>

          {/* Score bar */}
          <div style={{ background: 'var(--bg)', borderRadius: 8, height: 12, marginBottom: 24, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 8,
              width: `${percentage}%`,
              background: result.color,
              transition: 'width 0.8s ease',
            }} />
          </div>

          <div className="card card--no-hover" style={{ textAlign: 'left', marginBottom: 24 }}>
            <p style={{ fontSize: 15, color: 'var(--text-sec)', lineHeight: 1.7 }}>
              {result.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--primary btn--md" onClick={() => navigate('/app/therapists')}>
              Book a Session
            </button>
            <button className="btn btn--outline btn--md" onClick={() => startTest(selectedTest)}>
              Retake Assessment
            </button>
            <button className="btn btn--ghost btn--md" onClick={() => setSelectedTest(null)}>
              Try Another Test
            </button>
          </div>

          <div style={{ marginTop: 32, padding: 16, background: 'var(--bg)', borderRadius: 12, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            These results are for informational purposes only and do not constitute a medical diagnosis. If you are in crisis or need immediate help, please contact the Samaritans at 116 123 (UK) or your local emergency services.
          </div>
        </div>
      </>
    );
  }

  // Question screen
  const progress = ((currentQ + 1) / selectedTest.questions.length) * 100;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn--ghost btn--sm" onClick={() => setSelectedTest(null)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Exit Assessment
        </button>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sec)' }}>{selectedTest.title}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {currentQ + 1} of {selectedTest.questions.length}
            </span>
          </div>
          <div style={{ background: 'var(--bg)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 6,
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--violet))',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Question */}
        <div className="card card--no-hover" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
            {selectedTest.preamble}
          </p>
          <h3 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, marginBottom: 24 }}>
            {selectedTest.questions[currentQ]}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedTest.options.map((opt) => (
              <button
                key={opt.value}
                className={`self-test-q__opt ${answers[currentQ] === opt.value ? 'selected' : ''}`}
                style={{
                  flex: 'none', textAlign: 'left', padding: '14px 18px',
                  fontSize: 14, display: 'flex', alignItems: 'center', gap: 12,
                }}
                onClick={() => answerQuestion(opt.value)}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: answers[currentQ] === opt.value ? '6px solid var(--primary)' : '2px solid var(--border)',
                  flexShrink: 0, transition: 'all 0.15s',
                  background: answers[currentQ] === opt.value ? 'white' : 'transparent',
                }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {currentQ > 0 && (
          <button className="btn btn--ghost btn--sm" onClick={goBack}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Previous
          </button>
        )}
      </div>
    </>
  );
}
