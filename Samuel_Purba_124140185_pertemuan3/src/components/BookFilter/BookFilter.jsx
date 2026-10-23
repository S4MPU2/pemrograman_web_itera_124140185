import React from 'react'
import PropTypes from 'prop-types'
import { useBookContext } from '../../context/BookContext'
import './BookFilter.css'

/**
 * BookFilter Component
 * Komponen untuk filter buku berdasarkan status dan pencarian
 */
function BookFilter() {
  const { books, filterStatus, searchTerm, setFilter, setSearch } = useBookContext()

  // Daftar status untuk filter
  const statusOptions = [
    { value: 'semua', label: 'Semua Buku' },
    { value: 'milik', label: 'Milik' },
    { value: 'baca', label: 'Sedang Dibaca' },
    { value: 'beli', label: 'Ingin Dibeli' }
  ]

  return (
    <div className="book-filter">
      <div className="filter-container">
        {/* Filter Status */}
        <div className="filter-group">
          <label htmlFor="status-filter">Filter Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilter(e.target.value)}
            className="status-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pencarian */}
        <div className="filter-group search-group">
          <label htmlFor="search">🔍 Cari Buku:</label>
          <input
            type="text"
            id="search"
            placeholder="Judul atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Info jumlah buku */}
        <div className="filter-info">
          <span className="book-count">{books.length} buku</span>
        </div>
      </div>
    </div>
  )
}

export default BookFilter