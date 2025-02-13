import { useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useNewsStore } from '../store/useNewsStore'

const FiltersModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { setFilters, filters, categories, selectedSource, fetchCategories } = useNewsStore(
    state => state,
  )
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [category, setCategory] = useState(filters.category ?? categories?.[0]?.id ?? '')

  useEffect(() => {
    setFromDate(filters.fromDate || '')
    setToDate(filters.toDate || '')
    setCategory(filters.category ?? categories?.[0]?.id ?? '')
  }, [filters, categories])

  useEffect(() => {
    fetchCategories()
  }, [selectedSource])

  const handleApplyFilters = () => {
    setFilters({ fromDate, toDate, category })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 300, mx: 'auto', mt: '20vh' }}>
        <Typography variant="h6">Filters</Typography>
        <TextField
          label="From Date"
          type="date"
          fullWidth
          margin="normal"
          value={fromDate}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={e => setFromDate(e.target.value)}
        />
        <TextField
          label="To Date"
          type="date"
          fullWidth
          margin="normal"
          value={toDate}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={e => setToDate(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel shrink={true}>Category</InputLabel>
          <Select value={category} onChange={e => setCategory(e.target.value)} displayEmpty>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleApplyFilters} sx={{ mt: 2 }}>
          Apply
        </Button>
      </Box>
    </Modal>
  )
}

export default FiltersModal
