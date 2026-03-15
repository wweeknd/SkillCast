'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { USERS, PROJECTS, getAvatarInitials, getMatchColor } from '../../lib/data';

type SearchMode = 'all' | 'projects' | 'people';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<SearchMode>('all');
    const [filterSkill, setFilterSkill] = useState('');

    const allSkills = Array.from(new Set(USERS.flatMap(u => u.skills))).sort();

    const projectResults = useMemo(() => {
        if (!query && !filterSkill) return PROJECTS;
        return PROJECTS.filter(p => {
            const q = query.toLowerCase();
            const skillMatch = !filterSkill || p.tags.some(t => t.toLowerCase() === filterSkill.toLowerCase()) || p.roles.some(r => r.skills.some(s => s.toLowerCase() === filterSkill.toLowerCase()));
            return skillMatch && (!q || p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.shortDescription.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        });
    }, [query, filterSkill]);

    const peopleResults = useMemo(() => {
        if (!query && !filterSkill) return USERS;
        return USERS.filter(u => {
            const q = query.toLowerCase();
            const skillMatch = !filterSkill || u.skills.some(s => s.toLowerCase() === filterSkill.toLowerCase());
            return skillMatch && (!q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.skills.some(s => s.toLowerCase().includes(q)) || u.bio.toLowerCase().includes(q));
        });
    }, [query, filterSkill]);

    const catColors: Record<string, string> = {
        'AI/ML': '#7c5cfc', 'Software': '#4f9eff', 'Video Game': '#ec4899',
        'Startup': '#22c55e', 'Creative': '#f97316', 'Research': '#22d3ee',
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>Search</h1>

            {/* Search input */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', pointerEvents: 'none' }}>🔍</span>
                <input id="main-search" className="input-field"
                    style={{ paddingLeft: '3.25rem', fontSize: '1.1rem', padding: '1rem 1rem 1rem 3.25rem', borderRadius: 14 }}
                    placeholder="Search projects, people, skills..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                />
                {query && (
                    <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                )}
            </div>

            {/* Mode toggle & Skill filter */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {(['all', 'projects', 'people'] as SearchMode[]).map(m => (
                    <button key={m} className={`tab ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}
                        style={{ textTransform: 'capitalize' }}>
                        {m}
                        {m === 'projects' && ` (${projectResults.length})`}
                        {m === 'people' && ` (${peopleResults.length})`}
                    </button>
                ))}
                <select id="search-skill-filter" className="input-field"
                    style={{ marginLeft: 'auto', width: 'auto', padding: '0.5rem 0.875rem', fontSize: '0.85rem' }}
                    value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
                    <option value="">All Skills</option>
                    {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Results */}
            {(mode === 'all' || mode === 'projects') && (
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Projects ({projectResults.length})
                    </h2>
                    {projectResults.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No projects found.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {(mode === 'all' ? projectResults.slice(0, 4) : projectResults).map(project => {
                                const catColor = catColors[project.category] || '#7c5cfc';
                                return (
                                    <Link href={`/dashboard/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                                        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${catColor}22`, border: `1px solid ${catColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                                                {project.category === 'AI/ML' ? '🤖' : project.category === 'Video Game' ? '🎮' : project.category === 'Startup' ? '🚀' : '💻'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{project.name}</span>
                                                    <span style={{ fontSize: '0.7rem', color: catColor, fontWeight: 600 }}>{project.category}</span>
                                                </div>
                                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{project.shortDescription}</p>
                                                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                    {project.tags.slice(0, 4).map(t => <span key={t} className="skill-tag" style={{ fontSize: '0.68rem' }}>{t}</span>)}
                                                </div>
                                            </div>
                                            {project.matchScore !== undefined && (
                                                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', color: getMatchColor(project.matchScore), flexShrink: 0 }}>{project.matchScore}%</div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                            {mode === 'all' && projectResults.length > 4 && (
                                <button onClick={() => setMode('projects')} className="btn-ghost" style={{ alignSelf: 'flex-start', color: 'var(--accent)', fontWeight: 600 }}>
                                    View all {projectResults.length} projects →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {(mode === 'all' || mode === 'people') && (
                <div>
                    <h2 style={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        People ({peopleResults.length})
                    </h2>
                    {peopleResults.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No people found.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                            {(mode === 'all' ? peopleResults.slice(0, 4) : peopleResults).map(user => (
                                <Link href={`/dashboard/profile/${user.id}`} key={user.id} style={{ textDecoration: 'none' }}>
                                    <div className="card card-glow" style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            <div className="avatar" style={{ width: 44, height: 44, fontSize: '0.9rem', background: user.avatarColor }}>
                                                {getAvatarInitials(user.name)}
                                            </div>
                                            {user.isOnline && <div className="online-dot" />}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.1rem' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>@{user.username}</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                {user.skills.slice(0, 3).map(s => <span key={s} className="skill-tag" style={{ fontSize: '0.68rem' }}>{s}</span>)}
                                                {user.skills.length > 3 && <span className="skill-tag" style={{ fontSize: '0.68rem', opacity: 0.6 }}>+{user.skills.length - 3}</span>}
                                            </div>
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.73rem', color: user.availability === 'looking' ? '#4ade80' : user.availability === 'leading' ? '#fbbf24' : 'var(--text-muted)', fontWeight: 600 }}>
                                                {user.availability === 'looking' ? '● Looking' : user.availability === 'leading' ? '◆ Leading' : '○ Unavailable'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {mode === 'all' && peopleResults.length > 4 && (
                                <button onClick={() => setMode('people')} className="btn-ghost" style={{ gridColumn: '1 / -1', color: 'var(--accent)', fontWeight: 600 }}>
                                    View all {peopleResults.length} people →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Popular skills */}
            {!query && !filterSkill && (
                <div style={{ marginTop: '2.5rem' }}>
                    <h2 style={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Search by skill
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {allSkills.slice(0, 20).map(skill => (
                            <button key={skill} onClick={() => { setFilterSkill(skill); setQuery(skill); }}
                                className="skill-tag" style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
