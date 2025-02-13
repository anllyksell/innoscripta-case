import axios from 'axios'
import { Article } from '../types/Article'
import { Category } from '../types/Category'
import { NewsAdapter } from './NewsAdapter'

interface NewsAPICategory {
  sources: { id: string; name: string }[]
}

interface NewsAPIArticleItem {
  title?: string
  description?: string
  url?: string
  source?: { name?: string }
  author?: string
  publishedAt?: string
  urlToImage?: string
}

interface NewsAPIArticle {
  articles: NewsAPIArticleItem[]
  totalResults: number
}

export class NewsAPIAdapter implements NewsAdapter {
  private apiKey = '9acb521e5f0a49128f15b9424bf5ffb5'

  fetchCategories = async (): Promise<Category[]> => {
    try {
      const response = await axios.get<NewsAPICategory>(
        `https://newsapi.org/v2/top-headlines/sources?apiKey=${this.apiKey}`,
      )
      return response.data.sources.map((item: { id: string; name: string }) => ({
        id: item.id,
        name: item.name,
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories')
    }
  }

  fetchArticles = async (
    page: number = 1,
    query?: string,
    filters?: { fromDate?: string; toDate?: string; category?: string },
  ): Promise<Article> => {
    let url = `https://newsapi.org/v2/everything?apiKey=${this.apiKey}&page=${page}&pageSize=10`
    if (query) url += `&q=${query}`
    if (filters?.fromDate) url += `&from=${filters.fromDate}`
    if (filters?.toDate) url += `&to=${filters.toDate}`
    if (filters?.category) url += `&sources=${filters.category}`

    try {
      const response = await axios.get<NewsAPIArticle>(url)
      const articles = response.data.articles.map(item => ({
        id: item.url || '',
        title: item.title,
        description: item.description,
        url: item.url,
        source: item.source?.name,
        category: filters?.category || 'General',
        author: item.author || 'Unknown',
        publishedAt: item.publishedAt,
        imageUrl: item.urlToImage,
      }))
      return { totalResults: response.data.totalResults, articles }
    } catch (error) {
      console.error('Error fetching articles:', error)
      throw new Error('Failed to fetch articles')
    }
  }
}
