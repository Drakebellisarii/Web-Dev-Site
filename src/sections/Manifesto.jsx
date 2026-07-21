import DotField from '../components/DotField'

export default function Manifesto() {
  return (
    <section className="manifesto">
      <DotField variant="flat" />
      <div className="shell manifesto__inner">
        <span className="eyebrow manifesto__eyebrow">Philosophy</span>
        <p className="manifesto__statement display">
          A website shouldn&rsquo;t feel like it came from a template.
          It should feel like <em className="display-italic">someone</em> actually
          built it — on purpose, for you.
        </p>
      </div>
    </section>
  )
}
