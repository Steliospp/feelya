import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

const mockProfile = {
  name: 'Dr. Sarah Mitchell',
  title: 'Clinical Psychologist',
  accreditation: 'HCPC',
  specialisations: ['Anxiety', 'Depression', 'Stress', 'CBT'],
  languages: ['English'],
  gender: 'Female',
  bio: 'Dr. Mitchell is a clinical psychologist with over 15 years of experience helping individuals navigate anxiety, depression, and stress. She uses evidence-based approaches including CBT and mindfulness techniques.',
  videoPrice: 90,
  audioPrice: 90,
  introVideoPrice: 45,
  introAudioPrice: 45,
  videoDuration: 50,
  audioDuration: 50,
  introDuration: 30,
  sessionType: 'both',
  nextAvailable: 'Today, 6:00 PM',
};

export default function TherapistProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(mockProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const initial = (user.first_name || 'T')[0].toUpperCase();

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">My Profile</h1>
        <p className="page-header__subtitle">Manage your therapist profile visible to clients</p>
      </div>

      <div className="profile-header">
        <div className="profile-avatar" style={{ background: user.avatar_color }}>{initial}</div>
        <div>
          <div className="profile-info__name">{profile.name}</div>
          <div className="profile-info__email">{profile.title} · {profile.accreditation}</div>
          <div className="profile-info__since" style={{ marginTop: 8 }}>
            {profile.specialisations.map((s) => (
              <span key={s} className="tag" style={{ marginRight: 6, marginBottom: 4 }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {!editing ? (
            <button className="btn btn--outline btn--sm" onClick={() => setEditing(true)}>Edit Profile</button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn--primary btn--sm" onClick={handleSave}>Save Changes</button>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div style={{
          padding: '12px 20px',
          background: 'var(--success-bg)',
          color: '#059669',
          borderRadius: 'var(--radius)',
          fontWeight: 500,
          fontSize: 14,
          marginBottom: 24,
        }}>
          Profile updated successfully.
        </div>
      )}

      <div className="profile-grid">
        <div className="card card--no-hover">
          <div className="card__title">About</div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            {editing ? (
              <textarea
                className="form-textarea"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={5}
              />
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-sec)', lineHeight: 1.7 }}>{profile.bio}</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Languages</label>
            {editing ? (
              <input
                className="form-input"
                value={profile.languages.join(', ')}
                onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(',').map((l) => l.trim()) })}
              />
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-sec)' }}>{profile.languages.join(', ')}</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Specialisations</label>
            {editing ? (
              <input
                className="form-input"
                value={profile.specialisations.join(', ')}
                onChange={(e) => setProfile({ ...profile, specialisations: e.target.value.split(',').map((s) => s.trim()) })}
              />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profile.specialisations.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card card--no-hover">
          <div className="card__title">Pricing & Availability</div>
          <div className="form-group">
            <label className="form-label">Standard Video Session (£)</label>
            {editing ? (
              <input
                className="form-input"
                type="number"
                value={profile.videoPrice}
                onChange={(e) => setProfile({ ...profile, videoPrice: Number(e.target.value) })}
              />
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-sec)' }}>£{profile.videoPrice} / {profile.videoDuration}min</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Standard Audio Session (£)</label>
            {editing ? (
              <input
                className="form-input"
                type="number"
                value={profile.audioPrice}
                onChange={(e) => setProfile({ ...profile, audioPrice: Number(e.target.value) })}
              />
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-sec)' }}>£{profile.audioPrice} / {profile.audioDuration}min</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Intro Video Session (£)</label>
            {editing ? (
              <input
                className="form-input"
                type="number"
                value={profile.introVideoPrice}
                onChange={(e) => setProfile({ ...profile, introVideoPrice: Number(e.target.value) })}
              />
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-sec)' }}>£{profile.introVideoPrice} / {profile.introDuration}min</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Intro Audio Session (£)</label>
            {editing ? (
              <input
                className="form-input"
                type="number"
                value={profile.introAudioPrice}
                onChange={(e) => setProfile({ ...profile, introAudioPrice: Number(e.target.value) })}
              />
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-sec)' }}>£{profile.introAudioPrice} / {profile.introDuration}min</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Session Types</label>
            {editing ? (
              <select
                className="form-input"
                value={profile.sessionType}
                onChange={(e) => setProfile({ ...profile, sessionType: e.target.value })}
              >
                <option value="both">Video & Audio</option>
                <option value="video">Video Only</option>
                <option value="audio">Audio Only</option>
              </select>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-sec)' }}>
                {profile.sessionType === 'both' ? 'Video & Audio' : profile.sessionType === 'video' ? 'Video Only' : 'Audio Only'}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Next Available</label>
            <p style={{ fontSize: 14, color: 'var(--success)', fontWeight: 600 }}>{profile.nextAvailable}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
