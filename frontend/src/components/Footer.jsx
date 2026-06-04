import { motion } from 'framer-motion'

export default function Footer({ setPage }) {
    return (
        <footer style={{
            padding: '80px 60px 40px',
            borderTop: '1px solid var(--border)',
            position: 'relative', zIndex: 1,
            background: 'rgba(5,8,22,0.8)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr', gap: '60px', marginBottom: '64px' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: 'linear-gradient(135deg,#2563EB,#06B6D4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                boxShadow: '0 0 24px rgba(37,99,235,.5)'
                            }}>🛡</div>
                            <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '20px' }}>
                                FakeGuard<span style={{ color: '#06B6D4' }}>.ai</span>
                            </span>
                        </div>
                        <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.8, maxWidth: '300px', marginBottom: '24px' }}>
                            AI-powered fake news detection built with DistilBERT and FastAPI.
                            Helping journalists, researchers, and citizens fight misinformation.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['GitHub', 'Twitter', 'LinkedIn', 'Discord'].map(s => (
                                <motion.a key={s} href="#" whileHover={{ scale: 1.1, borderColor: '#06B6D4', color: '#06B6D4' }}
                                    style={{
                                        padding: '7px 14px', borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid var(--border)',
                                        color: '#475569', fontSize: '12px',
                                        textDecoration: 'none', transition: 'all .2s', fontFamily: 'var(--font-b)'
                                    }}>{s}</motion.a>
                            ))}
                        </div>
                    </div>

                    {[
                        { title: 'Product', links: ['Analyzer', 'API Docs', 'Model Info', 'Changelog', 'Pricing'] },
                        { title: 'Resources', links: ['GitHub Repo', 'Research', 'Dataset', 'Blog', 'Contact'] },
                        { title: 'Company', links: ['About', 'Team', 'Privacy', 'Terms', 'Security'] },
                    ].map(col => (
                        <div key={col.title}>
                            <p style={{
                                fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '12px',
                                letterSpacing: '.08em', textTransform: 'uppercase',
                                color: '#94A3B8', marginBottom: '20px'
                            }}>{col.title}</p>
                            {col.links.map(l => (
                                <motion.a key={l} href="#"
                                    whileHover={{ x: 4, color: '#06B6D4' }}
                                    style={{
                                        display: 'block', color: '#475569', fontSize: '13px',
                                        textDecoration: 'none', marginBottom: '12px', transition: 'color .2s'
                                    }}>{l}</motion.a>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div style={{
                    paddingTop: '28px', borderTop: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <p style={{ fontSize: '12px', color: '#334155' }}>
                        © 2026 FakeGuard.ai · Built with DistilBERT, FastAPI & React · 7-Day ML Project
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy', 'Terms', 'Contact'].map(l => (
                            <a key={l} href="#" style={{ fontSize: '12px', color: '#334155', textDecoration: 'none', transition: 'color .2s' }}
                                onMouseOver={e => e.target.style.color = '#06B6D4'}
                                onMouseOut={e => e.target.style.color = '#334155'}>{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}