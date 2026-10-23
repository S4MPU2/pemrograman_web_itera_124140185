import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useBookContext } from '../../context/BookContext'
import './BookList.css'

/**
 * BookList Component
 * Komponen untuk menampilkan daftar buku
 * Menerima props books yang sudah difilter
 */
function BookList({ books }) {
  const { deleteBook } = useBookContext()
  const [bookToEdit, setBookToEdit] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Daftar status dengan warna
  const statusConfig = {
    milik: { label: 'Milik', color: '#48bb78' },
    baca: { label: 'Sedang Dibaca', color: '#ed8936' },
    beli: { label: 'Ingin Dibeli', color: '#ed3333' }
  }

  /**
   * Fungsi untuk menandai buku untuk diedit
   */
  const handleEdit = (book) => {
    setBookToEdit(book)
    setIsModalOpen(true)
    // Trigger modal
    const modal = document.getElementById('book-form-modal')
    if (modal) {
      modal.classList.add('active')
    }
  }

  /**
   * Fungsi untuk menghapus buku
   */
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      deleteBook(id)
    }
  }

  /**
   * Render ikon status buku
   */
  const renderStatusIcon = (status) => {
    const config = statusConfig[status] || statusConfig.milik
    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.color }}
      >
        {config.label}
      </span>
    )
  }

  if (books.length === 0) {
    return (
      <div className="book-list-empty">
        <div className="empty-icon">📚</div>
        <h3>Belum ada buku</h3>
        <p>Mulai dengan menambahkan buku pertama Anda!</p>
      </div>
    )
  }

  return (
    <div className="book-list">
      {books.map(book => (
        <div key={book.id} className="book-card">
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">oleh {book.author}</p>
            {renderStatusIcon(book.status)}
          </div>
          
          <div className="book-actions">
            <button 
              className="btn-edit"
              onClick={() => handleEdit(book)}
              title="Edit buku"
            >
              ✏️
            </button>
            <button 
              className="btn-delete"
              onClick={() => handleDelete(book.id)}
              title="Hapus buku"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired
}

export default BookList