import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useToast } from '../components/Toast';

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function NotifIcon({ type }) {
  if (type === 'success') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'warning') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 5v3m0 2.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  // info (default)
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 5v3m0 2.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Notifications() {
  const showToast = useToast();
  const { loadNotifCount } = useOutletContext();
  const [notifications, setNotifications] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch {
      setError(true);
    }
  }

  async function markNotifRead(id) {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      loadNotifCount();
    } catch {
      // silently fail
    }
  }

  async function markAllRead() {
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      loadNotifCount();
      showToast('All notifications marked as read');
    } catch {
      showToast('Failed to mark all as read', 'error');
    }
  }

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-header__title">Notifications</h1>
          <p className="page-header__subtitle">Stay updated on your sessions and account activity.</p>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={markAllRead}>Mark all as read</button>
      </div>

      {error && <p>Error loading notifications.</p>}

      {!error && notifications === null && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>
      )}

      {!error && notifications !== null && notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__title">No notifications</div>
          <p className="empty-state__desc">You're all caught up!</p>
        </div>
      )}

      {!error && notifications !== null && notifications.length > 0 && (
        <div>
          {notifications.map(n => (
            <div
              key={n.id}
              className={`notif-item ${n.read ? '' : 'unread'}`}
              onClick={() => markNotifRead(n.id)}
            >
              <div className={`notif-item__icon notif-item__icon--${n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'}`}>
                <NotifIcon type={n.type} />
              </div>
              <div className="notif-item__content">
                <div className="notif-item__title">{n.title}</div>
                <div className="notif-item__message">{n.message}</div>
                <div className="notif-item__time">{timeAgo(n.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
