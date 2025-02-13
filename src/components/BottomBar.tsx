import { Box, Pagination } from '@mui/material'
import { useNewsStore } from '../store/useNewsStore'

const BottomBar = () => {
  const { totalResults, pageSize, currentPage, setCurrentPage } = useNewsStore()
  const pageCount = Math.ceil(totalResults / pageSize)

  if (pageCount <= 1) return null

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 2,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #ddd',
      }}
    >
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={(_, value) => setCurrentPage(value)}
        color="primary"
      />
    </Box>
  )
}

export default BottomBar
