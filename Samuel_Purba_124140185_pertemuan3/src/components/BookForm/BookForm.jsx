import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useBookContext } from '../../context/BookContext'
import './BookForm.css'

/**
 * BookForm Component
 * Form untuk menambah atau mengedit data buku
 * Menggunakan error handling untuk validasi input
 */
function BookForm({ bookToEdit, onClose }) {
  const { addBook, updateBook } = useBookContext()
  
  // State untuk form input
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'milik'
  })
  
  // State untuk error validasi
  const [errors, setErrors] = useState({})
  
  // Jika ada buku untuk diedit, isi form dengan data buku tersebut
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        status: bookToEdit.status || 'milik'
      })
    }
  }, [bookToEdit])

  /**
   * Fungsi untuk menangani perubahan input
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error jika user sudah mengisi
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * Fungsi untuk validasi form
   */
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul buku wajib diisi'
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Fungsi untuk menangani submit form
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Buat objek buku baru dengan ID unik
    const book = {
      id: bookToEdit?.id || Date.now().toString(),
      ...formData
    }
    
    if (bookToEdit) {
      updateBook(book)
    } else {
      addBook(book)
    }
    
    // Reset form dan tutup modal
    setFormData({ title: '', author: '', status: 'milik' })
    setErrors({})
    onClose()
  }

  /**
   * Fungsi untuk menutup modal
   */
  const handleClose = () => {
    setFormData({ title: '', author: '', status: 'milik' })
    setErrors({})
    onClose()
  }

  return (
    <div className="book-form-container">
      <div className="book-form-card">
        <h2>{bookToEdit ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="book-form">
          {/* Input Judul */}
          <div className="form-group">
            <label htmlFor="title">Judul Buku *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Masukkan judul buku"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          {/* Input Penulis */}
          <div className="form-group">
            <label htmlFor="author">Nama Penulis *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
              placeholder="Masukkan nama penulis"
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
          
          {/* Select Status */}
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="milik">Milik</option>
              <option value="baca">Sedang Dibaca</option>
              <option value="beli">Ingin Dibeli</option>
            </select>
          </div>
          
          {/* Tombol Action */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Batal
            </button>
            <button type="submit" className="btn-submit">
              {bookToEdit ? 'Simpan Perubahan' : 'Tambah Buku'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

BookForm.propTypes = {
  bookToEdit: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
}

BookForm.defaultProps = {
  bookToEdit: null
}

export default BookForm