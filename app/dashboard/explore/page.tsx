'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PROJECTS, USERS, getAvatarInitials } from '../../lib/data';
import type { ProjectCategory } from '../../lib/data';

const catColors: Record<string, string> = {
    'AI/ML': '#0066cc', 'Software': '#34c759', 'Video Game': '#f59e0b',
    'Startup': '#8b5cf6', 'Creative': '#ef4444', 'Research': '#06b6d4',
};

function MatchRing({ score }: { score: number }) {
    const r = 16, circ = 2 * Math.PI * r;
    const fill = (score / 100) * circ;
    const color = score >= 80 ? '#34c759' : score >= 60 ? '#f59e0b' : '#a1a1a6';
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle cx="20" cy="20" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3"
                strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
            <text x="20" y="20" textAnchor="middle" dominantBaseline="central"
                style={{ fill: color, fontSize: 8.5, fontWeight: 700, transform: 'rotate(90deg)', transformOrigin: '20px 20px', fontFamily: '-apple-system' }}>
                {score}%
            </text>
        </svg>
    );
}

export default function ExplorePage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<ProjectCategory | ''>('');
    const [status, setStatus] = useState('');
    const [commitment, setCommitment] = useState('');
    const [compensation, setCompensation] = useState('');
    const [sort, setSort] = useState<'match' | 'recent' | 'size'>('match');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [activeCategory, setActiveCategory] = useState<ProjectCategory | ''>('');

    const filtered = useMemo(() => {
        let ps = PROJECTS.filter(p => {
            const cat = activeCategory || category;
            if (cat && p.category !== cat) return false;
            if (status && p.status !== status) return false;
            if (commitment && p.commitment !== commitment) return false;
            if (compensation && p.compensation !== compensation) return false;
            if (query) {
                const q = query.toLowerCase();
                return p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.shortDescription.toLowerCase().includes(q);
            }
            return true;
        });
        if (sort === 'match') ps = ps.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
        if (sort === 'recent') ps = ps.reverse();
        if (sort === 'size') ps = ps.sort((a, b) => b.maxTeamSize - a.maxTeamSize);
        return ps;
    }, [query, category, status, commitment, compensation, sort, activeCategory]);

    const CATEGORIES: ProjectCategory[] = ['Software', 'Video Game', 'Startup', 'AI/ML', 'Creative', 'Research'];

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Explore Projects</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{filtered.length} projects match your filters</p>
                    </div>
                    <Link href="/dashboard/projects/new" className="btn-primary" id="post-project-btn">+ Post Project</Link>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input id="explore-search" className="input-field"
                        style={{ paddingLeft: '2.75rem', fontSize: '0.9375rem' }}
                        placeholder="Search projects by name, skill, or description..."
                        value={query} onChange={e => setQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter:</span>
                    {[
                        { val: category, setter: setCategory, opts: ['', ...CATEGORIES], placeholder: 'All Categories' },
                        { val: status, setter: setStatus, opts: ['', 'recruiting', 'in-progress', 'completed'], placeholder: 'All Status' },
                        { val: commitment, setter: setCommitment, opts: ['', 'casual', 'part-time', 'full-time'], placeholder: 'Commitment' },
                        { val: compensation, setter: setCompensation, opts: ['', 'paid', 'unpaid', 'equity'], placeholder: 'Compensation' },
                    ].map((f, i) => (
                        <select key={i} className="input-field" value={f.val} onChange={e => f.setter(e.target.value as any)}
                            style={{ width: 'auto', padding: '0.4375rem 0.875rem', fontSize: '0.8125rem', borderRadius: 980, paddingRight: '2rem' }}>
                            <option value="">{f.placeholder}</option>
                            {f.opts.slice(1).map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                        </select>
                    ))}

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select id="sort-select" className="input-field" value={sort} onChange={e => setSort(e.target.value as typeof sort)}
                            style={{ width: 'auto', padding: '0.4375rem 0.875rem', fontSize: '0.8125rem', borderRadius: 980, paddingRight: '2rem' }}>
                            <option value="match">Best Match</option>
                            <option value="recent">Most Recent</option>
                            <option value="size">Team Size</option>
                        </select>
                        <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', borderRadius: 8, padding: '3px' }}>
                            {[['grid', '⊞'], ['list', '☰']].map(([v, icon]) => (
                                <button key={v} onClick={() => setView(v as 'grid' | 'list')}
                                    style={{ width: 30, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.875rem', background: view === v ? 'white' : 'transparent', color: view === v ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'all 0.15s', boxShadow: view === v ? 'var(--shadow-xs)' : 'none' }}>
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category pills */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {['', ...CATEGORIES].map(cat => {
                        const isActive = activeCategory === cat;
                        return (
                            <button key={cat || 'all'} onClick={() => setActiveCategory(cat as ProjectCategory | '')}
                                style={{
                                    padding: '0.3125rem 1rem', borderRadius: 980, border: `1px solid ${isActive && cat ? catColors[cat] : isActive ? 'var(--text-primary)' : 'var(--border)'}`,
                                    background: isActive ? (cat ? `${catColors[cat]}11` : 'var(--text-primary)') : 'transparent',
                                    color: isActive ? (cat ? catColors[cat] : 'white') : 'var(--text-secondary)',
                                    fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                }}>
                                {cat || 'All'}
                            </button>
                        );
                    })}
                </div>

                {/* Results */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                        <p style={{ fontWeight: 600, fontSize: '1.0625rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No projects found</p>
                        <p>Try adjusting your filters or search term.</p>
                    </div>
                ) : view === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.875rem' }}>
                        {filtered.map(project => {
                            const creator = USERS.find(u => u.id === project.creatorId)!;
                            const catColor = catColors[project.category] || '#6e6e73';
                            return (
                                <Link href={`/dashboard/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                                    <div className="card-interactive" style={{ padding: '1.375rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: catColor }}>{project.category}</span>
                                                <div style={{ marginTop: '0.25rem' }}>
                                                    <span className={`badge ${project.status === 'recruiting' ? 'badge-green' : project.status === 'in-progress' ? 'badge-yellow' : 'badge-blue'}`}>
                                                        {project.status === 'recruiting' ? '● Recruiting' : project.status === 'in-progress' ? '◐ In Progress' : '✓ Done'}
                                                    </span>
                                                </div>
                                            </div>
                                            {project.matchScore !== undefined && <MatchRing score={project.matchScore} />}
                                        </div>
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>{project.name}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem', flex: 1 }}>{project.shortDescription}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                                            {project.tags.slice(0, 3).map(t => <span key={t} className="skill-tag">{t}</span>)}
                                            {project.tags.length > 3 && <span className="skill-tag">+{project.tags.length - 3}</span>}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.875rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <div className="avatar" style={{ width: 20, height: 20, fontSize: '0.58rem', background: creator.avatarColor }}>{getAvatarInitials(creator.name)}</div>
                                                {creator.name.split(' ')[0]}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.875rem' }}>
                                                <span>+{project.roles.filter(r => r.filled < r.count).length} roles</span>
                                                <span>{project.remote ? '🌐' : '📍'} {project.commitment}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {filtered.map(project => {
                            const creator = USERS.find(u => u.id === project.creatorId)!;
                            const catColor = catColors[project.category] || '#6e6e73';
                            return (
                                <Link href={`/dashboard/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                                    <div className="card-interactive" style={{ padding: '1.125rem 1.375rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: catColor }}>{project.category}</span>
                                                <span className={`badge ${project.status === 'recruiting' ? 'badge-green' : project.status === 'in-progress' ? 'badge-yellow' : 'badge-blue'}`}>
                                                    {project.status === 'recruiting' ? 'Recruiting' : project.status === 'in-progress' ? 'In Progress' : 'Done'}
                                                </span>
                                            </div>
                                            <h3 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>{project.name}</h3>
                                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{project.shortDescription}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', flexShrink: 0, maxWidth: 200 }}>
                                            {project.tags.slice(0, 2).map(t => <span key={t} className="skill-tag" style={{ fontSize: '0.72rem' }}>{t}</span>)}
                                        </div>
                                        {project.matchScore !== undefined && <MatchRing score={project.matchScore} />}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
