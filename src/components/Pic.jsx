import { useState } from 'react'

// Image with warm shimmer skeleton while loading — keeps layouts composed on
// slow connections. Wrapper takes the shape classes (rounded, aspect, size).
export default function Pic({ src, alt = '', className = '', style = {}, imgStyle = {}, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {!loaded && <div className="absolute inset-0 shimmer" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.45s ease', ...imgStyle }}
        {...rest}
      />
    </div>
  )
}
