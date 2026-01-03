export default function Card({ children, className = '' }) {
  return (
    <div
      className={
        'rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur ' +
        'shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ' +
        className
      }
    >
      {children}
    </div>
  )
}
