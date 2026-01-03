export default function Input({
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-200">
        {label}
      </label>

      <input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={
          'w-full rounded-xl border bg-zinc-950 px-4 py-3 text-sm text-zinc-50 ' +
          'border-zinc-800 placeholder:text-zinc-500 ' +
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400'
        }
        {...props}
      />

      {hint ? (
        <p id={hintId} className="text-xs text-zinc-400">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}
