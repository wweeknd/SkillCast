'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { PROJECTS, USERS, CURRENT_USER_ID, getAvatarInitials, getMatchColor, getUserById, JOIN_REQUESTS } from '../../../lib/data';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const project = PROJECTS.find(p => p.id === id);
    const [tab, setTab] = useState<'overview' | 'team' | 'roles' | 'apply'>('overview');
    const [applyRole, setApplyRole] = useState('');
    const [intro, setIntro] = useState('');
    const [whyJoin, setWhyJoin] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!project) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div style={{ fontSize: '3rem' }}>🔍</div>
                <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800 }}>Project not found</h2>
                <Link href="/dashboard/explore" className="btn-primary">Browse Projects</Link>
            </div>
        );
    }

    const creator = getUserById(project.creatorId)!;
    const members = project.memberIds.map(mid => getUserById(mid)!).filter(Boolean);
    const isCurrentUserMember = project.memberIds.includes(CURRENT_USER_ID);
    const hasApplied = JOIN_REQUESTS.some(jr => jr.projectId === project.id && jr.userId === CURRENT_USER_ID);
    const openRoles = project.roles.filter(r => r.filled < r.count);

    const catColors: Record<string, string> = {
        'AI/ML': '#7c5cfc', 'Software': '#4f9eff', 'Video Game': '#ec4899',
        'Startup': '#22c55e', 'Creative': '#f97316', 'Research': '#22d3ee',
    };
    const catColor = catColors[project.category] || '#7c5cfc';

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Back */}
            <Link href="/dashboard/explore" className="btn-ghost" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
                ← Back to Explore
            </Link>

            {/* Header card */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <span style={{ padding: '0.25rem 0.875rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44` }}>
                                {project.category}
                            </span>
                            <span className={project.status === 'recruiting' ? 'status-recruiting' : project.status === 'in-progress' ? 'status-progress' : 'status-completed'}
                                style={{ padding: '0.25rem 0.875rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, border: '1px solid' }}>
                                {project.status === 'recruiting' ? '● Actively Recruiting' : project.status === 'in-progress' ? '◐ In Progress' : '✓ Completed'}
                            </span>
                        </div>
                        <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>{project.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{project.shortDescription}</p>

                        {/* Meta */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <span>🕐 {project.timeline}</span>
                            <span>💼 {project.commitment}</span>
                            <span>💰 {project.compensation.charAt(0).toUpperCase() + project.compensation.slice(1)}</span>
                            <span>{project.remote ? '🌐 Remote' : '📍 Local'}</span>
                            <span>👥 {project.memberIds.length}/{project.maxTeamSize} members</span>
                        </div>
                    </div>
                    {project.matchScore !== undefined && (
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '3rem', color: getMatchColor(project.matchScore), lineHeight: 1 }}>
                                {project.matchScore}%
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>match for you</div>
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '1.5rem' }}>
                    {project.tags.map(tag => <span key={tag} className="skill-tag">{tag}</span>)}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                {(['overview', 'team', 'roles', 'apply'] as const).map(t => (
                    <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}
                        style={{ textTransform: 'capitalize' }}>
                        {t === 'apply' ? (isCurrentUserMember ? '✓ Joined' : hasApplied ? '✓ Applied' : 'Apply to Join') : t}
                        {t === 'roles' && openRoles.length > 0 && (
                            <span style={{ marginLeft: '0.375rem', background: '#4ade8022', color: '#4ade80', borderRadius: 10, padding: '0 0.4rem', fontSize: '0.7rem', fontWeight: 700 }}>{openRoles.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab: Overview */}
            {tab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
                    <div>
                        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>About the Project</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{project.fullDescription}</p>
                        </div>

                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>Open Roles</h2>
                            {openRoles.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>All positions filled.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {openRoles.map(role => (
                                        <div key={role.id} style={{ padding: '1rem', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{role.title}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>{role.count - role.filled} open</span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                {role.skills.map(s => <span key={s} className="skill-tag" style={{ fontSize: '0.72rem' }}>{s}</span>)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Project Lead</h3>
                            <Link href={`/dashboard/profile/${creator.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                <div className="avatar" style={{ width: 44, height: 44, fontSize: '0.9rem', background: creator.avatarColor, flexShrink: 0 }}>
                                    {getAvatarInitials(creator.name)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{creator.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{creator.username}</div>
                                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                                        {'⭐'.repeat(Math.round(creator.reputation))}
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{creator.reputation}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {!isCurrentUserMember && project.status === 'recruiting' && (
                            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
                                id="apply-project-btn"
                                onClick={() => setTab('apply')}>
                                {hasApplied ? '✓ Request Sent' : 'Apply to Join →'}
                            </button>
                        )}

                        {isCurrentUserMember && (
                            <Link href="/dashboard/messages" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', textDecoration: 'none', textAlign: 'center' }}>
                                💬 Open Team Chat
                            </Link>
                        )}

                        <div className="card" style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Team Size</h3>
                            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                {Array.from({ length: project.maxTeamSize }).map((_, i) => (
                                    <div key={i} style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        background: i < project.memberIds.length ? 'var(--gradient-1)' : 'var(--border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                                    }}>
                                        {i < project.memberIds.length ? '👤' : ''}
                                    </div>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.625rem' }}>
                                {project.memberIds.length} of {project.maxTeamSize} positions filled
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Team */}
            {tab === 'team' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                    {members.map(member => (
                        <Link href={`/dashboard/profile/${member.id}`} key={member.id} style={{ textDecoration: 'none' }}>
                            <div className="card card-glow" style={{ padding: '1.5rem', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div className="avatar" style={{ width: 48, height: 48, fontSize: '1rem', background: member.avatarColor }}>
                                            {getAvatarInitials(member.name)}
                                        </div>
                                        {member.isOnline && <div className="online-dot" />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{member.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{member.username}</div>
                                    </div>
                                    {member.id === project.creatorId && (
                                        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'rgba(124,92,252,0.2)', color: '#9b7eff', padding: '0.2rem 0.5rem', borderRadius: 8, fontWeight: 700 }}>Lead</span>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.875rem' }}>{member.bio.slice(0, 90)}...</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                    {member.skills.slice(0, 3).map(s => <span key={s} className="skill-tag" style={{ fontSize: '0.7rem' }}>{s}</span>)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Tab: Roles */}
            {tab === 'roles' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {project.roles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No specific roles defined — message the creator directly.</div>
                    ) : project.roles.map(role => {
                        const isFull = role.filled >= role.count;
                        return (
                            <div key={role.id} className="card" style={{ padding: '1.5rem', opacity: isFull ? 0.6 : 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                            <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{role.title}</h3>
                                            {isFull ? (
                                                <span style={{ background: 'rgba(90,90,122,0.3)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600 }}>Full</span>
                                            ) : (
                                                <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600 }}>{role.count - role.filled} open</span>
                                            )}
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: 8 }}>{role.level}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                            {role.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                                        </div>
                                    </div>
                                    {!isFull && project.status === 'recruiting' && !isCurrentUserMember && (
                                        <button className="btn-primary" id={`apply-role-${role.id}`}
                                            onClick={() => { setApplyRole(role.id); setTab('apply'); }}>
                                            Apply for this Role
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tab: Apply */}
            {tab === 'apply' && (
                <div style={{ maxWidth: 600 }}>
                    {isCurrentUserMember ? (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>You&apos;re on this team!</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You already have access to the team chat and project workspace.</p>
                            <Link href="/dashboard/messages" className="btn-primary">Open Team Chat →</Link>
                        </div>
                    ) : submitted || hasApplied ? (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Request Sent!</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The project lead will review your request and get back to you. You&apos;ll get notified when they respond.</p>
                            <Link href="/dashboard/explore" className="btn-secondary">Browse More Projects</Link>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem', fontFamily: 'Space Grotesk' }}>Apply to Join {project.name}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Help the team understand who you are and why you&apos;re a great fit.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {project.roles.length > 0 && (
                                    <div>
                                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Which role are you applying for?</label>
                                        <select id="apply-role-select" className="input-field" value={applyRole} onChange={e => setApplyRole(e.target.value)}>
                                            <option value="">Select a role...</option>
                                            {project.roles.filter(r => r.filled < r.count).map(r => (
                                                <option key={r.id} value={r.id}>{r.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Introduction <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(who are you?)</span></label>
                                    <textarea id="apply-intro" className="input-field" rows={3}
                                        placeholder="Tell the project creator a bit about yourself — your background, what you've built, and what drives you."
                                        value={intro} onChange={e => setIntro(e.target.value)}
                                        style={{ resize: 'vertical', fontFamily: 'Inter' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Why do you want to join?</label>
                                    <textarea id="apply-why" className="input-field" rows={3}
                                        placeholder="What excites you about this project specifically? Why are you a great fit for this team?"
                                        value={whyJoin} onChange={e => setWhyJoin(e.target.value)}
                                        style={{ resize: 'vertical', fontFamily: 'Inter' }} />
                                </div>

                                <button id="submit-apply-btn" className="btn-primary"
                                    style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.95rem' }}
                                    onClick={() => { if (intro && whyJoin) setSubmitted(true); }}
                                    disabled={!intro || !whyJoin}>
                                    Send Join Request →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
