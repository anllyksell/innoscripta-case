import axios from 'axios'
import { Article } from '../types/Article'
import { Category } from '../types/Category'
import { NewsAdapter } from './NewsAdapter'

interface NYTimesArticleItem {
  _id: string
  headline?: { main?: string }
  abstract?: string
  web_url?: string
  section_name?: string
  byline?: { original: string }
  pub_date?: string
  multimedia?: { url: string }[]
}

interface NYTimesArticle {
  response: { docs: NYTimesArticleItem[]; meta: { hits: number } }
}

export class NYTimesAdapter implements NewsAdapter {
  private apiKey = '8goWHmmW768ttNicPV3Fn2qB3ppa1c3A'

  fetchCategories = async (): Promise<Category[]> => {
    const sections = [
      'arts',
      'automobiles',
      'books',
      'business',
      'fashion',
      'food',
      'health',
      'home',
      'insider',
      'magazine',
      'movies',
      'nyregion',
      'obituaries',
      'opinion',
      'politics',
      'realestate',
      'science',
      'sports',
      'sundayreview',
      'technology',
      'theater',
      't-magazine',
      'travel',
      'upshot',
      'us',
      'world',
    ]
    return sections.map(section => ({
      id: section,
      name: section.charAt(0).toUpperCase() + section.slice(1),
    }))
  }

  fetchArticles = async (
    page: number = 1,
    query?: string,
    filters?: { fromDate?: string; toDate?: string; category?: string },
  ): Promise<Article> => {
    const offset = (page - 1) * 10
    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${this.apiKey}&q=${
      query || ''
    }&offset=${offset}`
    if (filters?.fromDate) url += `&begin_date=${filters.fromDate.replace(/-/g, '')}`
    if (filters?.toDate) url += `&end_date=${filters.toDate.replace(/-/g, '')}`
    if (filters?.category) url += `&fq=news_desk:("${filters.category}")`

    try {
      const res = await axios.get<NYTimesArticle>(url)
      const articles = res.data.response.docs.map(item => ({
        id: item._id,
        title: item.headline?.main,
        description: item.abstract,
        url: item.web_url,
        source: 'The New York Times',
        category: item.section_name || 'General',
        author: item.byline?.original || 'Unknown',
        publishedAt: item.pub_date,
        imageUrl: item.multimedia?.[0]?.url || '',
      }))
      return { articles, totalResults: res.data.response.meta.hits }
    } catch (error) {
      console.error('Error fetching articles:', error)
      throw new Error('Failed to fetch articles')
    }
  }
}
