import React from 'react'
import { render, screen } from '@testing-library/react'
import { BookProvider } from '../../context/BookContext'
import Home from './Home'

/**
 * Test untuk komponen Home
 */
describe('Home Component', () => {
  test('renders page title', () => {
    render(
      <BookProvider>
        <Home />
      </BookProvider>
    )
    
    expect(screen.getByText(/Daftar Buku/i)).toBeInTheDocument()
  })

  test('renders book filter', () => {
    render(
      <BookProvider>
        <Home />
      </BookProvider>
    )
    
    expect(screen.getByText(/Filter Status:/i)).toBeInTheDocument()
  })

  test('renders empty state when no books', () => {
    render(
      <BookProvider>
        <Home />
      </BookProvider>
    )
    
    expect(screen.getByText(/Belum ada buku/i)).toBeInTheDocument()
  })
})