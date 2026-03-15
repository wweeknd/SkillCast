'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { USERS, PROJECTS, CURRENT_USER_ID, getAvatarInitials } from '../../../lib/data';

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const user = USERS.find(u => u.id === id);
    const [tab, setTab] = useState<'about' | 'history' | 'projects'>('about');

    if (!user) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div style={{ fontSize: '3rem' }}>👤</div>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800 }}>User not found</h2>
                <Link href="/dashboard/search" className="btn-primary">Search People</Link>
            </div>
        );
    }

    const isOwnProfile = user.id === CURRENT_USER_ID;
    const userProjects = PROJECTS.filter(p => p.memberIds.includes(user.id));
    const completedProjects = user.collaborationHistory.filter(h => h.status === 'completed');
    const avgRating = completedProjects.length > 0
        ? (completedProjects.reduce((s, h) => s + h.rating, 0) / completedProjects.length).toFixed(1)
        : null;

    const availabilityConfig = {
        looking: { label: '● Looking for Project', color: '#4ade80', bg: 'rgba(34,197,94,0.15)' },
        leading: { label: '◆ Leading a Project', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
        unavailable: { label: '○ Not Available', color: 'var(--text-muted)', bg: 'var(--bg-secondary)' },
    };
    const avail = availabilityConfig[user.availability];

    const levelColors = { beginner: '#4ade80', intermediate: '#4f9eff', advanced: '#7c5cfc', expert: '#fbbf24' };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Profile header */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                {/* BG gradient */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: `linear-gradient(135deg, ${user.avatarColor}22 0%, transparent 100%)`, pointerEvents: 'none' }} />

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div className="avatar" style={{ width: 80, height: 80, fontSize: '1.75rem', background: user.avatarColor }}>
                            {getAvatarInitials(user.name)}
                        </div>
                        {user.isOnline && <div className="online-dot" style={{ width: 14, height: 14, border: '3px solid var(--bg-card)' }} />}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '1.7rem', letterSpacing: '-0.03em' }}>{user.name}</h1>
                            <span style={{ padding: '0.2rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: `${levelColors[user.level]}22`, color: levelColors[user.level], border: `1px solid ${levelColors[user.level]}44` }}>
                                {user.level}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>@{user.username}</p>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', borderRadius: 20, background: avail.bg, color: avail.color, fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.875rem', border: `1px solid ${avail.color}33` }}>
                            {avail.label}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, marginBottom: '1rem' }}>{user.bio}</p>

                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            {user.location && <span>📍 {user.location}</span>}
                            <span>🕐 {user.hoursPerWeek}h/week available</span>
                            {user.timezone && <span>🌐 {user.timezone}</span>}
                            <span>📅 Member since {new Date(user.joinedAt).getFullYear()}</span>
                        </div>

                        {/* External links */}
                        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                            {user.githubUrl && (
                                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem', borderRadius: 8 }}>
                                    GitHub →
                                </a>
                            )}
                            {user.websiteUrl && (
                                <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem', borderRadius: 8 }}>
                                    Website →
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flexShrink: 0 }}>
                        {isOwnProfile ? (
                            <Link href="/dashboard/settings" className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>Edit Profile</Link>
                        ) : (
                            <>
                                <Link href="/dashboard/messages" className="btn-primary">Message →</Link>
                                <button className="btn-secondary">Invite to Project</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', marginTop: '1.5rem', background: 'var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    {[
                        { label: 'Reputation', value: user.reputation, icon: '⭐', color: '#fbbf24' },
                        { label: 'Projects', value: user.projectsCompleted, icon: '📁', color: 'var(--accent)' },
                        { label: 'Teams', value: user.collaborationHistory.length, icon: '🤝', color: '#06b6d4' },
                        { label: 'Skills', value: user.skills.length, icon: '🛠', color: '#16a34a' },
                    ].map(stat => (
                        <div key={stat.label} style={{ padding: '1rem', background: 'var(--bg-card)', textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                {(['about', 'history', 'projects'] as const).map(t => (
                    <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
                ))}
            </div>

            {/* Tab: About */}
            {tab === 'about' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
                    <div>
                        <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Skills</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {user.skills.map((skill, i) => (
                                    <span key={skill} className={`skill-tag ${i % 3 === 0 ? '' : i % 3 === 1 ? 'skill-tag-blue' : 'skill-tag-cyan'}`} style={{ fontSize: '0.875rem' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {avgRating && (
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Reputation</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '3rem', color: '#fbbf24', lineHeight: 1 }}>{avgRating}</div>
                                    <div>
                                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} style={{ fontSize: '1.1rem', color: i < Math.round(parseFloat(avgRating)) ? '#fbbf24' : 'var(--text-muted)' }}>★</span>
                                            ))}
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>avg. from {completedProjects.length} projects</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card" style={{ padding: '1.25rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {[
                                { label: 'Experience', value: user.level.charAt(0).toUpperCase() + user.level.slice(1) },
                                { label: 'Availability', value: `${user.hoursPerWeek}h per week` },
                                { label: 'Location', value: user.location || 'Not specified' },
                                { label: 'Timezone', value: user.timezone || 'Not specified' },
                            ].map(d => (
                                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{d.label}</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: History */}
            {tab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {user.collaborationHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📜</div>
                            <p>No collaboration history yet.</p>
                        </div>
                    ) : user.collaborationHistory.map(history => (
                        <div key={history.projectId} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{history.projectName}</h3>
                                    <div style={{ display: 'flex', gap: '0.875rem', fontSize: '0.83rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                        <span>Role: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{history.role}</span></span>
                                        <span>Team of <span style={{ fontWeight: 600 }}>{history.teamSize}</span></span>
                                        <span>{history.year}</span>
                                        <span style={{ padding: '0.1rem 0.5rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600, background: 'rgba(124,92,252,0.15)', color: '#9b7eff' }}>{history.category}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} style={{ fontSize: '0.85rem', color: i < Math.round(history.rating) ? '#fbbf24' : 'var(--text-muted)' }}>★</span>
                                        ))}
                                    </div>
                                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24' }}>{history.rating}</div>
                                    <span className="status-completed" style={{ padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 600 }}>✓ Completed</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: Projects */}
            {tab === 'projects' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {userProjects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                            <p>No active projects.</p>
                        </div>
                    ) : userProjects.map(project => (
                        <Link href={`/dashboard/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                            <div className="card card-glow" style={{ padding: '1.25rem', cursor: 'pointer' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.375rem' }}>{project.name}</h3>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{project.shortDescription.slice(0, 80)}...</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    <span>{project.category}</span>
                                    <span className={project.status === 'recruiting' ? 'status-recruiting' : project.status === 'in-progress' ? 'status-progress' : 'status-completed'}
                                        style={{ padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 600 }}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
