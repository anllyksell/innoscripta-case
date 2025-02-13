import { create } from 'zustand'
import { ArticleItem } from '../types/Article'
import { GuardianAdapter } from '../adapters/GuardianAdapter'
import { NewsAPIAdapter } from '../adapters/NewsAPIAdapter'
import { NYTimesAdapter } from '../adapters/NYTimesAdapter'
import { NewsAdapter } from '../adapters/NewsAdapter'
import { Category } from '../types/Category'

export const availableAdapters: Record<SOURCE, NewsAdapter> = {
  Guardian: new GuardianAdapter(),
  NewsAPI: new NewsAPIAdapter(),
  NYTimes: new NYTimesAdapter(),
}

export enum SOURCE {
  NEWSAPI = 'NewsAPI',
  GUARDIAN = 'Guardian',
  NYTIMES = 'NYTimes',
}

type NewsState = {
  pending: boolean
  selectedSource: SOURCE
  categories: Category[]
  filters: { fromDate?: string; toDate?: string; category?: string }
  totalResults: number
  pageSize: number
  currentPage: number
  articles: ArticleItem[]
  error: string | null
  setPending: (pending: boolean) => void
  setSelectedSource: (source: SOURCE) => void
  setFilters: (filters: { fromDate?: string; toDate?: string; category?: string }) => void
  setCurrentPage: (page: number) => void
  setArticles: (articles: ArticleItem[], totalResults: number) => void
  setError: (error: string | null) => void
  fetchCategories: () => Promise<void>
}

export const useNewsStore = create<NewsState>((set, get) => ({
  pending: false,
  selectedSource: SOURCE.NEWSAPI,
  categories: [],
  filters: {},
  totalResults: 0,
  pageSize: 10,
  currentPage: 1,
  articles: [],
  error: null,
  setError: (error: string | null) => set({ error }),
  setPending: (pending: boolean) => set({ pending }),
  setSelectedSource: (source: SOURCE) => {
    set({ selectedSource: source })
    get().fetchCategories()
  },
  setFilters: filters => set({ filters }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
  setArticles: (articles: ArticleItem[], totalResults: number) => set({ articles, totalResults }),
  fetchCategories: async () => {
    const adapter = availableAdapters[get().selectedSource]
    if (!adapter) return
    const categories = await adapter.fetchCategories()
    set({ categories })
  },
}))
