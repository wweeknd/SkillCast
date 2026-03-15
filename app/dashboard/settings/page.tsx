'use client';
import { useState } from 'react';
import { USERS, CURRENT_USER_ID } from '../../lib/data';

const currentUser = USERS.find(u => u.id === CURRENT_USER_ID)!;
const SKILLS_SUGGESTIONS = ['React', 'Node.js', 'TypeScript', 'Python', 'Unity', 'C#', 'Figma', 'UI Design', 'Go', 'Rust', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Machine Learning', 'TensorFlow', 'Swift', 'Kotlin', 'Flutter', 'DevOps', 'Game Design', 'Pixel Art', 'Marketing', 'Product Strategy'];

export default function SettingsPage() {
    const [tab, setTab] = useState<'profile' | 'skills' | 'notifications' | 'account'>('profile');
    const [form, setForm] = useState({
        name: currentUser.name,
        username: currentUser.username,
        bio: currentUser.bio,
        location: currentUser.location,
        hoursPerWeek: currentUser.hoursPerWeek,
        availability: currentUser.availability,
        githubUrl: currentUser.githubUrl || '',
        websiteUrl: currentUser.websiteUrl || '',
        skills: [...currentUser.skills],
        skillInput: '',
    });
    const [saved, setSaved] = useState(false);
    const [notifPrefs, setNotifPrefs] = useState({
        projectMatch: true,
        messages: true,
        joinRequests: true,
        ratings: true,
        invites: true,
        emailDigest: false,
    });

    function addSkill(skill: string) {
        if (skill && !form.skills.includes(skill)) {
            setForm(f => ({ ...f, skills: [...f.skills, skill], skillInput: '' }));
        }
    }
    function removeSkill(skill: string) {
        setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
    }

    function handleSave() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '2rem 1.5rem' }}>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>Settings</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your profile and preferences</p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
                {(['profile', 'skills', 'notifications', 'account'] as const).map(t => (
                    <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
                ))}
            </div>

            {/* Profile tab */}
            {tab === 'profile' && (
                <div className="card" style={{ padding: '1.75rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Profile Information</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Full Name</label>
                                <input id="settings-name" className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Username</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>@</span>
                                    <input id="settings-username" className="input-field" style={{ paddingLeft: '2rem' }} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Bio</label>
                            <textarea id="settings-bio" className="input-field" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical', fontFamily: 'Inter' }} />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>{form.bio.length}/300 characters</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Location</label>
                                <input id="settings-location" className="input-field" placeholder="e.g. San Francisco, CA" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Hours per Week</label>
                                <input id="settings-hours" className="input-field" type="number" min={1} max={80} value={form.hoursPerWeek} onChange={e => setForm(f => ({ ...f, hoursPerWeek: parseInt(e.target.value) || 1 }))} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Availability Status</label>
                            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                                {[
                                    { value: 'looking', label: '● Looking for project', color: '#4ade80' },
                                    { value: 'leading', label: '◆ Leading a project', color: '#fbbf24' },
                                    { value: 'unavailable', label: '○ Not available', color: 'var(--text-muted)' },
                                ].map(opt => (
                                    <button key={opt.value} onClick={() => setForm(f => ({ ...f, availability: opt.value as typeof form.availability }))}
                                        style={{
                                            padding: '0.5rem 1rem', borderRadius: 20, border: `1px solid ${form.availability === opt.value ? opt.color : 'var(--border)'}`,
                                            background: form.availability === opt.value ? `${opt.color}22` : 'transparent',
                                            color: form.availability === opt.value ? opt.color : 'var(--text-secondary)',
                                            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                                        }}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>GitHub URL</label>
                                <input id="settings-github" className="input-field" placeholder="https://github.com/username" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Website / Portfolio</label>
                                <input id="settings-website" className="input-field" placeholder="https://yoursite.com" value={form.websiteUrl} onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button className="btn-primary" onClick={handleSave} id="save-profile-btn">
                            {saved ? '✓ Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Skills tab */}
            {tab === 'skills' && (
                <div className="card" style={{ padding: '1.75rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your Skills</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add skills that represent what you can contribute. This powers your project matching.</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        {form.skills.map((skill, i) => (
                            <span key={skill} className={`skill-tag ${i % 3 === 0 ? '' : i % 3 === 1 ? 'skill-tag-blue' : 'skill-tag-cyan'}`}
                                style={{ cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => removeSkill(skill)}>
                                {skill} ×
                            </span>
                        ))}
                    </div>

                    <input id="skill-input" className="input-field" placeholder="Type a skill and press Enter..."
                        value={form.skillInput}
                        onChange={e => setForm(f => ({ ...f, skillInput: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(form.skillInput.trim()); } }}
                        style={{ marginBottom: '1rem' }}
                    />

                    <p className="section-label">Suggestions</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {SKILLS_SUGGESTIONS.filter(s => !form.skills.includes(s)).map(skill => (
                            <button key={skill} onClick={() => addSkill(skill)} className="btn-ghost"
                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', border: '1px dashed var(--border)', borderRadius: 20, color: 'var(--text-muted)' }}>
                                + {skill}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button className="btn-primary" onClick={handleSave} id="save-skills-btn">
                            {saved ? '✓ Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Notifications tab */}
            {tab === 'notifications' && (
                <div className="card" style={{ padding: '1.75rem' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Notification Preferences</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {[
                            { key: 'projectMatch', label: 'New Project Matches', desc: 'When a project is posted that matches your skills' },
                            { key: 'messages', label: 'Messages', desc: 'When someone sends you a direct message' },
                            { key: 'joinRequests', label: 'Join Requests', desc: 'When someone applies to your project' },
                            { key: 'ratings', label: 'Ratings & Reviews', desc: 'When a teammate rates your work' },
                            { key: 'invites', label: 'Team Invites', desc: 'When you are invited to join a project' },
                            { key: 'emailDigest', label: 'Weekly Email Digest', desc: 'Summary of platform activity every week' },
                        ].map((pref, i) => (
                            <div key={pref.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{pref.label}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pref.desc}</div>
                                </div>
                                <button id={`notif-toggle-${pref.key}`}
                                    onClick={() => setNotifPrefs(p => ({ ...p, [pref.key]: !p[pref.key as keyof typeof p] }))}
                                    style={{
                                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                                        background: notifPrefs[pref.key as keyof typeof notifPrefs] ? 'var(--text-primary)' : 'var(--border)',
                                        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                                    }}>
                                    <span style={{
                                        width: 18, height: 18, borderRadius: '50%', background: 'white',
                                        position: 'absolute', top: 3, transition: 'left 0.2s',
                                        left: notifPrefs[pref.key as keyof typeof notifPrefs] ? 23 : 3,
                                    }} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button className="btn-primary" onClick={handleSave} id="save-notifs-btn">
                            {saved ? '✓ Saved!' : 'Save Preferences'}
                        </button>
                    </div>
                </div>
            )}

            {/* Account tab */}
            {tab === 'account' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Email & Password</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email Address</label>
                                <input id="settings-email" className="input-field" defaultValue="alexrivera@example.com" type="email" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>New Password</label>
                                <input id="settings-password" className="input-field" type="password" placeholder="Leave blank to keep current password" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                            <button className="btn-primary" id="update-account-btn" onClick={handleSave}>{saved ? '✓ Saved!' : 'Update Account'}</button>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#ef4444' }}>Danger Zone</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Once you delete your account, all your data will be permanently removed.</p>
                        <button className="btn-secondary" style={{ borderColor: 'rgba(239,68,68,0.5)', color: '#ef4444' }}>Delete Account</button>
                    </div>
                </div>
            )}
        </div>
    );
}
