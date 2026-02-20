import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useOutletContext } from 'react-router-dom';

const questions = [
  { q: 'How often have you felt down, depressed, or hopeless?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you felt nervous, anxious, or on edge?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you had trouble relaxing?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you felt little interest or pleasure in doing things?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you had trouble sleeping (too much or too little)?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you felt tired or had little energy?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you had difficulty concentrating on things?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: "How often have you felt bad about yourself, or that you've let yourself or your family down?", options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How often have you been bothered by worrying too much about different things?', options: ['Not at all', 'Several days', 'More than half', 'Nearly every day'] },
  { q: 'How would you rate your overall emotional wellbeing right now?', options: ['Very good', 'Good', 'Fair', 'Poor'] },
];

export default function SelfTest() {
  const { user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [answers, setAnswers] = useState(new Array(questions.length).fill(-1));
  const [result, setResult] = useState(null);

  function selectAnswer(qIdx, val) {
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = val;
      return next;
    });
  }

  async function handleSubmit() {
    if (answers.includes(-1)) {
      showToast('Please answer all questions', 'error');
      return;
    }

    const score = answers.reduce((a, b) => a + b, 0);
    let resultText, resultClass;
    if (score <= 8) { resultText = "Your results suggest you're doing well. Keep prioritising your mental health!"; resultClass = 'success'; }
    else if (score <= 16) { resultText = 'Your results suggest mild difficulties. Speaking with a therapist could provide helpful support and strategies.'; resultClass = 'warning'; }
    else if (score <= 24) { resultText = 'Your results suggest moderate difficulties. We recommend speaking with a professional therapist who can help.'; resultClass = 'warning'; }
    else { resultText = 'Your results suggest significant difficulties. We strongly recommend connecting with a therapist for professional support.'; resultClass = 'danger'; }

    try {
      await fetch('/api/self-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, score, resultText }),
      });
      outletContext?.loadNotifCount?.();
    } catch {}

    setResult({ score, resultText, resultClass });
  }

  if (result) {
    const { score, resultText, resultClass } = result;
    const bgVar = resultClass === 'success' ? 'var(--success-bg)' : resultClass === 'warning' ? 'var(--warning-bg)' : 'var(--danger-bg)';
    const colorVar = resultClass === 'success' ? 'var(--success)' : resultClass === 'warning' ? 'var(--warning)' : 'var(--danger)';
    return (
      <div className="card card--no-hover" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: bgVar, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <span style={{ fontSize: '36px', fontWeight: 700, color: colorVar }}>{score}</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '12px' }}>Your Score: {score}/40</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-sec)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 24px' }}>{resultText}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {score > 8 && <button className="btn btn--primary btn--md" onClick={() => navigate('/app/therapists')}>Find a Therapist</button>}
          <button className="btn btn--ghost btn--md" onClick={() => { setAnswers(new Array(questions.length).fill(-1)); setResult(null); }}>Take Again</button>
          <button className="btn btn--ghost btn--md" onClick={() => navigate('/app/dashboard')}>Back to Dashboard</button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px', lineHeight: 1.6 }}>
          This assessment is for informational purposes only and is not a clinical diagnosis.{user?.org_name ? ' Your results are completely private and never shared with your employer.' : ''}<br />
          If you're experiencing a mental health emergency, please contact the Samaritans at 116 123 or your local emergency services.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">Self-Assessment</h1>
        <p className="page-header__subtitle">
          This confidential mood assessment takes about 5 minutes. Answer honestly — there are no right or wrong answers.
          {user?.org_name && ' Your responses are completely private and never shared with your employer.'}
        </p>
      </div>

      <div id="selfTestQuestions">
        {questions.map((q, i) => (
          <div key={i} className="self-test-q">
            <div className="self-test-q__text">{i + 1}. {q.q}</div>
            <div className="self-test-q__options">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  type="button"
                  className={`self-test-q__opt ${answers[i] === j ? 'selected' : ''}`}
                  onClick={() => selectAnswer(i, j)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="btn btn--primary btn--lg btn--full" onClick={handleSubmit} style={{ marginTop: '16px' }}>
          Submit Assessment
        </button>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', lineHeight: 1.6 }}>
          This is a screening tool, not a clinical diagnosis. If you're in crisis, please contact the Samaritans at 116 123 (UK) or your local emergency services.
        </p>
      </div>
    </>
  );
}
