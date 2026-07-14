// A plain, boxy System-6-era window chrome — no traffic lights (those are a
// modern macOS anachronism), just a title bar with a close box and a plain
// address field. Used to present real site imagery without it floating
// loose as a raw screenshot.
export default function BrowserFrame({ url = 'drakebellisari.com', className = '', children }) {
  return (
    <div className={`browser-frame${className ? ` ${className}` : ''}`}>
      <div className="browser-frame__bar">
        <span className="browser-frame__close" aria-hidden="true" />
        <div className="browser-frame__url">{url}</div>
      </div>
      <div className="browser-frame__body">{children}</div>
    </div>
  )
}
