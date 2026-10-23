import React from 'react'
import { render, screen } from '@testing-library/react'
import { BookProvider } from '../../context/BookContext'
import BookList from './BookList'

/**
 * Test untuk komponen BookList
 */
describe('BookList Component', () => {
  test('renders empty state when no books', () => {
    render(
      <BookProvider>
        <BookList books={[]} />
      </BookProvider>
    )
    
    expect(screen.getByText(/Belum ada buku/i)).toBeInTheDocument()
    expect(screen.getByText(/Mulai dengan menambahkan buku pertama/i)).toBeInTheDocument()
  })

  test('renders books correctly', () => {
    const mockBooks = [
      { id: '1', title: 'React Programming', author: 'John Doe', status: 'milik' },
      { id: '2', title: 'Vue Guide', author: 'Jane Smith', status: 'baca' }
    ]
    
    render(
      <BookProvider>
        <BookList books={mockBooks} />
      </BookProvider>
    )
    
    expect(screen.getByText('React Programming')).toBeInTheDocument()
    expect(screen.getByText(/oleh John Doe/i)).toBeInTheDocument()
    expect(screen.getByText('Vue Guide')).toBeInTheDocument()
  })

  test('renders status badges correctly', () => {
    const mockBooks = [
      { id: '1', title: 'Test Book', author: 'Test Author', status: 'milik' }
    ]
    
    render(
      <BookProvider>
        <BookList books={mockBooks} />
      </BookProvider>
    )
    
    expect(screen.getByText('Milik')).toBeInTheDocument()
  })

  test('renders edit and delete buttons', () => {
    const mockBooks = [
      { id: '1', title: 'Test Book', author: 'Test Author', status: 'milik' }
    ]
    
    render(
      <BookProvider>
        <BookList books={mockBooks} />
      </BookProvider>
    )
    
    // Cek ada tombol edit dan delete
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })
})