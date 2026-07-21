import { DiscoverIcon, DesignIcon, BuildIcon, LaunchIcon } from '../components/ProcessIcons'

const STEPS = [
  {
    no: '01',
    title: 'Discover',
    icon: DiscoverIcon,
    body: 'We talk through what you actually need — goals, audience, timeline — before anything gets designed.',
  },
  {
    no: '02',
    title: 'Design',
    icon: DesignIcon,
    body: 'I design fast, in the browser, so you see real progress instead of a mood board that never quite becomes a site.',
  },
  {
    no: '03',
    title: 'Build',
    icon: BuildIcon,
    body: 'Clean, hand-written code — no page builder, no bloated plugin stack. Just a site built to actually last.',
  },
  {
    no: '04',
    title: 'Launch',
    icon: LaunchIcon,
    body: 'I handle deployment and the small stuff that breaks in the wild, then stick around after launch.',
  },
]

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="shell">
        <span className="eyebrow">How it works</span>
        <h2 className="process__title display">From idea to shipped.</h2>

        <ol className="process__grid">
          {STEPS.map(({ no, title, icon: Icon, body }) => (
            <li className="process__item" key={no}>
              <div className="process__row">
                <span className="process__no display">{no}</span>
                <Icon className="process__icon" />
              </div>
              <h3 className="process__name display">{title}</h3>
              <p className="process__body">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
