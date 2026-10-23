import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BookProvider } from './context/BookContext'
import App from './App'

/**
 * Test untuk komponen App utama
 */
describe('App Component', () => {
  test('renders header dengan judul aplikasi', () => {
    render(
      <BrowserRouter>
        <BookProvider>
          <App />
        </BookProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Manajemen Buku Pribadi/i)).toBeInTheDocument()
  })

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <BookProvider>
          <App />
        </BookProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByText('Beranda')).toBeInTheDocument()
    expect(screen.getByText('Statistik')).toBeInTheDocument()
  })

  test('renders add book button', () => {
    render(
      <BrowserRouter>
        <BookProvider>
          <App />
        </BookProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByRole('button', { name: /\+/i })).toBeInTheDocument()
  })
})