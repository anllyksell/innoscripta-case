import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import InputBase from '@mui/material/InputBase'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { SOURCE, useNewsStore } from '../store/useNewsStore'
import { Button } from '@mui/material'
import FiltersModal from './FiltersModal'
import { useNewsFetcher } from '../hooks/useArticleFetch'

const StyledButton = styled(Button)({
  fontWeight: 'bold',
  padding: '8px 16px',
  backgroundColor: '#1976d2',
  color: 'white',
  '&:hover': {
    backgroundColor: '#115293',
  },
})

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const { filters, setFilters, currentPage, totalResults, selectedSource, setSelectedSource } =
    useNewsStore(state => state)
  const fetchArticles = useNewsFetcher()
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSourceSelect = (source: SOURCE) => {
    setSelectedSource(source)
    handleClose()
  }

  const handleArticleFetch = () => {
    fetchArticles(currentPage, searchQuery, filters)
  }

  React.useEffect(() => {
    const savedSource = localStorage.getItem('selectedSource')
    const savedFilters = localStorage.getItem('filters')
    if (savedSource) {
      setSelectedSource(savedSource as SOURCE)
    }
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters))
    }
  }, [])

  React.useEffect(() => {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('filters', JSON.stringify(filters))
      localStorage.setItem('selectedSource', selectedSource)
    })
    return () => {
      window.removeEventListener('beforeunload', () => {
        localStorage.setItem('filters', JSON.stringify(filters))
        localStorage.setItem('selectedSource', selectedSource)
      })
    }
  }, [filters, selectedSource])

  React.useEffect(() => {
    if (totalResults > 0) {
      handleArticleFetch()
    }
  }, [currentPage, totalResults])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ paddingX: 0.1 }}>
          <StyledButton onClick={handleClick}>Sources</StyledButton>
          <StyledButton onClick={() => setFiltersOpen(true)}>Filters</StyledButton>
          <FiltersModal open={filtersOpen} onClose={() => setFiltersOpen(false)} />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => handleSourceSelect(SOURCE.NEWSAPI)}
              sx={{
                backgroundColor:
                  selectedSource === SOURCE.NEWSAPI ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                fontWeight: selectedSource === SOURCE.NEWSAPI ? 'bold' : 'normal',
              }}
            >
              News API
            </MenuItem>
            <MenuItem
              onClick={() => handleSourceSelect(SOURCE.GUARDIAN)}
              sx={{
                backgroundColor:
                  selectedSource === SOURCE.GUARDIAN ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                fontWeight: selectedSource === SOURCE.GUARDIAN ? 'bold' : 'normal',
              }}
            >
              Guardian
            </MenuItem>
            <MenuItem
              onClick={() => handleSourceSelect(SOURCE.NYTIMES)}
              sx={{
                backgroundColor:
                  selectedSource === SOURCE.NYTIMES ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                fontWeight: selectedSource === SOURCE.NYTIMES ? 'bold' : 'normal',
              }}
            >
              NY TIMES
            </MenuItem>
          </Menu>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 1,
                backgroundColor: alpha('#ffffff', 0.15),
                '&:hover': { backgroundColor: alpha('#ffffff', 0.25) },
                padding: '4px 10px',
                marginRight: 2,
              }}
            >
              <InputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                sx={{ marginLeft: 1, color: 'inherit' }}
              />
            </Box>
            <StyledButton onClick={handleArticleFetch}>Search</StyledButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar
