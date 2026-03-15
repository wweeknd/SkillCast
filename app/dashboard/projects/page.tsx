'use client';
import Link from 'next/link';
import { PROJECTS, CURRENT_USER_ID, getAvatarInitials, getUserById } from '../../lib/data';

export default function MyProjectsPage() {
    const myProjects = PROJECTS.filter(p => p.memberIds.includes(CURRENT_USER_ID) || p.creatorId === CURRENT_USER_ID);
    const leading = PROJECTS.filter(p => p.creatorId === CURRENT_USER_ID);
    const joined = PROJECTS.filter(p => p.memberIds.includes(CURRENT_USER_ID) && p.creatorId !== CURRENT_USER_ID);

    const catColors: Record<string, string> = {
        'AI/ML': '#7c5cfc', 'Software': '#4f9eff', 'Video Game': '#ec4899',
        'Startup': '#22c55e', 'Creative': '#f97316', 'Research': '#22d3ee',
    };

    function ProjectList({ projects }: { projects: typeof PROJECTS }) {
        if (!projects.length) return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 16 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>None yet</p>
                <Link href="/dashboard/explore" style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>Browse projects to join →</Link>
            </div>
        );
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {projects.map(project => {
                    const catColor = catColors[project.category] || '#7c5cfc';
                    const creator = getUserById(project.creatorId);
                    const openRoles = project.roles.reduce((s, r) => s + (r.count - r.filled), 0);
                    return (
                        <Link href={`/dashboard/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${catColor}22`, border: `1px solid ${catColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                                    {project.category === 'AI/ML' ? '🤖' : project.category === 'Video Game' ? '🎮' : project.category === 'Startup' ? '🚀' : project.category === 'Creative' ? '🎨' : project.category === 'Research' ? '🔬' : '💻'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{project.name}</h3>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: catColor, padding: '0.1rem 0.5rem', borderRadius: 10, background: `${catColor}22` }}>{project.category}</span>
                                        {project.creatorId === CURRENT_USER_ID && (
                                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fbbf24', padding: '0.1rem 0.5rem', borderRadius: 10, background: 'rgba(251,191,36,0.15)' }}>Creator</span>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.4 }}>{project.shortDescription.slice(0, 100)}...</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem', flexShrink: 0 }}>
                                    <span className={project.status === 'recruiting' ? 'status-recruiting' : project.status === 'in-progress' ? 'status-progress' : 'status-completed'}
                                        style={{ padding: '0.2rem 0.65rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, border: '1px solid' }}>
                                        {project.status === 'recruiting' ? '● Recruiting' : project.status === 'in-progress' ? '◐ In Progress' : '✓ Completed'}
                                    </span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        👥 {project.memberIds.length}/{project.maxTeamSize}
                                        {openRoles > 0 && <span style={{ color: '#4ade80', marginLeft: '0.5rem' }}>+{openRoles} open</span>}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>My Projects</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Projects you&apos;re leading or part of</p>
                </div>
                <Link href="/dashboard/projects/new" className="btn-primary" id="create-project-btn">+ Create Project</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Projects', value: myProjects.length, icon: '📁', color: 'var(--accent)' },
                    { label: 'Leading', value: leading.length, icon: '👑', color: '#fbbf24' },
                    { label: 'Collaborating', value: joined.length, icon: '🤝', color: '#06b6d4' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👑 Projects I&apos;m Leading
                <span style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', borderRadius: 20, padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>{leading.length}</span>
            </h2>
            <ProjectList projects={leading} />

            <div className="divider" />

            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🤝 Projects I&apos;m In
                <span style={{ background: 'rgba(6,182,212,0.12)', color: '#0891b2', borderRadius: 20, padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>{joined.length}</span>
            </h2>
            <ProjectList projects={joined} />
        </div>
    );
}
