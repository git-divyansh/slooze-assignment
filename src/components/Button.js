export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-medium transition ' +
    'disabled:opacity-50 disabled:cursor-not-allowed ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400'

  const variants = {
    primary: 'bg-sky-500 text-zinc-950 hover:bg-sky-400',
    secondary: 'bg-zinc-800 text-zinc-50 hover:bg-zinc-700',
    ghost: 'bg-transparent text-zinc-50 hover:bg-zinc-900',
    danger: 'bg-rose-500 text-zinc-950 hover:bg-rose-400',
  }

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
