import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import '../styles/app.css';

// Blog / Resource Sources
const initialBlogs = [
  { id: 1, title: 'Understanding Anxiety: A Complete Guide', author: 'Dr. Sarah Mitchell', category: 'Anxiety', status: 'published', date: '2026-02-15', content: 'Anxiety is a natural response to stress, but when it becomes persistent and overwhelming, it can interfere with daily life. This guide explores the different types of anxiety disorders, their symptoms, and evidence-based treatment approaches.', image: null },
  { id: 2, title: '5 Mindfulness Techniques for Stress Relief', author: 'Emma Richardson', category: 'Stress', status: 'published', date: '2026-02-10', content: 'Mindfulness techniques can help manage stress by bringing your attention to the present moment. Here are five techniques you can start using today.', image: null },
  { id: 3, title: 'How CBT Can Change Your Thinking Patterns', author: 'Dr. Michael Chen', category: 'CBT', status: 'published', date: '2026-02-05', content: 'Cognitive Behavioural Therapy (CBT) is one of the most well-researched therapeutic approaches. It helps you identify and change unhelpful thinking patterns.', image: null },
  { id: 4, title: 'Navigating Grief: A Therapist\'s Perspective', author: 'Dr. James Cooper', category: 'Grief', status: 'draft', date: '2026-02-20', content: 'Grief is a deeply personal experience. In this article, I share insights from years of working with clients navigating loss.', image: null },
  { id: 5, title: 'Building Resilience in the Workplace', author: 'Priya Sharma', category: 'Stress', status: 'draft', date: '2026-02-22', content: 'Workplace resilience is the ability to adapt and bounce back from challenges. Here are practical strategies for building it.', image: null },
  { id: 6, title: 'The Science of Sleep and Mental Health', author: 'Dr. Robert Hayes', category: 'Sleep', status: 'published', date: '2026-01-28', content: 'Sleep and mental health are closely connected. Poor sleep can worsen mental health conditions, and mental health issues can make it harder to sleep.', image: null },
];

// Therapist-submitted blogs pending approval
const initialTherapistBlogs = [
  { id: 101, title: 'The Power of Mindful Breathing', author: 'Dr. Sarah Mitchell', category: 'Mindfulness', status: 'pending', date: '2026-02-18', content: 'Mindful breathing is one of the simplest yet most powerful tools we have for managing stress and anxiety. In my practice, I teach this technique to nearly every client I work with.\n\nThe 4-7-8 breathing technique:\n- Breathe in through your nose for 4 seconds\n- Hold your breath for 7 seconds\n- Exhale slowly through your mouth for 8 seconds\n- Repeat 3-4 times\n\nThis activates the parasympathetic nervous system, helping to calm the fight-or-flight response that many of us live in chronically.', image: null, feedback: '' },
  { id: 102, title: 'Understanding Attachment Styles in Relationships', author: 'Emma Richardson', category: 'Relationships', status: 'pending', date: '2026-02-20', content: 'Our attachment styles, formed in early childhood, profoundly influence how we relate to others in adulthood. Understanding your attachment style can be a game-changer for improving your relationships.\n\nThe four main attachment styles are:\n1. Secure — comfortable with intimacy and independence\n2. Anxious — craves closeness but fears abandonment\n3. Avoidant — values independence, uncomfortable with closeness\n4. Disorganised — a mix of anxious and avoidant behaviours\n\nRecognising these patterns is the first step toward building healthier connections.', image: null, feedback: '' },
  { id: 103, title: 'Managing Burnout: Signs and Solutions', author: 'Dr. Michael Chen', category: 'Workplace', status: 'pending', date: '2026-02-22', content: 'Burnout is more than just feeling tired. It is a state of chronic stress that leads to physical and emotional exhaustion, cynicism, and feelings of ineffectiveness. As therapists, we are seeing a significant increase in burnout cases post-pandemic.\n\nKey signs to watch for:\n- Constant fatigue that does not improve with rest\n- Feeling detached from work and colleagues\n- Reduced productivity and difficulty concentrating\n- Physical symptoms such as headaches or stomach issues', image: null, feedback: '' },
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

const contentTabs = ['blogs', 'approvals', 'faqs', 'footer'];

export default function AdminContent() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState('blogs');
  const blogImageRef = useRef(null);

  // Blog state
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', author: '', category: '', content: '', image: null, imagePreview: null });

  // Therapist blog approval state
  const [therapistBlogs, setTherapistBlogs] = useState(initialTherapistBlogs);
  const [reviewBlog, setReviewBlog] = useState(null);
  const [declineFeedback, setDeclineFeedback] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineTarget, setDeclineTarget] = useState(null);

  // FAQ state
  const [faqs, setFaqs] = useState(initialFAQs);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Footer state
  const [footerLinks, setFooterLinks] = useState(initialFooterLinks);
  const [showFooterModal, setShowFooterModal] = useState(false);
  const [footerForm, setFooterForm] = useState({ section: 'Company', label: '', url: '' });

  const emptyBlogForm = { title: '', author: '', category: '', content: '', image: null, imagePreview: null };

  // Blog handlers
  function handleBlogImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBlogForm(f => ({ ...f, image: file, imagePreview: url }));
  }

  function removeBlogImage() {
    setBlogForm(f => ({ ...f, image: null, imagePreview: null }));
    if (blogImageRef.current) blogImageRef.current.value = '';
  }

  function addBlog() {
    if (!blogForm.title.trim()) return;
    setBlogs(prev => [{ id: Date.now(), title: blogForm.title.trim(), author: blogForm.author.trim(), category: blogForm.category.trim(), content: blogForm.content.trim(), image: blogForm.imagePreview, status: 'draft', date: new Date().toISOString().split('T')[0] }, ...prev]);
    setBlogForm(emptyBlogForm);
    setShowBlogModal(false);
    showToast('Blog added as draft');
  }

  function startEditBlog(blog) {
    setEditingBlogId(blog.id);
    setBlogForm({ title: blog.title, author: blog.author, category: blog.category, content: blog.content || '', image: blog.image, imagePreview: blog.image });
    setShowBlogModal(true);
  }

  function saveBlog() {
    if (!blogForm.title.trim()) return;
    setBlogs(prev => prev.map(b => b.id === editingBlogId ? { ...b, title: blogForm.title.trim(), author: blogForm.author.trim(), category: blogForm.category.trim(), content: blogForm.content.trim(), image: blogForm.imagePreview } : b));
    setEditingBlogId(null);
    setBlogForm(emptyBlogForm);
    setShowBlogModal(false);
    showToast('Blog updated');
  }

  function closeBlogModal() {
    setShowBlogModal(false);
    setEditingBlogId(null);
    setBlogForm(emptyBlogForm);
  }

  function toggleBlogStatus(id) {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'published' ? 'draft' : 'published' } : b));
    showToast('Blog status updated');
  }

  // Therapist blog approval handlers
  function approveTherapistBlog(id) {
    const blog = therapistBlogs.find(b => b.id === id);
    if (!blog) return;
    setBlogs(prev => [{ ...blog, status: 'published', date: new Date().toISOString().split('T')[0] }, ...prev]);
    setTherapistBlogs(prev => prev.filter(b => b.id !== id));
    setReviewBlog(null);
    showToast('Blog approved and published');
  }

  function openDeclineModal(blog) {
    setDeclineTarget(blog);
    setDeclineFeedback('');
    setShowDeclineModal(true);
  }

  function confirmDecline() {
    if (!declineTarget) return;
    setTherapistBlogs(prev => prev.map(b => b.id === declineTarget.id ? { ...b, status: 'declined', feedback: declineFeedback.trim() } : b));
    setShowDeclineModal(false);
    setDeclineTarget(null);
    setDeclineFeedback('');
    setReviewBlog(null);
    showToast('Blog declined with feedback');
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
  const pendingApprovals = therapistBlogs.filter(b => b.status === 'pending');

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Content Management</h1>
        <p className="page-header__subtitle">Manage blogs, FAQs, and footer content across the platform.</p>
      </div>

      <div className="sessions-tabs" style={{ marginBottom: 24 }}>
        {contentTabs.map(tab => (
          <button key={tab} className={`sessions-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ position: 'relative' }}>
            {tab === 'faqs' ? 'FAQs' : tab === 'approvals' ? 'Approve Therapist Blogs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'approvals' && pendingApprovals.length > 0 && (
              <span style={{ marginLeft: 8, background: 'var(--danger)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{pendingApprovals.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ─── BLOGS ─── */}
      {activeTab === 'blogs' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>{blogs.length} articles &middot; {blogs.filter(b => b.status === 'published').length} published</div>
            <button className="btn btn--primary btn--sm" onClick={() => { setEditingBlogId(null); setBlogForm(emptyBlogForm); setShowBlogModal(true); }}>Add Blog</button>
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
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {b.image && <img src={b.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />}
                        {b.title}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--primary)' }}>{b.author}</td>
                    <td style={{ padding: '12px' }}><span className="tag">{b.category}</span></td>
                    <td style={{ padding: '12px', color: 'var(--text-sec)' }}>{b.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`tag ${b.status === 'published' ? 'tag--success' : 'tag--warning'}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn--outline btn--xs" onClick={() => startEditBlog(b)}>Edit</button>
                        <button className="btn btn--outline btn--xs" onClick={() => toggleBlogStatus(b.id)}>
                          {b.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Blog Add/Edit Modal */}
          {showBlogModal && (
            <div className="modal-overlay" onClick={closeBlogModal}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, maxHeight: '85vh', overflow: 'auto' }}>
                <button className="modal__close" onClick={closeBlogModal}>&times;</button>
                <h3 className="modal__title">{editingBlogId ? 'Edit Blog Article' : 'Add Blog Article'}</h3>
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

                  {/* Cover Image */}
                  <div>
                    <label className="form-label">Cover Image</label>
                    {blogForm.imagePreview ? (
                      <div style={{ position: 'relative', marginBottom: 8 }}>
                        <img src={blogForm.imagePreview} alt="Cover preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                        <button
                          onClick={removeBlogImage}
                          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}
                        >&times;</button>
                      </div>
                    ) : (
                      <div
                        onClick={() => blogImageRef.current?.click()}
                        style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 6 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Click to upload a cover image</div>
                        <div style={{ fontSize: 11, marginTop: 2 }}>JPG, PNG or WebP</div>
                      </div>
                    )}
                    <input ref={blogImageRef} type="file" accept="image/*" onChange={handleBlogImage} style={{ display: 'none' }} />
                  </div>

                  {/* Content Body */}
                  <div>
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Write the full blog article here..."
                      value={blogForm.content}
                      onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                      style={{ minHeight: 180, lineHeight: 1.7, fontSize: 14 }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn--ghost btn--md btn--full" onClick={closeBlogModal}>Cancel</button>
                  <button className="btn btn--primary btn--md btn--full" onClick={editingBlogId ? saveBlog : addBlog}>
                    {editingBlogId ? 'Save Changes' : 'Add Blog'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── APPROVE THERAPIST BLOGS ─── */}
      {activeTab === 'approvals' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>
              {pendingApprovals.length} pending &middot; {therapistBlogs.filter(b => b.status === 'declined').length} declined
            </div>
          </div>

          {therapistBlogs.length === 0 ? (
            <div className="card card--no-hover" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>&#10003;</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>All caught up!</div>
              <div style={{ fontSize: 14, color: 'var(--text-sec)' }}>No therapist blog submissions to review.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {therapistBlogs.map(b => (
                <div key={b.id} className="card card--no-hover" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {b.image && (
                      <div style={{ width: 140, minHeight: 100, flexShrink: 0 }}>
                        <img src={b.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: 20, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{b.title}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>{b.author}</span>
                            {b.category && <span className="tag">{b.category}</span>}
                            <span className={`tag ${b.status === 'pending' ? 'tag--warning' : 'tag--danger'}`}>
                              {b.status === 'pending' ? 'Pending Review' : 'Declined'}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.date}</span>
                          </div>
                          <div style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {b.content}
                          </div>
                          {b.status === 'declined' && b.feedback && (
                            <div style={{ marginTop: 8, padding: 8, background: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
                              <strong>Feedback sent:</strong> {b.feedback}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button className="btn btn--ghost btn--xs" onClick={() => setReviewBlog(b)}>Review</button>
                          {b.status === 'pending' && (
                            <>
                              <button className="btn btn--primary btn--xs" onClick={() => approveTherapistBlog(b.id)}>Approve</button>
                              <button className="btn btn--danger-outline btn--xs" onClick={() => openDeclineModal(b)}>Decline</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Modal */}
          {reviewBlog && (
            <div className="modal-overlay" onClick={() => setReviewBlog(null)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: '85vh', overflow: 'auto' }}>
                <button className="modal__close" onClick={() => setReviewBlog(null)}>&times;</button>
                {reviewBlog.image && (
                  <img src={reviewBlog.image} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} />
                )}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  {reviewBlog.category && <span className="tag">{reviewBlog.category}</span>}
                  <span className={`tag ${reviewBlog.status === 'pending' ? 'tag--warning' : 'tag--danger'}`}>
                    {reviewBlog.status === 'pending' ? 'Pending Review' : 'Declined'}
                  </span>
                </div>
                <h3 className="modal__title" style={{ marginBottom: 6 }}>{reviewBlog.title}</h3>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>By {reviewBlog.author} &middot; Submitted {reviewBlog.date}</div>
                <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-sec)', whiteSpace: 'pre-wrap', marginBottom: 24 }}>{reviewBlog.content}</div>

                {reviewBlog.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <button className="btn btn--ghost btn--md btn--full" onClick={() => { openDeclineModal(reviewBlog); }}>Decline with Feedback</button>
                    <button className="btn btn--primary btn--md btn--full" onClick={() => approveTherapistBlog(reviewBlog.id)}>Approve &amp; Publish</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decline Feedback Modal */}
          {showDeclineModal && (
            <div className="modal-overlay" onClick={() => setShowDeclineModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
                <button className="modal__close" onClick={() => setShowDeclineModal(false)}>&times;</button>
                <h3 className="modal__title">Decline Blog Submission</h3>
                <p style={{ fontSize: 14, color: 'var(--text-sec)', marginTop: 8, marginBottom: 16 }}>
                  Provide feedback to <strong>{declineTarget?.author}</strong> explaining why their article
                  &ldquo;{declineTarget?.title}&rdquo; was not approved. They will be able to revise and resubmit.
                </p>
                <div>
                  <label className="form-label">Feedback</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Great topic, but please add more evidence-based references and expand the practical strategies section..."
                    value={declineFeedback}
                    onChange={e => setDeclineFeedback(e.target.value)}
                    style={{ minHeight: 120, lineHeight: 1.6 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn--ghost btn--md btn--full" onClick={() => setShowDeclineModal(false)}>Cancel</button>
                  <button className="btn btn--danger btn--md btn--full" onClick={confirmDecline}>Decline Blog</button>
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
