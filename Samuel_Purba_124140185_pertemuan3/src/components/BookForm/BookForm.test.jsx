import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BookProvider } from '../../context/BookContext'
import BookForm from './BookForm'

/**
 * Test untuk komponen BookForm
 */
describe('BookForm Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  test('renders form with correct labels', () => {
    render(
      <BookProvider>
        <BookForm onClose={mockOnClose} />
      </BookProvider>
    )
    
    expect(screen.getByText(/Tambah Buku BARU/i)).toBeInTheDocument()
    expect(screen.getByText('Judul Buku *')).toBeInTheDocument()
    expect(screen.getByText('Nama Penulis *')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  test('shows validation errors when submitting empty form', () => {
    render(
      <BookProvider>
        <BookForm onClose={mockOnClose} />
      </BookProvider>
    )
    
    const submitButton = screen.getByRole('button', { name: /Tambah Buku/i })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Judul buku wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Nama penulis wajib diisi')).toBeInTheDocument()
  })

  test('allows input into form fields', () => {
    render(
      <BookProvider>
        <BookForm onClose={mockOnClose} />
      </BookProvider>
    )
    
    const titleInput = screen.getByLabelText(/Judul Buku/i)
    const authorInput = screen.getByLabelText(/Nama Penulis/i)
    
    fireEvent.change(titleInput, { target: { value: 'Test Book Title' } })
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })
    
    expect(titleInput.value).toBe('Test Book Title')
    expect(authorInput.value).toBe('Test Author')
  })

  test('can edit existing book', () => {
    const existingBook = {
      id: '1',
      title: 'Existing Book',
      author: 'Existing Author',
      status: 'milik'
    }
    
    render(
      <BookProvider>
        <BookForm bookToEdit={existingBook} onClose={mockOnClose} />
      </BookProvider>
    )
    
    expect(screen.getByText(/Edit Buku/i)).toBeInTheDocument()
  })
})