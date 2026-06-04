import { useEffect, useRef } from 'react'

export default function Particles() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - .5) * .4,
            vy: (Math.random() - .5) * .4,
            r: Math.random() * 1.5 + .5,
            opacity: Math.random() * .5 + .1
        }))

        let mouse = { x: -999, y: -999 }
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw connections
            particles.forEach((p, i) => {
                particles.slice(i + 1).forEach(q => {
                    const dx = p.x - q.x, dy = p.y - q.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 120) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / 120) * .15})`
                        ctx.lineWidth = .5
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(q.x, q.y)
                        ctx.stroke()
                    }
                })
            })

            // Draw particles
            particles.forEach(p => {
                // Mouse repulsion
                const dx = p.x - mouse.x, dy = p.y - mouse.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 100) {
                    p.vx += dx / dist * .3
                    p.vy += dy / dist * .3
                }
                p.vx *= .99; p.vy *= .99
                p.x += p.vx; p.y += p.vy

                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(6,182,212,${p.opacity})`
                ctx.fill()
            })

            requestAnimationFrame(draw)
        }
        draw()

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    return (
        <canvas ref={canvasRef} style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            zIndex: 0, pointerEvents: 'none'
        }} />
    )
}