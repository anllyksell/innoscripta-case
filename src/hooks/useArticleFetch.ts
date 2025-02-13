import { availableAdapters, useNewsStore } from '../store/useNewsStore'

export const useNewsFetcher = () => {
  const { selectedSource, setPending, setArticles, setError } = useNewsStore(state => state)

  const fetchArticles = async (
    page: number,
    query?: string,
    filters?: { fromDate?: string; toDate?: string; category?: string },
  ) => {
    setPending(true)
    setError(null)
    const adapter = availableAdapters[selectedSource]
    if (!adapter) {
      setPending(false)
      setError('No adapter found for the selected source')
      return
    }

    try {
      const response = await adapter.fetchArticles(page, query, filters)
      setArticles(
        response.articles.sort(
          (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
        ),
        response.totalResults,
      )
    } catch (error) {
      console.error('Failed to fetch articles:', error)
      setError('Failed to fetch articles')
    } finally {
      setPending(false)
    }
  }

  return fetchArticles
}
