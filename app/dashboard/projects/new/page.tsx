'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectCategory, CommitmentLevel } from '../../../lib/data';

const CATEGORIES: ProjectCategory[] = ['Software', 'Video Game', 'Startup', 'AI/ML', 'Creative', 'Research'];
const SKILLS_SUGGESTIONS = ['React', 'Node.js', 'TypeScript', 'Python', 'Unity', 'C#', 'Figma', 'UI Design', 'Go', 'Rust', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Machine Learning', 'TensorFlow', 'Swift', 'Kotlin', 'Flutter', 'DevOps', 'Game Design', 'Pixel Art', 'Marketing', 'Product Strategy'];

export default function NewProjectPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '',
        shortDescription: '',
        fullDescription: '',
        category: '' as ProjectCategory | '',
        timeline: '',
        commitment: 'part-time' as CommitmentLevel,
        compensation: 'equity' as 'paid' | 'unpaid' | 'equity',
        remote: true,
        tags: [] as string[],
        tagInput: '',
    });
    const [roles, setRoles] = useState([{ title: '', skills: [] as string[], count: 1, skillInput: '' }]);

    function addTag(tag: string) {
        if (tag && !form.tags.includes(tag)) {
            setForm(f => ({ ...f, tags: [...f.tags, tag], tagInput: '' }));
        }
    }
    function removeTag(tag: string) {
        setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
    }
    function addRoleSkill(roleIdx: number, skill: string) {
        if (skill && !roles[roleIdx].skills.includes(skill)) {
            setRoles(rs => rs.map((r, i) => i === roleIdx ? { ...r, skills: [...r.skills, skill], skillInput: '' } : r));
        }
    }
    function removeRoleSkill(roleIdx: number, skill: string) {
        setRoles(rs => rs.map((r, i) => i === roleIdx ? { ...r, skills: r.skills.filter(s => s !== skill) } : r));
    }
    function addRole() {
        setRoles(rs => [...rs, { title: '', skills: [], count: 1, skillInput: '' }]);
    }
    function removeRole(idx: number) {
        setRoles(rs => rs.filter((_, i) => i !== idx));
    }

    const step1Valid = form.name && form.shortDescription && form.category;
    const step2Valid = form.fullDescription && form.timeline;
    const step3Valid = roles.some(r => r.title);

    function handleSubmit() {
        router.push('/dashboard/projects');
    }

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Post a New Project</h1>
                <p style={{ color: 'var(--text-muted)' }}>Share your idea and find the right team</p>
            </div>

            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '2.5rem', position: 'relative' }}>
                {[1, 2, 3, 4].map((s, i) => (
                    <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {i < 3 && (
                            <div style={{ position: 'absolute', top: 16, left: '50%', width: '100%', height: 2, background: step > s ? 'var(--text-primary)' : 'var(--border)', transition: 'background 0.3s' }} />
                        )}
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700, zIndex: 1, transition: 'all 0.2s',
                            background: step > s ? 'var(--text-primary)' : step === s ? 'var(--text-primary)' : 'white',
                            border: `2px solid ${step >= s ? 'var(--text-primary)' : 'var(--border)'}`,
                            color: step >= s ? 'white' : 'var(--text-muted)',
                        }}>
                            {step > s ? '✓' : s}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: step === s ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '0.5rem', fontWeight: step === s ? 600 : 400, textAlign: 'center' }}>
                            {['Basics', 'Details', 'Roles', 'Review'][i]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step 1: Basics */}
            {step === 1 && (
                <div className="card" style={{ padding: '1.75rem' }} key="step1">
                    <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.5rem' }}>Project Basics</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Project Name *</label>
                            <input id="project-name" className="input-field" placeholder="Give your project a memorable name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Short Description * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(1-2 sentences)</span></label>
                            <input id="project-short-desc" className="input-field" placeholder="The elevator pitch for your project" value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Category *</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))}
                                        className={form.category === cat ? 'btn-primary' : 'btn-secondary'}
                                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: 8 }}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Tags / Skills Needed</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.625rem' }}>
                                {form.tags.map(tag => (
                                    <span key={tag} className="skill-tag" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}>{tag} ×</span>
                                ))}
                            </div>
                            <input id="project-tags" className="input-field" placeholder="Type a skill and press Enter" value={form.tagInput}
                                onChange={e => setForm(f => ({ ...f, tagInput: e.target.value }))}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(form.tagInput.trim()); } }} />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                                {SKILLS_SUGGESTIONS.filter(s => !form.tags.includes(s)).slice(0, 8).map(s => (
                                    <span key={s} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: 8, border: '1px dashed var(--border)', transition: 'all 0.15s' }}
                                        onClick={() => addTag(s)} className="btn-ghost">+ {s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button className="btn-primary" onClick={() => setStep(2)} disabled={!step1Valid} id="next-step-1">Next: Project Details →</button>
                    </div>
                </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
                <div className="card" style={{ padding: '1.75rem' }} key="step2">
                    <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.5rem' }}>Project Details</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Full Description * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— explain your vision</span></label>
                            <textarea id="project-full-desc" className="input-field" rows={6}
                                placeholder="Describe your project in detail. What problem does it solve? What's your vision? What have you built so far?"
                                value={form.fullDescription}
                                onChange={e => setForm(f => ({ ...f, fullDescription: e.target.value }))}
                                style={{ resize: 'vertical', fontFamily: 'Inter' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Timeline *</label>
                                <input id="project-timeline" className="input-field" placeholder="e.g. 3 months, 6+ months" value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Commitment Level</label>
                                <select id="project-commitment" className="input-field" value={form.commitment} onChange={e => setForm(f => ({ ...f, commitment: e.target.value as CommitmentLevel }))}>
                                    <option value="casual">Casual (1-5h/week)</option>
                                    <option value="part-time">Part-time (5-20h/week)</option>
                                    <option value="full-time">Full-time (40h/week)</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Compensation</label>
                                <select id="project-compensation" className="input-field" value={form.compensation} onChange={e => setForm(f => ({ ...f, compensation: e.target.value as typeof form.compensation }))}>
                                    <option value="unpaid">Unpaid / passion project</option>
                                    <option value="equity">Equity / profit share</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Location</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => setForm(f => ({ ...f, remote: true }))} className={form.remote ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1, justifyContent: 'center', padding: '0.6rem' }}>🌐 Remote</button>
                                    <button onClick={() => setForm(f => ({ ...f, remote: false }))} className={!form.remote ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1, justifyContent: 'center', padding: '0.6rem' }}>📍 Local</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                        <button className="btn-primary" onClick={() => setStep(3)} disabled={!step2Valid} id="next-step-2">Next: Define Roles →</button>
                    </div>
                </div>
            )}

            {/* Step 3: Roles */}
            {step === 3 && (
                <div className="card" style={{ padding: '1.75rem' }} key="step3">
                    <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.375rem' }}>Team Requirements</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Define the roles you&apos;re looking to fill. Be specific about skills needed.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {roles.map((role, idx) => (
                            <div key={idx} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 12, position: 'relative' }}>
                                {roles.length > 1 && (
                                    <button onClick={() => removeRole(idx)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                )}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 2, minWidth: 200 }}>
                                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.375rem', color: 'var(--text-muted)' }}>Role Title</label>
                                        <input className="input-field" placeholder="e.g. React Developer, UI/UX Designer" value={role.title}
                                            onChange={e => setRoles(rs => rs.map((r, i) => i === idx ? { ...r, title: e.target.value } : r))} />
                                    </div>
                                    <div style={{ width: 80 }}>
                                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.375rem', color: 'var(--text-muted)' }}>Count</label>
                                        <input className="input-field" type="number" min={1} max={10} value={role.count}
                                            onChange={e => setRoles(rs => rs.map((r, i) => i === idx ? { ...r, count: parseInt(e.target.value) || 1 } : r))}
                                            style={{ textAlign: 'center' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.375rem', color: 'var(--text-muted)' }}>Skills Required</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                                        {role.skills.map(s => (
                                            <span key={s} className="skill-tag" style={{ cursor: 'pointer', fontSize: '0.72rem' }} onClick={() => removeRoleSkill(idx, s)}>{s} ×</span>
                                        ))}
                                    </div>
                                    <input className="input-field" placeholder="Add a skill and press Enter" value={role.skillInput}
                                        onChange={e => setRoles(rs => rs.map((r, i) => i === idx ? { ...r, skillInput: e.target.value } : r))}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRoleSkill(idx, roles[idx].skillInput.trim()); } }} />
                                </div>
                            </div>
                        ))}
                        <button className="btn-secondary" onClick={addRole} style={{ justifyContent: 'center' }}>+ Add Another Role</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                        <button className="btn-primary" onClick={() => setStep(4)} id="next-step-3">Next: Review →</button>
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div key="step4">
                    <div className="card" style={{ padding: '1.75rem', marginBottom: '1rem' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.5rem' }}>Review & Post</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 12 }}>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{form.name}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{form.shortDescription}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <span style={{ padding: '0.2rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(124,92,252,0.2)', color: '#9b7eff', border: '1px solid rgba(124,92,252,0.3)' }}>{form.category}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', background: 'var(--border)', borderRadius: 20 }}>🕐 {form.timeline}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', background: 'var(--border)', borderRadius: 20 }}>💼 {form.commitment}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', background: 'var(--border)', borderRadius: 20 }}>💰 {form.compensation}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', background: 'var(--border)', borderRadius: 20 }}>{form.remote ? '🌐 Remote' : '📍 Local'}</span>
                                </div>
                                {form.tags.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                        {form.tags.map(t => <span key={t} className="skill-tag" style={{ fontSize: '0.72rem' }}>{t}</span>)}
                                    </div>
                                )}
                            </div>

                            {roles.filter(r => r.title).length > 0 && (
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>LOOKING FOR</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {roles.filter(r => r.title).map((r, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                                                <span style={{ color: '#4ade80', fontWeight: 700 }}>× {r.count}</span>
                                                <span style={{ fontWeight: 600 }}>{r.title}</span>
                                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                                    {r.skills.map(s => <span key={s} className="skill-tag" style={{ fontSize: '0.68rem' }}>{s}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn-secondary" onClick={() => setStep(3)}>← Back</button>
                        <button className="btn-primary" onClick={handleSubmit} style={{ padding: '0.875rem 2rem' }} id="submit-project-btn">
                            🚀 Post Project →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
