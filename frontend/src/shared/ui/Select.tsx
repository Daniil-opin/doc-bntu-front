import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}
interface SelectProps<T extends string> {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  className?: string
  disabled?: boolean
  name?: string
  searchable?: boolean
  searchPlaceholder?: string
}

export function Select<T extends string>({
  value,
  options,
  onChange,
  className = '',
  disabled = false,
  name,
  searchable = false,
  searchPlaceholder = 'Поиск',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value) ?? options[0]
  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => {
      document.removeEventListener('mousedown', closeOutside)
      document.removeEventListener('keydown', closeEscape)
    }
  }, [])
  const visibleOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
    : options
  return (
    <div ref={rootRef} className={`select ${open ? 'select-open' : ''} ${className}`.trim()}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        className="select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        <span className="select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="select-menu" role="listbox" aria-label={name}>
          {searchable && (
            <label className="select-search">
              <Search size={14} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                onClick={(event) => event.stopPropagation()}
              />
            </label>
          )}
          {visibleOptions.map((option) => (
            <button
              className={`select-option ${option.value === value ? 'select-option-active' : ''}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
                setQuery('')
              }}
            >
              {option.label}
            </button>
          ))}
          {!visibleOptions.length && <span className="select-empty">Ничего не найдено</span>}
        </div>
      )}
    </div>
  )
}
