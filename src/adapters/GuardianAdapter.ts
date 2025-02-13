import axios from 'axios'
import { Article } from '../types/Article'
import { Category } from '../types/Category'
import { NewsAdapter } from './NewsAdapter'

interface GuardianCategory {
  response: { results: { id: string; webTitle: string }[] }
}

interface GuardianArticleItem {
  id: string
  webTitle?: string
  fields?: { trailText?: string; byline?: string }
  webUrl?: string
  sectionName?: string
  webPublicationDate?: string
}

interface GuardianArticle {
  response: { results: GuardianArticleItem[]; total: number }
}

export class GuardianAdapter implements NewsAdapter {
  private apiKey = 'bdf48ad7-0c0d-40cd-be75-f4de56833fe0'

  fetchCategories = async (): Promise<Category[]> => {
    const res = await axios.get<GuardianCategory>(
      `https://content.guardianapis.com/sections?api-key=${this.apiKey}`,
    )
    return res.data.response.results.map((item: { id: string; webTitle: string }) => ({
      id: item.id,
      name: item.webTitle,
    }))
  }

  fetchArticles = async (
    page: number = 1,
    query?: string,
    filters?: { fromDate?: string; toDate?: string; category?: string },
  ): Promise<Article> => {
    let url = `https://content.guardianapis.com/search?api-key=${this.apiKey}&q=${
      query || ''
    }&page=${page}&page-size=10`
    if (filters?.fromDate) url += `&from-date=${filters.fromDate}`
    if (filters?.toDate) url += `&to-date=${filters.toDate}`
    if (filters?.category) url += `&section=${filters.category}`

    try {
      const res = await axios.get<GuardianArticle>(url)
      const articles = res.data.response.results.map(item => ({
        id: item.id,
        title: item.webTitle,
        description: item.fields?.trailText || '',
        url: item.webUrl,
        source: 'The Guardian',
        category: item.sectionName,
        author: item.fields?.byline || 'Unknown',
        publishedAt: item.webPublicationDate,
      }))
      return { articles, totalResults: res.data.response.total }
    } catch {
      return { articles: [], totalResults: 0 }
    }
  }
}
