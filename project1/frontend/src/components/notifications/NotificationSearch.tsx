import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NotificationSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function NotificationSearch({ 
  onSearch, 
  placeholder = 'جستجو در اعلانات...' 
}: NotificationSearchProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Call onSearch when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleClear = () => {
    setQuery('')
    setDebouncedQuery('')
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-10 pl-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 px-1">
          در حال جستجو برای: "{query}"
        </div>
      )}
    </div>
  )
}
