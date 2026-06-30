export function FormField({ label, error, children }) {
  return (
    <div className="mb-5">
      <label className="block text-[13px] font-medium text-ink-soft mb-1.5 stamp tracking-wide uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-rust text-[13px] mt-1.5">{error}</p>}
    </div>
  )
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full bg-paper border border-ink/20 px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-rust transition-colors duration-200 ${props.className || ''}`}
    />
  )
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full bg-paper border border-ink/20 px-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-rust transition-colors duration-200 resize-none ${props.className || ''}`}
    />
  )
}

export function SelectInput({ children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full bg-paper border border-ink/20 px-4 py-3 text-[15px] text-ink focus:outline-none focus:border-rust transition-colors duration-200 ${props.className || ''}`}
    >
      {children}
    </select>
  )
}

export function PrimaryButton({ children, loading, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`group relative w-full inline-flex items-center justify-center gap-2 bg-verandah text-paper px-6 py-3.5 text-[15px] font-medium overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <span className="relative z-10">{loading ? 'Please wait…' : children}</span>
      {!loading && (
        <span className="absolute inset-0 bg-rust translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
    </button>
  )
}
