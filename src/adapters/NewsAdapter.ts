import { Article } from '../types/Article'
import { Category } from '../types/Category'

export interface NewsAdapter {
  fetchArticles: (
    page: number,
    query?: string,
    filters?: { fromDate?: string; toDate?: string; category?: string },
  ) => Promise<Article>
  fetchCategories: () => Promise<Category[]>
}
