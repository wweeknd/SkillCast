'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const ROTATING_ROLES = ['developers', 'designers', 'founders', 'artists', 'researchers', 'writers'];

const FEATURED_PROJECTS = [
  { name: 'Nexus AI Study Tool', category: 'AI/ML', match: 87, needs: ['Python', 'React', 'ML'], dot: '#34c759' },
  { name: 'Echoes of the Abyss', category: 'Video Game', match: 75, needs: ['Unity', 'C#', 'Sound Design'], dot: '#f59e0b' },
  { name: 'Greenwave Carbon Tracker', category: 'Startup', match: 82, needs: ['React', 'Node.js', 'Data'], dot: '#0066cc' },
];

const STATS = [
  { value: '2,400+', label: 'Active Builders' },
  { value: '380+', label: 'Live Projects' },
  { value: '94%', label: 'Match Accuracy' },
  { value: '1,100+', label: 'Teams Formed' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Build your profile', desc: 'List your skills, experience, and what you\'re looking for. Your profile is your launchpad.', icon: '🧑‍💻' },
  { step: '02', title: 'Get matched', desc: 'Our engine surfaces projects that genuinely need what you bring. No noise — just relevant opportunities.', icon: '⚡' },
  { step: '03', title: 'Send a request', desc: 'Write a short intro and explain why you\'re a great fit. Quality over quantity.', icon: '🤝' },
  { step: '04', title: 'Build together', desc: 'Team chat unlocks. Collaborate, ship, and build your reputation with every project.', icon: '🚀' },
];

export default function LandingPage() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRoleIdx(i => (i + 1) % ROTATING_ROLES.length);
        setVisible(true);
      }, 280);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1d1d1f', letterSpacing: '-0.02em' }}>SkillCast</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Link href="/dashboard" className="btn-ghost" style={{ color: 'var(--text-secondary)' }}>Explore</Link>
            <Link href="/dashboard" className="btn-ghost" style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
            <Link href="/dashboard" className="btn-primary" id="nav-signup" style={{ marginLeft: '0.25rem' }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '7rem 2rem 5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem', borderRadius: 980, background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            2,400+ builders are already here
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#1d1d1f', marginBottom: '1.25rem' }}>
          Find your team.<br />
          Build something{' '}
          <span style={{ color: '#0066cc' }}>real.</span>
        </h1>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          The matchmaking platform for{' '}
          <span style={{
            color: 'var(--text-primary)', fontWeight: 600, display: 'inline-block',
            transition: 'opacity 0.28s ease, transform 0.28s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(5px)',
          }}>
            {ROTATING_ROLES[roleIdx]}
          </span>.
        </p>
        <p style={{ fontSize: '1.0625rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Have an idea? We'll find you a team. Have skills? We'll find you a project.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" className="btn-primary" id="hero-cta" style={{ padding: '0.8125rem 2rem', fontSize: '1rem', borderRadius: 980 }}>
            Start building →
          </Link>
          <Link href="/dashboard/explore" className="btn-outline" id="hero-explore" style={{ padding: '0.8125rem 2rem', fontSize: '1rem', borderRadius: 980 }}>
            Browse projects
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3.5rem', marginTop: '5rem', flexWrap: 'wrap' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#1d1d1f' }}>{s.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '2rem 2rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="section-label">Recruiting now</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#1d1d1f' }}>Projects looking for builders</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {FEATURED_PROJECTS.map((p, i) => (
            <div key={i} className="card-interactive" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, color: p.match >= 80 ? '#1a7a34' : '#92400e' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.dot, display: 'inline-block' }} />
                  {p.match}% match
                </div>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem', letterSpacing: '-0.01em', color: '#1d1d1f' }}>{p.name}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {p.needs.map(n => <span key={n} className="skill-tag" style={{ fontSize: '0.78rem' }}>{n}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/dashboard/explore" className="btn-secondary" id="see-all-cta" style={{ fontSize: '0.9375rem' }}>View all 380+ projects →</Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">How it works</p>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#1d1d1f' }}>From skills to shipped product</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>{step.icon}</div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{step.step}</div>
                <h3 style={{ fontWeight: 650, fontSize: '1.0625rem', marginBottom: '0.625rem', color: '#1d1d1f', letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '7rem 2rem' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#1d1d1f', marginBottom: '1rem' }}>
          Ready to find your team?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', marginBottom: '2.5rem' }}>
          Join thousands of builders shipping real products together.
        </p>
        <Link href="/dashboard" className="btn-primary" id="cta-bottom" style={{ padding: '0.875rem 2.25rem', fontSize: '1rem', borderRadius: 980 }}>
          Create your profile →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-light)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>SkillCast</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>© 2026 SkillCast. Built by builders, for builders.</p>
      </footer>
    </div>
  );
}
