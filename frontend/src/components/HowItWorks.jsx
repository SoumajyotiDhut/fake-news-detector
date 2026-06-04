import { motion } from 'framer-motion'

const steps = [
    { n: '01', icon: '✍', title: 'Input Article', desc: 'Paste any news article, headline, or claim. Supports text and direct URLs from any news source.', color: '#2563EB' },
    { n: '02', icon: '🔬', title: 'NLP Processing', desc: 'Text is tokenized, cleaned, and preprocessed through our linguistic analysis pipeline.', color: '#06B6D4' },
    { n: '03', icon: '⚙', title: 'Feature Extraction', desc: '66M-parameter DistilBERT extracts deep semantic features and contextual embeddings.', color: '#7C3AED' },
    { n: '04', icon: '🧠', title: 'Model Prediction', desc: 'Trained classifier analyzes patterns, sensationalism, and linguistic markers.', color: '#DB2777' },
    { n: '05', icon: '📊', title: 'Confidence Analysis', desc: 'Generates probability scores, risk levels, and explainability metrics.', color: '#F59E0B' },
    { n: '06', icon: '✓', title: 'Final Result', desc: 'Delivers instant verdict with detailed AI explanation and word-level signals.', color: '#10B981' },
]

export default function HowItWorks() {
    return (
        <section style={{ padding: '100px 60px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <p style={{ fontSize: '11px', color: '#06B6D4', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
                        PROCESS
                    </p>
                    <h2 style={{
                        fontFamily: 'var(--font-h)', fontWeight: 700,
                        fontSize: 'clamp(28px,4vw,46px)', letterSpacing: '-0.03em'
                    }}>How it works</h2>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
                    {steps.map((s, i) => (
                        <motion.div key={s.n}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * .1 }}
                            whileHover={{ y: -6 }}
                            className="glass" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                            {/* Step badge */}
                            <div style={{
                                position: 'absolute', top: '20px', right: '20px',
                                padding: '3px 10px', borderRadius: '100px',
                                background: `${s.color}18`, border: `1px solid ${s.color}35`,
                                fontSize: '11px', color: s.color, fontFamily: 'var(--font-b)',
                                letterSpacing: '.06em'
                            }}>STEP {s.n}</div>

                            <motion.div whileHover={{ scale: 1.12, rotate: -5 }}
                                style={{
                                    width: '58px', height: '58px', borderRadius: '16px', marginBottom: '20px',
                                    background: `${s.color}15`, border: `1px solid ${s.color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                                    boxShadow: `0 0 24px ${s.color}20`
                                }}>{s.icon}</motion.div>

                            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '17px', color: s.color, marginBottom: '10px' }}>
                                {s.title}
                            </h3>
                            <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.7 }}>{s.desc}</p>

                            {/* Connector dot */}
                            {i < steps.length - 1 && i % 3 !== 2 && (
                                <div style={{
                                    position: 'absolute', top: '50%', right: '-12px',
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: 'var(--bg2)', border: `1px solid ${s.color}50`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 2, fontSize: '10px', color: s.color
                                }}>→</div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}