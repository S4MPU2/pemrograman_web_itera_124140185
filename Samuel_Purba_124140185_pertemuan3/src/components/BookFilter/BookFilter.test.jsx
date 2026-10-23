import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BookProvider } from '../../context/BookContext'
import BookFilter from './BookFilter'

/**
 * Test untuk komponen BookFilter
 */
describe('BookFilter Component', () => {
  test('renders filter controls', () => {
    render(
      <BookProvider>
        <BookFilter />
      </BookProvider>
    )
    
    expect(screen.getByText(/Filter Status:/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('renders search input', () => {
    render(
      <BookProvider>
        <BookFilter />
      </BookProvider>
    )
    
    expect(screen.getByPlaceholderText(/Judul atau penulis/i)).toBeInTheDocument()
  })

  test('can change status filter', () => {
    render(
      <BookProvider>
        <BookFilter />
      </BookProvider>
    )
    
    const statusSelect = screen.getByRole('combobox')
    fireEvent.change(statusSelect, { target: { value: 'milik' } })
    
    expect(statusSelect.value).toBe('milik')
  })

  test('can type in search input', () => {
    render(
      <BookProvider>
        <BookFilter />
      </BookProvider>
    )
    
    const searchInput = screen.getByPlaceholderText(/Judul atau penulis/i)
    fireEvent.change(searchInput, { target: { value: 'React' } })
    
    expect(searchInput.value).toBe('React')
  })
})