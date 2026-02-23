import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

/* ========================================
   Reusable SVG Components
   ======================================== */

const CheckIcon16 = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 8l3 3 5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon20 = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#6366f1" fillOpacity="0.1" />
    <path d="M6.5 10l2.5 2.5 5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogoSvg = ({ gradientId }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="14" fill={`url(#${gradientId})`} />
    <path d="M8 14.5C8 14.5 10.5 9 14 9C17.5 9 20 14.5 20 14.5C20 14.5 17.5 20 14 20C10.5 20 8 14.5 8 14.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="14.5" r="2.5" fill="white" />
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="28" y2="28">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

/* ========================================
   Landing Page Component
   ======================================== */

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const navRef = useRef(null);
  const animatedElementsRef = useRef([]);
  const impactValuesRef = useRef([]);

  // --- Smooth scroll handler ---
  const scrollToSection = useCallback((e, sectionId) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target && navRef.current) {
      const navHeight = navRef.current.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  // --- Sticky nav scroll effect ---
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Scroll-triggered animations ---
  useEffect(() => {
    const elements = animatedElementsRef.current.filter(Boolean);

    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.6s ease ${(i % 3) * 0.1}s, transform 0.6s ease ${(i % 3) * 0.1}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // --- Impact number counter animation ---
  useEffect(() => {
    const elements = impactValuesRef.current.filter(Boolean);

    const animateValue = (el) => {
      const text = el.textContent.trim();
      const match = text.match(/^(\d+)/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = text.replace(match[1], '');
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current + suffix;
      }, 30);
    };

    const impactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValue(entry.target);
            impactObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((el) => impactObserver.observe(el));

    return () => impactObserver.disconnect();
  }, []);

  // --- Track animated elements index ---
  let animIdx = 0;
  const registerAnim = (el) => {
    if (el && !animatedElementsRef.current.includes(el)) {
      animatedElementsRef.current.push(el);
    }
  };

  let impactIdx = 0;
  const registerImpact = (el) => {
    if (el && !impactValuesRef.current.includes(el)) {
      impactValuesRef.current.push(el);
    }
  };

  // --- Demo form handler ---
  const handleDemoSubmit = useCallback((e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  }, []);

  // --- Data ---
  const trustLogos = ['Deloitte', 'Monzo', 'Revolut', 'Sky'];

  const accreditationBodies = [
    { abbr: 'BACP', full: 'British Association for Counselling & Psychotherapy' },
    { abbr: 'HCPC', full: 'Health & Care Professions Council' },
    { abbr: 'UKCP', full: 'UK Council for Psychotherapy' },
    { abbr: 'BPS', full: 'British Psychological Society' },
  ];

  const impactStats = [
    { value: '41%', label: 'reduction in absenteeism when mental health support is available' },
    { value: '5x', label: 'return on investment for every pound spent on employee wellbeing' },
    { value: '67%', label: 'of employees say mental health support improves their productivity' },
    { value: '23%', label: 'increase in employee retention with access to mental health benefits' },
  ];

  const steps = [
    {
      number: 1,
      title: 'Set up your organisation',
      desc: "Tell us about your company size and needs. We'll create your organisation's private, branded portal with a dedicated account manager.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm13 0l-4 4m0 0l-4-4m4 4V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Invite your team',
      desc: 'Share a simple signup link with your employees. They create private accounts in under 60 seconds \u2014 no paperwork, no admin overhead.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m20-6l-3 3-1.5-1.5M14 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Track outcomes & ROI',
      desc: 'Monitor anonymous engagement metrics, wellbeing trends, and programme ROI through your real-time admin dashboard. No individual data \u2014 ever.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const features = [
    {
      iconClass: 'feature-card__icon--purple',
      title: 'Enterprise-Grade Security',
      desc: 'SOC 2 Type II certified, GDPR compliant, end-to-end encrypted sessions. Employee data is fully anonymised \u2014 you only see aggregated insights, never individual usage.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      iconClass: 'feature-card__icon--blue',
      title: 'Accredited Therapists Only',
      desc: 'Every therapist is UK-based and registered with the HCPC, BACP, UKCP, or BPS. Carefully vetted so your employees get the highest standard of care.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      iconClass: 'feature-card__icon--green',
      title: 'Real-Time Analytics',
      desc: 'Track engagement rates, session utilisation, wellbeing trends, and programme ROI through your dedicated admin dashboard. Anonymous by design.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      iconClass: 'feature-card__icon--amber',
      title: 'Effortless Onboarding',
      desc: 'Share a single invite link. Employees sign up privately in under 60 seconds. No IT integration needed, no complex rollouts. Works alongside your existing benefits.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      iconClass: 'feature-card__icon--rose',
      title: 'Wide Range of Specialities',
      desc: 'Anxiety, depression, burnout, stress, relationships, trauma, grief \u2014 your employees get matched with therapists who specialise in exactly what they need.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      iconClass: 'feature-card__icon--teal',
      title: 'Video & Audio Sessions',
      desc: 'Employees connect via secure video or audio \u2014 whichever they prefer. Works on desktop, tablet, and mobile. No downloads, no plugins, no friction.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const platformFeatures = [
    'Real-time engagement & utilisation metrics',
    'Aggregated wellbeing trend reports',
    'Downloadable ROI & board-ready reports',
    'Employee self-service \u2014 zero admin overhead',
    'Dedicated account manager & onboarding support',
  ];

  const pricingPlans = [
    {
      name: 'Pilot',
      desc: 'Try Feelya risk-free with your team',
      amount: '\u00A3299',
      period: '/ month',
      features: [
        'No minimum or maximum team size',
        'Month-to-month, cancel anytime',
        'Full therapist directory access',
        'Secure video & audio sessions',
        'Content library access',
        'Basic engagement analytics',
        'Self-assessment tools',
      ],
      cta: 'Book a Demo',
      ctaClass: 'btn btn--outline btn--lg btn--full',
      featured: false,
    },
    {
      name: 'Growth',
      desc: "For companies ready to invest in their team's wellbeing",
      amount: '\u00A3799',
      period: '/ month',
      features: [
        'Everything in Pilot',
        'Advanced analytics & ROI reports',
        'Dedicated account manager',
        'Interactive wellness workshops',
        'Branded portal',
        'Mood tracking & wellbeing trends',
        'Podcast & content library',
      ],
      cta: 'Book a Demo',
      ctaClass: 'btn btn--primary btn--lg btn--full',
      featured: true,
    },
    {
      name: 'Custom',
      desc: 'For large organisations with complex requirements',
      amount: 'Custom',
      amountClass: 'pricing-card__amount pricing-card__amount--custom',
      period: 'pricing',
      features: [
        'Everything in Growth',
        'Unlimited team size',
        'SSO & HRIS integration',
        'Custom wellness programmes',
        'Quarterly wellbeing events & ceremonies',
        'Unlimited workshops',
        'Priority SLA & 24/7 support',
      ],
      cta: 'Book a Demo',
      ctaClass: 'btn btn--outline btn--lg btn--full',
      featured: false,
    },
  ];

  const testimonials = [
    {
      quote: '\u201CWe rolled out Feelya to our 200-strong team and the engagement has been incredible. Absenteeism dropped by 34% in the first quarter. The anonymous analytics give us the data we need without compromising trust.\u201D',
      name: 'Sarah K.',
      role: 'Head of People, Fintech Scale-up',
      avatarBg: '#c4b5fd',
      initial: 'S',
    },
    {
      quote: '\u201CThe onboarding was remarkably smooth. Our employees were booking sessions within hours of launch. The ROI reports make it easy to justify the investment to our board \u2014 Feelya pays for itself.\u201D',
      name: 'Marcus T.',
      role: 'CFO, SaaS Company (350 employees)',
      avatarBg: '#a5b4fc',
      initial: 'M',
    },
    {
      quote: '\u201CWhat sets Feelya apart is the quality of therapists and the complete anonymity. Our employees actually use it \u2014 89% engagement rate. It\u2019s become a core part of our employer brand.\u201D',
      name: 'Rachel D.',
      role: 'HR Director, Law Firm (120 employees)',
      avatarBg: '#86efac',
      initial: 'R',
    },
  ];

  const resources = [
    {
      imgBg: 'linear-gradient(135deg, #ede9fe, #e0e7ff)',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0a2 2 0 002 2h2a2 2 0 002-2m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      category: 'Whitepaper',
      title: 'The ROI of Employee Mental Health Investment',
      desc: 'How leading UK companies measure and maximise returns on their mental health programmes.',
      linkText: 'Download \u2192',
    },
    {
      imgBg: 'linear-gradient(135deg, #d1fae5, #e0f2fe)',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm11-1v6m-3-3h6" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      category: 'Guide',
      title: 'Building a Mental Health Strategy for Your Team',
      desc: 'A practical step-by-step framework for HR leaders rolling out employee wellbeing programmes.',
      linkText: 'Read More \u2192',
    },
    {
      imgBg: 'linear-gradient(135deg, #fef3c7, #fce7f3)',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      category: 'Research',
      title: 'Burnout in the UK Workplace: 2025 Report',
      desc: 'Original research on burnout prevalence, its cost to businesses, and evidence-based prevention strategies.',
      linkText: 'Read More \u2192',
    },
  ];

  return (
    <>
      {/* ======== Navigation ======== */}
      <nav
        className={`nav${navScrolled ? ' nav--scrolled' : ''}`}
        ref={navRef}
      >
        <div className="container nav__inner">
          <Link to="/" className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="nav__logo-icon">
              <LogoSvg gradientId="logo-grad" />
            </span>
            <span className="nav__logo-text">feelya</span>
            <span className="nav__logo-badge">for Business</span>
          </Link>

          <div className={`nav__links${mobileMenuOpen ? ' nav__links--open' : ''}`}>
            <a href="#how-it-works" className="nav__link" onClick={(e) => scrollToSection(e, 'how-it-works')}>How It Works</a>
            <a href="#why-feelya" className="nav__link" onClick={(e) => scrollToSection(e, 'why-feelya')}>Why Feelya</a>
            <a href="#platform" className="nav__link" onClick={(e) => scrollToSection(e, 'platform')}>Platform</a>
            <a href="#pricing" className="nav__link" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a>
            <a href="#case-studies" className="nav__link" onClick={(e) => scrollToSection(e, 'case-studies')}>Case Studies</a>
            <a href="#for-therapists" className="nav__link" onClick={(e) => scrollToSection(e, 'for-therapists')}>For Therapists</a>
          </div>

          <div className="nav__actions">
            <Link to="/login" className="nav__link nav__link--login">Log In</Link>
            <a href="#get-started" className="btn btn--primary btn--sm" onClick={(e) => scrollToSection(e, 'get-started')}>Book a Demo</a>
          </div>

          {/* Therapist banner under header */}
          <div className="nav__therapist-banner">
            <span>Are you a therapist?</span>
            <a href="#for-therapists" onClick={(e) => scrollToSection(e, 'for-therapists')}>Join Feelya here</a>
          </div>

          <button
            className={`nav__hamburger${mobileMenuOpen ? ' nav__hamburger--open' : ''}`}
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* ======== Hero Section ======== */}
      <section className="hero">
        <div className="hero__bg-shapes">
          <div className="hero__shape hero__shape--1"></div>
          <div className="hero__shape hero__shape--2"></div>
          <div className="hero__shape hero__shape--3"></div>
        </div>
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot"></span>
              Trusted by 500+ UK organisations
            </div>
            <h1 className="hero__title">
              A healthier team builds<br />
              a <em>stronger</em> business
            </h1>
            <p className="hero__subtitle">
              Give every employee access to accredited UK-based therapists through a secure, effortless platform. Reduce absenteeism, boost engagement, and show your people they matter.
            </p>
            <div className="hero__ctas">
              <a href="#get-started" className="btn btn--primary btn--lg" onClick={(e) => scrollToSection(e, 'get-started')}>
                Book a Demo
                <ArrowIcon />
              </a>
              <a href="#how-it-works" className="btn btn--ghost btn--lg" onClick={(e) => scrollToSection(e, 'how-it-works')}>
                See How It Works
              </a>
            </div>
            <div className="hero__trust">
              <div className="hero__trust-logos">
                {trustLogos.map((name) => (
                  <div key={name} className="hero__trust-logo">{name}</div>
                ))}
              </div>
              <div className="hero__trust-text">
                <span>Trusted by industry-leading companies</span>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__card hero__card--main">
              <div className="hero__card-header">
                <div className="hero__card-avatar">
                  <div className="hero__card-avatar-img" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 3.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="hero__card-name">Organisation Dashboard</div>
                  <div className="hero__card-title">Acme Corp &middot; 247 employees</div>
                </div>
              </div>
              <div className="hero__card-stats">
                <div className="hero__card-stat">
                  <div className="hero__card-stat-value">89%</div>
                  <div className="hero__card-stat-label">Engagement</div>
                </div>
                <div className="hero__card-stat">
                  <div className="hero__card-stat-value">342</div>
                  <div className="hero__card-stat-label">Sessions</div>
                </div>
                <div className="hero__card-stat">
                  <div className="hero__card-stat-value">4.9</div>
                  <div className="hero__card-stat-label">Avg Rating</div>
                </div>
              </div>
              <div className="hero__card-bar">
                <div className="hero__card-bar-label">Team wellbeing score</div>
                <div className="hero__card-bar-track">
                  <div className="hero__card-bar-fill" style={{ width: '78%' }}></div>
                </div>
                <div className="hero__card-bar-value">78/100</div>
              </div>
            </div>

            <div className="hero__card hero__card--floating hero__card--secure">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 9V7a5 5 0 0110 0v2m-8 0h6a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>SOC 2 &amp; GDPR Compliant</span>
            </div>

            <div className="hero__card hero__card--floating hero__card--verified">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.5 10l2.5 2.5 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="8" stroke="#10b981" strokeWidth="1.5" />
              </svg>
              <span>100% Anonymous</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Trust Bar ======== */}
      <section className="trust-bar">
        <div className="container">
          <p className="trust-bar__label">Our therapists are accredited by</p>
          <div className="trust-bar__logos">
            {accreditationBodies.map((body) => (
              <div key={body.abbr} className="trust-bar__logo">
                <span className="trust-bar__logo-text">{body.abbr}</span>
                <span className="trust-bar__logo-sub">{body.full}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Impact Stats ======== */}
      <section className="impact">
        <div className="container">
          <div className="section-header">
            <span className="section-label">The Impact</span>
            <h2 className="section-title">Mental health support that <em>delivers</em> results</h2>
            <p className="section-subtitle">The business case for employee wellbeing is clear. Companies investing in mental health see measurable returns across every metric that matters.</p>
          </div>
          <div className="impact__grid">
            {impactStats.map((stat, i) => (
              <div key={i} className="impact__stat" ref={registerAnim}>
                <div className="impact__value" ref={registerImpact}>{stat.value}</div>
                <div className="impact__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== How It Works ======== */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Launch in days, not months</h2>
            <p className="section-subtitle">Getting started is simple. We handle the complexity so your HR team doesn&apos;t have to.</p>
          </div>
          <div className="steps">
            {steps.map((step, i) => (
              <React.Fragment key={step.number}>
                <div className="step" ref={registerAnim}>
                  <div className="step__number">{step.number}</div>
                  <div className="step__icon">{step.icon}</div>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__desc">{step.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="step__connector"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Why Feelya ======== */}
      <section className="features" id="why-feelya">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Feelya</span>
            <h2 className="section-title">Everything your workforce needs &mdash; <em>nothing</em> they don&apos;t</h2>
            <p className="section-subtitle">A complete employee mental health platform built for modern organisations.</p>
          </div>
          <div className="features__grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card" ref={registerAnim}>
                <div className={`feature-card__icon ${feature.iconClass}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Platform Preview ======== */}
      <section className="platform-section" id="platform">
        <div className="container">
          <div className="platform__inner">
            <div className="platform__content" ref={registerAnim}>
              <span className="section-label">The Platform</span>
              <h2 className="section-title">Built for HR teams who care about outcomes</h2>
              <p className="platform__desc">
                Your admin dashboard gives you full visibility into programme engagement and ROI &mdash; without compromising employee privacy. Everything you need to report to leadership, justify budget, and improve your offering.
              </p>
              <ul className="platform__list">
                {platformFeatures.map((feat) => (
                  <li key={feat}>
                    <CheckCircleIcon20 />
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="platform__ctas">
                <a href="#get-started" className="btn btn--primary btn--lg" onClick={(e) => scrollToSection(e, 'get-started')}>Book a Demo</a>
                <a href="#pricing" className="btn btn--ghost btn--lg" onClick={(e) => scrollToSection(e, 'pricing')}>View Plans</a>
              </div>
            </div>

            <div className="platform__preview" ref={registerAnim}>
              <div className="platform__card">
                <div className="platform__card-header">
                  <div className="platform__card-dot platform__card-dot--red"></div>
                  <div className="platform__card-dot platform__card-dot--yellow"></div>
                  <div className="platform__card-dot platform__card-dot--green"></div>
                  <span className="platform__card-title">Admin Dashboard</span>
                </div>
                <div className="platform__card-body">
                  <div className="platform__metric">
                    <div className="platform__metric-header">
                      <span className="platform__metric-label">Total Sessions This Month</span>
                      <span className="platform__metric-change platform__metric-change--up">+18%</span>
                    </div>
                    <div className="platform__metric-value">342</div>
                  </div>
                  <div className="platform__metric">
                    <div className="platform__metric-header">
                      <span className="platform__metric-label">Employee Engagement Rate</span>
                      <span className="platform__metric-change platform__metric-change--up">+7%</span>
                    </div>
                    <div className="platform__metric-value">89%</div>
                  </div>
                  <div className="platform__metric">
                    <div className="platform__metric-header">
                      <span className="platform__metric-label">Average Wellbeing Score</span>
                      <span className="platform__metric-change platform__metric-change--up">+12%</span>
                    </div>
                    <div className="platform__metric-bar">
                      <div className="platform__metric-bar-track">
                        <div className="platform__metric-bar-fill" style={{ width: '78%' }}></div>
                      </div>
                      <span>78/100</span>
                    </div>
                  </div>
                  <div className="platform__metric">
                    <div className="platform__metric-header">
                      <span className="platform__metric-label">Top Specialisations Used</span>
                    </div>
                    <div className="platform__metric-tags">
                      <span className="tag">Anxiety</span>
                      <span className="tag">Stress</span>
                      <span className="tag">Burnout</span>
                      <span className="tag">Relationships</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Pricing ======== */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Pricing</span>
            <h2 className="section-title">Simple, flat monthly pricing</h2>
            <p className="section-subtitle">No per-employee fees. No hidden costs. One predictable monthly price so you can budget with confidence.</p>
          </div>
          <div className="pricing__grid">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`pricing-card${plan.featured ? ' pricing-card--featured' : ''}`}
                ref={registerAnim}
              >
                {plan.featured && <div className="pricing-card__badge">Most Popular</div>}
                <div className="pricing-card__header">
                  <h3 className="pricing-card__name">{plan.name}</h3>
                  <p className="pricing-card__desc">{plan.desc}</p>
                </div>
                <div className="pricing-card__price">
                  <span className={plan.amountClass || 'pricing-card__amount'}>{plan.amount}</span>
                  <span className="pricing-card__period">{plan.period}</span>
                </div>
                <ul className="pricing-card__features">
                  {plan.features.map((feat) => (
                    <li key={feat}>
                      <CheckIcon16 />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a href={`#get-started?plan=${plan.name.toLowerCase()}`} className={plan.ctaClass} onClick={(e) => scrollToSection(e, 'get-started')}>{plan.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Testimonials ======== */}
      <section className="testimonials" id="case-studies">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Case Studies</span>
            <h2 className="section-title">Trusted by forward-thinking organisations</h2>
          </div>
          <div className="testimonials__grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card" ref={registerAnim}>
                <div className="testimonial-card__stars">{'\u2733\u2733\u2733\u2733\u2733'}</div>
                <blockquote className="testimonial-card__quote">{t.quote}</blockquote>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar" style={{ background: t.avatarBg }}>{t.initial}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== Resources ======== */}
      <section className="resources" id="resources">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Resources</span>
            <h2 className="section-title">Insights for workplace wellbeing leaders</h2>
            <p className="section-subtitle">Research-backed guides to help you build a mentally healthier workplace.</p>
          </div>
          <div className="resources__grid">
            {resources.map((res) => (
              <a key={res.title} href="#" className="resource-card" ref={registerAnim} onClick={(e) => e.preventDefault()}>
                <div className="resource-card__img" style={{ background: res.imgBg }}>
                  {res.icon}
                </div>
                <span className="resource-card__category">{res.category}</span>
                <h3 className="resource-card__title">{res.title}</h3>
                <p className="resource-card__desc">{res.desc}</p>
                <span className="resource-card__link">{res.linkText}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ======== For Therapists ======== */}
      <section className="for-therapists" id="for-therapists">
        <div className="container">
          <div className="for-therapists__inner">
            <div className="for-therapists__content" ref={registerAnim}>
              <span className="section-label">For Therapists</span>
              <h2 className="section-title">Grow your practice with Feelya</h2>
              <p className="for-therapists__desc">
                Join a growing network of accredited UK-based therapists delivering impactful corporate therapy sessions. Focus on what you do best &mdash; we handle referrals, scheduling, and payments.
              </p>
              <ul className="for-therapists__benefits">
                <li>
                  <CheckCircleIcon20 />
                  Steady stream of corporate client referrals
                </li>
                <li>
                  <CheckCircleIcon20 />
                  Flexible schedule &mdash; choose your own hours
                </li>
                <li>
                  <CheckCircleIcon20 />
                  Guaranteed timely payments, no chasing invoices
                </li>
                <li>
                  <CheckCircleIcon20 />
                  Dedicated therapist portal to manage sessions and clients
                </li>
                <li>
                  <CheckCircleIcon20 />
                  Write blogs and share your expertise with the community
                </li>
                <li>
                  <CheckCircleIcon20 />
                  Must be BACP, HCPC, UKCP, or BPS accredited
                </li>
              </ul>
              <div className="for-therapists__ctas">
                <Link to="/therapist-join" className="btn btn--primary btn--lg">
                  Join as a Therapist
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="for-therapists__visual" ref={registerAnim}>
              <div className="for-therapists__card">
                <div className="for-therapists__card-header">
                  <div className="for-therapists__card-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Therapist Portal</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your dashboard at a glance</div>
                  </div>
                </div>
                <div className="for-therapists__card-stats">
                  <div className="for-therapists__card-stat">
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>24</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sessions/wk</div>
                  </div>
                  <div className="for-therapists__card-stat">
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>4.9</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Rating</div>
                  </div>
                  <div className="for-therapists__card-stat">
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>18</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Clients</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', background: '#f8fafc', borderRadius: '0 0 16px 16px', fontSize: 13, color: 'var(--text-sec)' }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Upcoming Sessions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Employee #1042</span>
                      <span style={{ fontWeight: 500 }}>Today 2:00 PM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Employee #0817</span>
                      <span style={{ fontWeight: 500 }}>Today 4:30 PM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Employee #1395</span>
                      <span style={{ fontWeight: 500 }}>Tomorrow 10:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Final CTA / Demo Form ======== */}
      <section className="final-cta" id="get-started">
        <div className="container">
          <div className="final-cta__inner">
            <div className="final-cta__content" ref={registerAnim}>
              <h2 className="final-cta__title">Ready to support your team&apos;s mental health?</h2>
              <p className="final-cta__desc">Book a 15-minute demo with our team. We&apos;ll show you how Feelya works, answer your questions, and help you find the right plan for your organisation.</p>
              <ul className="final-cta__perks">
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-5" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  No commitment required
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-5" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Launch in under a week
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-5" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Cancel anytime
                </li>
              </ul>
            </div>

            <div className="final-cta__form-wrap" ref={registerAnim}>
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
                    <circle cx="24" cy="24" r="22" stroke="#10b981" strokeWidth="3" />
                    <path d="M15 24l6 6 12-12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 style={{ color: '#fff', fontFamily: "var(--font-serif, Georgia, serif)", fontSize: '22px', marginBottom: '8px' }}>Thank you!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.6' }}>We&apos;ve received your request and will be in touch within 24 hours to schedule your demo.</p>
                </div>
              ) : (
                <form className="final-cta__form" onSubmit={handleDemoSubmit}>
                  <div className="final-cta__form-group">
                    <input type="text" className="final-cta__input" placeholder="Your name" required />
                  </div>
                  <div className="final-cta__form-group">
                    <input type="email" className="final-cta__input" placeholder="Work email" required />
                  </div>
                  <div className="final-cta__form-group">
                    <input type="text" className="final-cta__input" placeholder="Company name" required />
                  </div>
                  <div className="final-cta__form-group">
                    <select className="final-cta__input" defaultValue="">
                      <option value="" disabled>Company size</option>
                      <option value="1-50">1 &ndash; 50 employees</option>
                      <option value="51-200">51 &ndash; 200 employees</option>
                      <option value="201-500">201 &ndash; 500 employees</option>
                      <option value="501-1000">501 &ndash; 1,000 employees</option>
                      <option value="1000+">1,000+ employees</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn--white btn--lg btn--full" disabled={formSubmitting}>
                    {formSubmitting ? 'Submitting...' : (
                      <>
                        Book Your Demo
                        <ArrowIcon />
                      </>
                    )}
                  </button>
                  <p className="final-cta__form-note">No credit card required. We&apos;ll be in touch within 24 hours.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======== Footer ======== */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <a href="#" className="nav__logo" onClick={(e) => e.preventDefault()}>
                <span className="nav__logo-icon">
                  <LogoSvg gradientId="logo-grad2" />
                </span>
                <span className="nav__logo-text">feelya</span>
              </a>
              <p className="footer__tagline">Employee mental health &amp; wellbeing platform.<br />Connecting your team with accredited UK-based therapists.</p>
              <div className="footer__contact">
                <a href="mailto:business@feelya.com">business@feelya.com</a>
              </div>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Platform</h4>
              <ul className="footer__links">
                <li><a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>How It Works</a></li>
                <li><a href="#why-feelya" onClick={(e) => scrollToSection(e, 'why-feelya')}>Why Feelya</a></li>
                <li><a href="#platform" onClick={(e) => scrollToSection(e, 'platform')}>Admin Dashboard</a></li>
                <li><a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')}>Pricing</a></li>
              </ul>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Company</h4>
              <ul className="footer__links">
                <li><a href="#" onClick={(e) => e.preventDefault()}>About Us</a></li>
                <li><a href="#case-studies" onClick={(e) => scrollToSection(e, 'case-studies')}>Case Studies</a></li>
                <li><a href="#resources" onClick={(e) => scrollToSection(e, 'resources')}>Resources</a></li>
                <li><a href="mailto:business@feelya.com">Contact</a></li>
              </ul>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Legal &amp; Security</h4>
              <ul className="footer__links">
                <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>GDPR Compliance</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Security &amp; SOC 2</a></li>
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <p>&copy; 2025 Feelya Ltd. All rights reserved. Registered in England &amp; Wales.</p>
            <div className="footer__bottom-badges">
              <span className="footer__badge">SOC 2</span>
              <span className="footer__badge">GDPR</span>
              <span className="footer__badge">BACP</span>
              <span className="footer__badge">HCPC</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Landing;
