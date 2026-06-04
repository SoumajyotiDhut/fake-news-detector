import { motion } from 'framer-motion'

const features = [
    { icon: '🧠', title: 'Natural Language Processing', desc: 'Advanced tokenization, lemmatization, and semantic analysis of news content.', color: '#2563EB' },
    { icon: '⚡', title: 'Machine Learning', desc: 'Fine-tuned DistilBERT with 66M parameters trained on 39K+ verified articles.', color: '#06B6D4' },
    { icon: '🔍', title: 'Explainable AI', desc: 'Transparent word-level explanations showing exactly why content is flagged.', color: '#7C3AED' },
    { icon: '✓', title: 'Fact Verification', desc: 'Cross-references linguistic patterns against known misinformation signatures.', color: '#10B981' },
    { icon: '📊', title: 'Pattern Recognition', desc: 'Detects sensationalism, emotional manipulation, and clickbait patterns.', color: '#F59E0B' },
    { icon: '🔒', title: 'Deep Learning', desc: 'Multi-layer neural architecture for superior contextual understanding.', color: '#DB2777' },
]

export default function Features() {
    return (
        <section style={{ padding: '100px 60px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <p style={{ fontSize: '11px', color: '#06B6D4', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
                        CAPABILITIES
                    </p>
                    <h2 style={{
                        fontFamily: 'var(--font-h)', fontWeight: 700,
                        fontSize: 'clamp(28px,4vw,46px)', letterSpacing: '-0.03em'
                    }}>
                        Powered by{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>cutting-edge AI</span>
                    </h2>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                    {features.map((f, i) => (
                        <motion.div key={f.title}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * .08 }}
                            whileHover={{ y: -8, boxShadow: `0 24px 60px ${f.color}22` }}
                            className="glass" style={{ padding: '32px', cursor: 'default', transition: 'box-shadow .3s' }}>
                            <motion.div whileHover={{ scale: 1.15, rotate: 8 }}
                                style={{
                                    width: '54px', height: '54px', borderRadius: '15px', marginBottom: '20px',
                                    background: `${f.color}18`, border: `1px solid ${f.color}35`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                                    boxShadow: `0 0 24px ${f.color}15`
                                }}>{f.icon}</motion.div>
                            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '17px', marginBottom: '10px' }}>
                                {f.title}
                            </h3>
                            <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.7 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}