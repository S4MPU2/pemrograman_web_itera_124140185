import React from 'react'
import { render, screen } from '@testing-library/react'
import { BookProvider } from '../../context/BookContext'
import Stats from './Stats'

/**
 * Test untuk komponen Stats
 */
describe('Stats Component', () => {
  test('renders page title', () => {
    render(
      <BookProvider>
        <Stats />
      </BookProvider>
    )
    
    expect(screen.getByText(/Statistik Buku/i)).toBeInTheDocument()
  })

  test('displays stat cards', () => {
    render(
      <BookProvider>
        <Stats />
      </BookProvider>
    )
    
    expect(screen.getByText('Total Buku')).toBeInTheDocument()
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument()
    expect(screen.getByText('Ingin Dibeli')).toBeInTheDocument()
  })

  test('displays zero stats when no books', () => {
    render(
      <BookProvider>
        <Stats />
      </BookProvider>
    )
    
    // All stat values should be 0
    const statValues = screen.getAllByText('0')
    expect(statValues.length).toBeGreaterThan(0)
  })
})