import { Box, CircularProgress } from '@mui/material'
import { useNewsStore } from '../../store/useNewsStore'
import './MainPage.css'

const MainPage = () => {
  const { articles, pending } = useNewsStore(state => state)

  return (
    <div className="news-container">
      {pending ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <CircularProgress />
        </Box>
      ) : (
        articles.map((n, i) => (
          <div key={`article-${i}`} className="news-card">
            {n.image && <img src={n.image} alt={n.title} className="news-image" />}
            <h2 className="news-title">{n.title}</h2>
            <p className="news-description">{n.description}</p>
            <a href={n.url} className="news-link" target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))
      )}
    </div>
  )
}

export default MainPage
