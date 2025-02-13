import { availableAdapters, useNewsStore } from '../store/useNewsStore'

export const useNewsFetcher = () => {
  const { selectedSource, setPending, setArticles } = useNewsStore(state => state)

  const fetchArticles = async (
    page: number,
    query?: string,
    filters?: { fromDate?: string; toDate?: string; category?: string },
  ) => {
    const adapter = availableAdapters[selectedSource]
    if (!adapter) return

    const response = await adapter.fetchArticles(page, query, filters)
    setArticles(
      response.articles.sort(
        (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
      ),
      response.totalResults,
    )
    setPending(false)
  }

  return fetchArticles
}
