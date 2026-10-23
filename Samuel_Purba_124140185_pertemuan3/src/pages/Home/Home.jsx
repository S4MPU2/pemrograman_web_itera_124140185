import React, { useMemo } from 'react'
import { useBookContext } from '../../context/BookContext'
import BookFilter from '../../components/BookFilter/BookFilter'
import BookList from '../../components/BookList/BookList'
import './Home.css'

/**
 * Home Component
 * Halaman utama yang menampilkan filter, pencarian, dan daftar buku
 */
function Home() {
  const { books, filterStatus, searchTerm } = useBookContext()

  // Memoize filter books untuk performa optimal
  const filteredBooks = useMemo(() => {
    let result = books
    
    // Filter berdasarkan status
    if (filterStatus !== 'semua') {
      result = result.filter(book => book.status === filterStatus)
    }
    
    // Filter berdasarkan pencarian
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      result = result.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
      )
    }
    
    return result
  }, [books, filterStatus, searchTerm])

  return (
    <div className="home">
      <h2 className="page-title">Daftar Buku</h2>
      
      <BookFilter />
      
      <BookList books={filteredBooks} />
    </div>
  )
}

export default Home