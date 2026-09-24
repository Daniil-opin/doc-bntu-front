import { Search } from 'lucide-react'
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'

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
  ariaLabel?: string
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
  ariaLabel,
  searchable = false,
  searchPlaceholder = 'Поиск',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const listboxId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]
  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', closeOutside)
    return () => {
      document.removeEventListener('mousedown', closeOutside)
    }
  }, [])
  const visibleOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    if (!open || searchable) return
    optionRefs.current[highlightedIndex]?.focus()
  }, [highlightedIndex, open, searchable])

  const close = (restoreFocus = false) => {
    setOpen(false)
    setQuery('')
    if (restoreFocus) triggerRef.current?.focus()
  }
  const openAt = (index: number) => {
    setHighlightedIndex(Math.max(0, Math.min(index, options.length - 1)))
    setOpen(true)
  }
  const chooseOption = (index: number) => {
    const option = visibleOptions[index]
    if (!option) return
    onChange(option.value)
    close(true)
  }
  const focusOption = (index: number) => {
    const lastIndex = visibleOptions.length - 1
    if (lastIndex < 0) return
    const nextIndex = Math.max(0, Math.min(index, lastIndex))
    setHighlightedIndex(nextIndex)
    optionRefs.current[nextIndex]?.focus()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const isSearchInput = event.target instanceof HTMLInputElement && event.target.type !== 'hidden'

    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openAt(
          Math.max(
            0,
            options.findIndex((option) => option.value === value),
          ),
        )
      } else if (event.key === 'ArrowUp' || event.key === 'End') {
        event.preventDefault()
        openAt(options.length - 1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        openAt(0)
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close(true)
    } else if (event.key === 'Tab') {
      close()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(highlightedIndex + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption(highlightedIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusOption(visibleOptions.length - 1)
    } else if (event.key === 'Enter' || (event.key === ' ' && !isSearchInput)) {
      event.preventDefault()
      chooseOption(highlightedIndex)
    }
  }

  return (
    <div ref={rootRef} className={`select ${open ? 'select-open' : ''} ${className}`.trim()}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        className="select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (open) close()
          else
            openAt(
              Math.max(
                0,
                options.findIndex((option) => option.value === value),
              ),
            )
        }}
      >
        <span>{selected?.label}</span>
        <span className="select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div
          className="select-menu"
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? name}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {searchable && (
            <label className="select-search">
              <Search size={14} />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setHighlightedIndex(0)
                }}
                placeholder={searchPlaceholder}
                onClick={(event) => event.stopPropagation()}
              />
            </label>
          )}
          {visibleOptions.map((option, index) => (
            <button
              ref={(element) => {
                optionRefs.current[index] = element
              }}
              className={`select-option ${option.value === value ? 'select-option-active' : ''}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={option.value}
              onClick={() => {
                onChange(option.value)
                close(true)
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
