'use client';
import { useState } from 'react';
import Link from 'next/link';
import { USERS, PROJECTS, CURRENT_USER_ID, getMatchColor, getAvatarInitials } from '../lib/data';

const currentUser = USERS.find(u => u.id === CURRENT_USER_ID)!;
const matchedProjects = PROJECTS.filter(p => !p.memberIds.includes(CURRENT_USER_ID)).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
const lookingBuilders = USERS.filter(u => u.availability === 'looking' && u.id !== CURRENT_USER_ID).slice(0, 4);

const catColors: Record<string, string> = {
    'AI/ML': '#0066cc', 'Software': '#34c759', 'Video Game': '#f59e0b',
    'Startup': '#8b5cf6', 'Creative': '#ef4444', 'Research': '#06b6d4',
};

function MatchRing({ score }: { score: number }) {
    const r = 18, circ = 2 * Math.PI * r;
    const fill = (score / 100) * circ;
    const color = score >= 80 ? '#34c759' : score >= 60 ? '#f59e0b' : '#a1a1a6';
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="3.5" />
            <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3.5"
                strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
            <text x="22" y="22" textAnchor="middle" dominantBaseline="central"
                style={{ fill: color, fontSize: 9.5, fontWeight: 700, transform: 'rotate(90deg)', transformOrigin: '22px 22px', fontFamily: '-apple-system' }}>
                {score}%
            </text>
        </svg>
    );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
    const creator = USERS.find(u => u.id === project.creatorId)!;
    const catColor = catColors[project.category] || '#6e6e73';

    return (
        <Link href={`/dashboard/projects/${project.id}`} style={{ textDecoration: 'none' }}>
            <div className="card-interactive" style={{ padding: '1.375rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.125rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: catColor }}>{project.category}</span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border-dark)', display: 'inline-block' }} />
                        <span className={`badge ${project.status === 'recruiting' ? 'badge-green' : project.status === 'in-progress' ? 'badge-yellow' : 'badge-blue'}`}>
                            {project.status === 'recruiting' ? 'Recruiting' : project.status === 'in-progress' ? 'In Progress' : 'Complete'}
                        </span>
                    </div>
                    {project.matchScore !== undefined && <MatchRing score={project.matchScore} />}
                </div>

                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{project.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.125rem' }}>{project.shortDescription}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.125rem' }}>
                    {project.tags.slice(0, 3).map(t => <span key={t} className="skill-tag">{t}</span>)}
                    {project.tags.length > 3 && <span className="skill-tag">+{project.tags.length - 3}</span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="avatar" style={{ width: 22, height: 22, fontSize: '0.6rem', background: creator.avatarColor }}>
                            {getAvatarInitials(creator.name)}
                        </div>
                        <span>{creator.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span>{project.commitment}</span>
                        <span>{project.remote ? '🌐 Remote' : '📍 Local'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function DashboardHome() {
    const [feed, setFeed] = useState<'recommended' | 'recent' | 'trending'>('recommended');

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
            {/* Welcome */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                            Good morning, {currentUser.name.split(' ')[0]} 👋
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                            {matchedProjects.length} new projects match your skills today.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                        <Link href="/dashboard/projects/new" className="btn-primary" id="post-project-btn">+ Post a Project</Link>
                        <Link href={`/dashboard/profile/${CURRENT_USER_ID}`} className="btn-outline" id="edit-profile-btn">Edit Profile</Link>
                    </div>
                </div>
            </div>

            {/* Your skills + stats */}
            <div className="card-flat" style={{ padding: '1.375rem 1.625rem', marginBottom: '2.5rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <p className="section-label" style={{ marginBottom: '0.5rem' }}>Your skills</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {currentUser.skills.map((s, i) => (
                            <span key={s} className={`skill-tag ${i === 0 ? 'skill-tag-accent' : ''}`}>{s}</span>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', flexShrink: 0 }}>
                    {[
                        { val: currentUser.reputation, label: 'Reputation', color: '#f59e0b' },
                        { val: currentUser.projectsCompleted, label: 'Completed', color: '#0066cc' },
                        { val: `${currentUser.hoursPerWeek}h`, label: 'Per week', color: '#34c759' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 750, letterSpacing: '-0.03em', color: s.color }}>{s.val}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feed grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div>
                            <h2 style={{ fontWeight: 700, fontSize: '1.1875rem', letterSpacing: '-0.02em' }}>Matched for You</h2>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                Based on: {currentUser.skills.slice(0, 3).join(', ')}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-secondary)', borderRadius: 980, padding: '0.2rem' }}>
                            {(['recommended', 'recent', 'trending'] as const).map(f => (
                                <button key={f} onClick={() => setFeed(f)} className={`tab ${feed === f ? 'active' : ''}`}
                                    style={{ fontSize: '0.8125rem', padding: '0.3rem 0.875rem', borderRadius: 980 }}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.875rem' }}>
                        {matchedProjects.slice(0, 6).map(p => <ProjectCard key={p.id} project={p} />)}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link href="/dashboard/explore" className="btn-outline" id="view-all-btn">View all projects →</Link>
                    </div>
                </div>

                {/* Sidebar: Builders */}
                <div>
                    <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '1rem' }}>Builders Looking</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {lookingBuilders.map(user => (
                            <Link href={`/dashboard/profile/${user.id}`} key={user.id} style={{ textDecoration: 'none' }}>
                                <div className="card-interactive" style={{ padding: '1rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        <div className="avatar" style={{ width: 38, height: 38, fontSize: '0.8rem', background: user.avatarColor }}>
                                            {getAvatarInitials(user.name)}
                                        </div>
                                        {user.isOnline && <div className="online-dot" style={{ width: 9, height: 9 }} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.125rem' }}>{user.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>@{user.username}</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {user.skills.slice(0, 2).map(s => <span key={s} className="skill-tag" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>{s}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Link href="/dashboard/search?filter=looking" className="btn-ghost" style={{ marginTop: '0.75rem', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem 0' }}>
                        View all builders →
                    </Link>
                </div>
            </div>
        </div>
    );
}
