// Plain grayscale wordmarks — no logo image assets, just the tools honestly.
const STACK = ['Figma', 'React', 'Vite', 'Framer Motion', 'Node.js', 'Vercel']

export default function TechStrip() {
  const track = [...STACK, ...STACK]

  return (
    <section className="techstrip" aria-label="Tools and technology">
      <div className="techstrip__track">
        {track.map((name, i) => (
          <span className="techstrip__item" key={`${name}-${i}`} aria-hidden={i >= STACK.length}>
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
