'use client';
import { useState } from 'react';
import Link from 'next/link';
import { NOTIFICATIONS, CURRENT_USER_ID, formatTimeAgo, getUserById, getAvatarInitials } from '../../lib/data';

const notifIcons: Record<string, string> = {
    join_request: '🤝',
    accepted: '✅',
    message: '💬',
    project_match: '⚡',
    rating: '⭐',
    invite: '📨',
};

// Muted, professional accent colors for each type
const notifColors: Record<string, string> = {
    join_request: '#8b5cf6',
    accepted: '#16a34a',
    message: '#0066cc',
    project_match: '#ea580c',
    rating: '#d97706',
    invite: '#db2777',
};

export default function NotificationsPage() {
    const [notifs, setNotifs] = useState(NOTIFICATIONS.filter(n => n.userId === CURRENT_USER_ID));
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;
    const unreadCount = notifs.filter(n => !n.read).length;

    function markAllRead() { setNotifs(ns => ns.map(n => ({ ...n, read: true }))); }
    function markRead(id: string) { setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n)); }

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        Notifications
                        {unreadCount > 0 && (
                            <span style={{ background: 'var(--text-primary)', color: 'white', borderRadius: 980, padding: '0.1rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{unreadCount} unread</p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn-outline" onClick={markAllRead} style={{ fontSize: '0.875rem' }}>
                        ✓ Mark all read
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 980, padding: '0.2rem', width: 'fit-content' }}>
                <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                <button className={`tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                </button>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {displayed.map(notif => {
                    const fromUser = notif.fromUserId ? getUserById(notif.fromUserId) : null;
                    const color = notifColors[notif.type];
                    return (
                        <div key={notif.id} id={`notif-${notif.id}`}
                            onClick={() => markRead(notif.id)}
                            style={{
                                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                                padding: '1rem 1.125rem',
                                background: notif.read ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                borderLeft: `3px solid ${notif.read ? 'transparent' : color}`,
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {/* Avatar / Icon */}
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                {fromUser ? (
                                    <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.85rem', background: fromUser.avatarColor }}>
                                        {getAvatarInitials(fromUser.name)}
                                    </div>
                                ) : (
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: `${color}14`,
                                        border: `1px solid ${color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                                    }}>
                                        {notifIcons[notif.type]}
                                    </div>
                                )}
                                {!notif.read && (
                                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, position: 'absolute', top: 0, right: 0, border: '2px solid white' }} />
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: notif.read ? 500 : 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        {notif.title}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                        {formatTimeAgo(notif.timestamp)}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                                    {notif.body}
                                </p>
                                {notif.actionUrl && (
                                    <Link href={notif.actionUrl} onClick={e => e.stopPropagation()}
                                        style={{ display: 'inline-flex', alignItems: 'center', marginTop: '0.5rem', color, fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>
                                        View →
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}

                {displayed.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔔</div>
                        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
                            {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                        </p>
                        <p style={{ fontSize: '0.875rem' }}>
                            {filter === 'unread' ? 'No unread notifications.' : 'Activity will appear here.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
