'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { USERS, NOTIFICATIONS, MESSAGES, CURRENT_USER_ID, getAvatarInitials } from '../lib/data';

const currentUser = USERS.find(u => u.id === CURRENT_USER_ID)!;
const unreadNotifs = NOTIFICATIONS.filter(n => n.userId === CURRENT_USER_ID && !n.read).length;
const unreadMessages = MESSAGES.filter(m => m.recipientId === CURRENT_USER_ID).length;

const NAV = [
    {
        href: '/dashboard', label: 'Home', icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ), exact: true
    },
    {
        href: '/dashboard/explore', label: 'Explore', icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
        )
    },
    {
        href: '/dashboard/projects', label: 'My Projects', icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        href: '/dashboard/messages', label: 'Messages', badge: unreadMessages, icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        href: '/dashboard/notifications', label: 'Notifications', badge: unreadNotifs, icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        )
    },
    {
        href: '/dashboard/search', label: 'Search', icon: (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
        )
    },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            {/* Top Navigation Bar */}
            <header style={{
                height: 64,
                background: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                flexShrink: 0,
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <span style={{ fontSize: 20, lineHeight: 1 }}>⚡</span>
                        <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>SkillCast</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {NAV.map(item => {
                            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                            return (
                                <Link key={item.href} href={item.href} id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                    style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                                    <span style={{ fontSize: '0.9375rem' }}>{item.label}</span>
                                    {(item.badge ?? 0) > 0 && (
                                        <span style={{
                                            minWidth: 18, height: 18, borderRadius: 9, background: 'var(--text-primary)',
                                            color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right side: Account & User */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link href={`/dashboard/profile/${CURRENT_USER_ID}`} className={`btn-ghost ${pathname.includes('/profile') ? 'active' : ''}`} style={{ padding: '0.5rem' }} title="My Profile">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </Link>
                        <Link href="/dashboard/settings" className={`btn-ghost ${pathname === '/dashboard/settings' ? 'active' : ''}`} style={{ padding: '0.5rem' }} title="Settings">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        </Link>
                    </div>

                    <div style={{ height: 24, width: 1, background: 'var(--border)', margin: '0 0.25rem' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ textAlign: 'right' }} className="hidden-mobile">
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online</div>
                        </div>
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', background: currentUser.avatarColor }}>
                            {getAvatarInitials(currentUser.name)}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main style={{ flex: 1, minWidth: 0, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>
        </div>
    );
}
