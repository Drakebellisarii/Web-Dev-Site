// A hairline browser chrome — single dot, thin url field, 1px border.
// Presents real site imagery without it floating loose as a raw screenshot.
export default function BrowserFrame({ url = 'drakebellisari.com', className = '', children }) {
  return (
    <div className={`browser-frame${className ? ` ${className}` : ''}`}>
      <div className="browser-frame__bar">
        <span className="browser-frame__dot" aria-hidden="true" />
        <div className="browser-frame__url">{url}</div>
      </div>
      <div className="browser-frame__body">{children}</div>
    </div>
  )
}
