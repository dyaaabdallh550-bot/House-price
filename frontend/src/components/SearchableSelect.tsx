import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  id: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchableSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select location...',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(o => o.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`custom-select-wrapper ${isOpen ? 'open' : ''}`} ref={containerRef} id={id}>
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="select-val-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`chevron ${isOpen ? 'rotate' : ''}`} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-dropdown-menu">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button type="button" className="clear-search" onClick={() => setSearch('')}>
                ✕
              </button>
            )}
          </div>

          <div className="dropdown-options-list" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`dropdown-item ${opt.value === value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  role="option"
                  aria-selected={opt.value === value}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="no-options">No cities match "{search}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
