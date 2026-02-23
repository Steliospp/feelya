import { useState } from 'react';
import { useToast } from '../components/Toast';
import '../styles/app.css';

// Blog / Resource Sources
const initialBlogs = [
  { id: 1, title: 'Understanding Anxiety: A Complete Guide', author: 'Dr. Sarah Mitchell', category: 'Anxiety', status: 'published', date: '2026-02-15' },
  { id: 2, title: '5 Mindfulness Techniques for Stress Relief', author: 'Emma Richardson', category: 'Stress', status: 'published', date: '2026-02-10' },
  { id: 3, title: 'How CBT Can Change Your Thinking Patterns', author: 'Dr. Michael Chen', category: 'CBT', status: 'published', date: '2026-02-05' },
  { id: 4, title: 'Navigating Grief: A Therapist\'s Perspective', author: 'Dr. James Cooper', category: 'Grief', status: 'draft', date: '2026-02-20' },
  { id: 5, title: 'Building Resilience in the Workplace', author: 'Priya Sharma', category: 'Stress', status: 'draft', date: '2026-02-22' },
  { id: 6, title: 'The Science of Sleep and Mental Health', author: 'Dr. Robert Hayes', category: 'Sleep', status: 'published', date: '2026-01-28' },
];

// FAQ items
const initialFAQs = [
  { id: 1, question: 'How does Feelya work?', answer: 'Feelya connects employees with licensed therapists through your company\'s wellbeing programme. Simply log in, browse therapists, and book a session.', order: 1 },
  { id: 2, question: 'Is my therapy confidential?', answer: 'Absolutely. All sessions are completely confidential. Your employer can only see anonymised, aggregated data — never individual session details.', order: 2 },
  { id: 3, question: 'How many sessions do I get?', answer: 'This depends on your company\'s plan. Most plans include 5 sessions per quarter. Check your coupon code for details.', order: 3 },
  { id: 4, question: 'Can I choose my own therapist?', answer: 'Yes! You can browse all available therapists, read their profiles, and choose the one that feels right for you.', order: 4 },
  { id: 5, question: 'What if I need to cancel a session?', answer: 'You can cancel free of charge up to 24 hours before your session. Late cancellations (under 24 hours) incur a 50% fee.', order: 5 },
  { id: 6, question: 'Are the therapists licensed?', answer: 'Every therapist on Feelya is a licensed, accredited professional registered with a recognised body such as HCPC, BACP, or UKCP.', order: 6 },
];

// Footer links
const initialFooterLinks = [
  { id: 1, section: 'Company', label: 'About Us', url: '/about' },
  { id: 2, section: 'Company', label: 'Careers', url: '/careers' },
  { id: 3, section: 'Company', label: 'Contact', url: '/contact' },
  { id: 4, section: 'Legal', label: 'Privacy Policy', url: '/privacy' },
  { id: 5, section: 'Legal', label: 'Terms of Service', url: '/terms' },
  { id: 6, section: 'Legal', label: 'Cookie Policy', url: '/cookies' },
  { id: 7, section: 'Resources', label: 'Blog', url: '/blog' },
  { id: 8, section: 'Resources', label: 'Help Centre', url: '/help' },
  { id: 9, section: 'Resources', label: 'Crisis Support', url: '/crisis' },
];

const contentTabs = ['blogs', 'faqs', 'footer'];

export default function AdminContent() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState('blogs');

  // Blog state
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: '', author: '', category: '' });

  // FAQ state
  const [faqs, setFaqs] = useState(initialFAQs);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Footer state
  const [footerLinks, setFooterLinks] = useState(initialFooterLinks);
  const [showFooterModal, setShowFooterModal] = useState(false);
  const [footerForm, setFooterForm] = useState({ section: 'Company', label: '', url: '' });

  // Blog handlers
  function addBlog() {
    if (!blogForm.title.trim()) return;
    setBlogs(prev => [{ id: Date.now(), ...blogForm, status: 'draft', date: new Date().toISOString().split('T')[0] }, ...prev]);
    setBlogForm({ title: '', author: '', category: '' });
    setShowBlogModal(false);
    showToast('Blog added as draft');
  }

  function toggleBlogStatus(id) {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'published' ? 'draft' : 'published' } : b));
    showToast('Blog status updated');
  }

  // FAQ handlers
  function addFaq() {
    if (!faqForm.question.trim()) return;
    setFaqs(prev => [...prev, { id: Date.now(), question: faqForm.question, answer: faqForm.answer, order: prev.length + 1 }]);
    setFaqForm({ question: '', answer: '' });
    setShowFaqModal(false);
    showToast('FAQ added');
  }

  function startEditFaq(faq) {
    setEditingFaq(faq.id);
    setFaqForm({ question: faq.question, answer: faq.answer });
  }

  function saveFaq() {
    setFaqs(prev => prev.map(f => f.id === editingFaq ? { ...f, question: faqForm.question, answer: faqForm.answer } : f));
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '' });
    showToast('FAQ updated');
  }

  function removeFaq(id) {
    setFaqs(prev => prev.filter(f => f.id !== id));
    showToast('FAQ removed');
  }

  // Footer handlers
  function addFooterLink() {
    if (!footerForm.label.trim()) return;
    setFooterLinks(prev => [...prev, { id: Date.now(), ...footerForm }]);
    setFooterForm({ section: 'Company', label: '', url: '' });
    setShowFooterModal(false);
    showToast('Footer link added');
  }

  function removeFooterLink(id) {
    setFooterLinks(prev => prev.filter(l => l.id !== id));
    showToast('Link removed');
  }

  const footerSections = [...new Set(footerLinks.map(l => l.section))];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Content Management</h1>
        <p className="page-header__subtitle">Manage blogs, FAQs, and footer content across the platform.</p>
      </div>

      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        {contentTabs.map(tab => (
          <button key={tab} className={`sessions-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'faqs' ? 'FAQs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ─── BLOGS ─── */}
      {activeTab === 'blogs' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>{blogs.length} articles &middot; {blogs.filter(b => b.status === 'published').length} published</div>
            <button className="btn btn--primary btn--sm" onClick={() => setShowBlogModal(true)}>Add Blog</button>
          </div>

          <div className="card card--no-hover">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Author</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px', color: 'var(--text-sec)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{b.title}</td>
                    <td style={{ padding: '12px', color: 'var(--primary)' }}>{b.author}</td>
                    <td style={{ padding: '12px' }}><span className="tag">{b.category}</span></td>
                    <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{b.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`tag ${b.status === 'published' ? 'tag--success' : 'tag--warning'}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button className="btn btn--outline btn--xs" onClick={() => toggleBlogStatus(b.id)}>
                        {b.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showBlogModal && (
            <div className="modal-overlay" onClick={() => setShowBlogModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
                <button className="modal__close" onClick={() => setShowBlogModal(false)}>&times;</button>
                <h3 className="modal__title">Add Blog Article</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                  <div>
                    <label className="form-label">Title</label>
                    <input className="form-input" placeholder="Article title" value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Author</label>
                    <input className="form-input" placeholder="Author name" value={blogForm.author} onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Category</label>
                    <input className="form-input" placeholder="e.g. Anxiety, Stress" value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn--ghost btn--md btn--full" onClick={() => setShowBlogModal(false)}>Cancel</button>
                  <button className="btn btn--primary btn--md btn--full" onClick={addBlog}>Add Blog</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── FAQS ─── */}
      {activeTab === 'faqs' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>{faqs.length} FAQ items</div>
            <button className="btn btn--primary btn--sm" onClick={() => { setShowFaqModal(true); setFaqForm({ question: '', answer: '' }); }}>Add FAQ</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(f => (
              <div key={f.id} className="card card--no-hover" style={{ padding: 20 }}>
                {editingFaq === f.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input className="form-input" value={faqForm.question} onChange={e => setFaqForm(prev => ({ ...prev, question: e.target.value }))} placeholder="Question" />
                    <textarea className="form-textarea" value={faqForm.answer} onChange={e => setFaqForm(prev => ({ ...prev, answer: e.target.value }))} placeholder="Answer" style={{ minHeight: 80 }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn--primary btn--xs" onClick={saveFaq}>Save</button>
                      <button className="btn btn--ghost btn--xs" onClick={() => setEditingFaq(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>{f.question}</div>
                        <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6 }}>{f.answer}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button className="btn btn--outline btn--xs" onClick={() => startEditFaq(f)}>Edit</button>
                        <button className="btn btn--danger-outline btn--xs" onClick={() => removeFaq(f.id)}>Remove</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {showFaqModal && (
            <div className="modal-overlay" onClick={() => setShowFaqModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
                <button className="modal__close" onClick={() => setShowFaqModal(false)}>&times;</button>
                <h3 className="modal__title">Add FAQ</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                  <div>
                    <label className="form-label">Question</label>
                    <input className="form-input" placeholder="e.g. How do I book a session?" value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Answer</label>
                    <textarea className="form-textarea" placeholder="Detailed answer..." value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} style={{ minHeight: 100 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn--ghost btn--md btn--full" onClick={() => setShowFaqModal(false)}>Cancel</button>
                  <button className="btn btn--primary btn--md btn--full" onClick={addFaq}>Add FAQ</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── FOOTER ─── */}
      {activeTab === 'footer' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>{footerLinks.length} footer links across {footerSections.length} sections</div>
            <button className="btn btn--primary btn--sm" onClick={() => setShowFooterModal(true)}>Add Link</button>
          </div>

          {footerSections.map(section => (
            <div key={section} className="card card--no-hover" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>{section}</div>
              {footerLinks.filter(l => l.section === section).map(link => (
                <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{link.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{link.url}</span>
                  </div>
                  <button className="btn btn--danger-outline btn--xs" onClick={() => removeFooterLink(link.id)}>Remove</button>
                </div>
              ))}
            </div>
          ))}

          {showFooterModal && (
            <div className="modal-overlay" onClick={() => setShowFooterModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
                <button className="modal__close" onClick={() => setShowFooterModal(false)}>&times;</button>
                <h3 className="modal__title">Add Footer Link</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                  <div>
                    <label className="form-label">Section</label>
                    <select className="form-input" value={footerForm.section} onChange={e => setFooterForm(f => ({ ...f, section: e.target.value }))}>
                      <option>Company</option>
                      <option>Legal</option>
                      <option>Resources</option>
                      <option>Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Label</label>
                    <input className="form-input" placeholder="e.g. About Us" value={footerForm.label} onChange={e => setFooterForm(f => ({ ...f, label: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">URL</label>
                    <input className="form-input" placeholder="e.g. /about" value={footerForm.url} onChange={e => setFooterForm(f => ({ ...f, url: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn--ghost btn--md btn--full" onClick={() => setShowFooterModal(false)}>Cancel</button>
                  <button className="btn btn--primary btn--md btn--full" onClick={addFooterLink}>Add Link</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
