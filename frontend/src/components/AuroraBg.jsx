export default function AuroraBg() {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 0,
            pointerEvents: 'none', overflow: 'hidden'
        }}>
            {/* Aurora blobs */}
            {[
                { top: '-20%', left: '-10%', w: '70vw', h: '70vw', c: 'rgba(37,99,235,0.07)', d: '8s' },
                { top: '20%', right: '-15%', w: '60vw', h: '60vw', c: 'rgba(124,58,237,0.06)', d: '11s' },
                { bottom: '-10%', left: '20%', w: '50vw', h: '50vw', c: 'rgba(6,182,212,0.05)', d: '9s' },
            ].map((o, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: o.top, left: o.left, right: o.right, bottom: o.bottom,
                    width: o.w, height: o.h,
                    background: `radial-gradient(ellipse, ${o.c} 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    animation: `aurora ${o.d} ease-in-out infinite`,
                    animationDelay: `${i * 2}s`
                }} />
            ))}

            {/* Grid */}
            <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .6 }} />

            {/* Scanline */}
            <div style={{
                position: 'absolute', left: 0, right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent)',
                animation: 'scanBeam 8s linear infinite'
            }} />

            {/* Floating particles canvas is handled by Hero */}
        </div>
    )
}