import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [description, setDescription] = useState(user?.description || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  if (!user) return null;

  async function handleProfileSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone, description }),
      });
      if (res.ok) {
        await updateUser();
        showToast('Profile updated!');
      }
    } catch {
      showToast('Failed to update profile', 'error');
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Password updated!');
        setCurrentPw(''); setNewPw('');
      } else {
        showToast(data.error, 'error');
      }
    } catch {
      showToast('Failed to update password', 'error');
    }
  }

  const initial = user.first_name[0].toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="page-header">
        <h1 className="page-header__title">My Profile</h1>
        <p className="page-header__subtitle">Manage your account details and preferences.</p>
      </div>

      <div className="profile-header">
        <div className="profile-avatar" style={{ background: user.avatar_color }}>{initial}</div>
        <div className="profile-info">
          <div className="profile-info__name">{user.first_name} {user.last_name}</div>
          <div className="profile-info__email">{user.email}</div>
          <div className="profile-info__since">
            {user.org_name && <>{user.org_name} &middot; {user.role === 'admin' ? 'Admin' : 'Employee'} &middot; </>}
            Member since {memberSince}
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card card--no-hover">
          <div className="card__title">Personal Information</div>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-input" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-input" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+44 7XXX XXXXXX" />
            </div>
            <div className="form-group">
              <label className="form-label">About Me</label>
              <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell your therapist a little about yourself..." />
            </div>
            <button type="submit" className="btn btn--primary btn--md">Save Changes</button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card card--no-hover">
            <div className="card__title">Change Password</div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength="8" placeholder="At least 8 characters" />
              </div>
              <button type="submit" className="btn btn--outline btn--md">Update Password</button>
            </form>
          </div>

          <div className="self-test-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/self-test')}>
            <h3>Take the Self-Test</h3>
            <p>A free, confidential 5-minute mood assessment to understand how you've been feeling.</p>
            <button className="btn btn--white btn--sm" onClick={e => { e.stopPropagation(); navigate('/app/self-test'); }}>Start Assessment</button>
          </div>
        </div>
      </div>
    </>
  );
}
