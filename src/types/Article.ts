export interface Article {
  articles: ArticleItem[]
  totalResults: number
}

export interface ArticleItem {
  id: string
  title?: string
  description?: string
  url?: string
  source?: string
  category?: string
  author?: string
  publishedAt?: string
  image?: string
}
