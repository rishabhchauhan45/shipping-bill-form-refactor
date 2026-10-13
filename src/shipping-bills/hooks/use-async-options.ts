import { useEffect, useRef, useState } from 'react'

interface UseAsyncOptionsResult<T> {
  data: T[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}

/**
 * Reusable hook to fetch async options with explicit loading, error, empty, and success states
 */
export function useAsyncOptions<T>(
  fetcher: () => Promise<T[]>,
  deps: React.DependencyList = [],
  enabled = true
): UseAsyncOptionsResult<T> {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(enabled)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [trigger, setTrigger] = useState(0)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  function refetch() {
    setTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setIsError(false)
    setError(null)

    void fetcherRef
      .current()
      .then((res) => {
        if (isMounted) {
          setData(res)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const formattedError = err instanceof Error ? err : new Error('Failed to load options')
          setError(formattedError)
          setIsError(true)
          setIsLoading(false)
          setData([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [trigger, enabled, ...deps])

  return {
    data,
    isLoading,
    isError,
    error,
    isEmpty: !isLoading && !isError && data.length === 0,
    refetch
  }
}
