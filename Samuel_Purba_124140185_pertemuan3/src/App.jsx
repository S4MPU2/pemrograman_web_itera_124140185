import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { BookProvider } from './context/BookContext'
import Home from './pages/Home/Home'
import Stats from './pages/Stats/Stats'
import BookForm from './components/BookForm/BookForm'
import './App.css'

/**
 * App Component - Main application with routing
 * Menggunakan React Router untuk navigasi multi-halaman
 */
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <BookProvider>
      <div className="app">
        <header className="app-header">
          <h1>📚 Manajemen Buku Pribadi</h1>
          <nav className="nav-links">
            <Link to="/">Beranda</Link>
            <Link to="/stats">Statistik</Link>
          </nav>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
        
        <button className="add-book-btn" onClick={() => setIsModalOpen(true)}>
          + Tambah Buku
        </button>
        
        {isModalOpen && (
          <div id="book-form-modal" className="modal active">
            <BookForm onClose={() => setIsModalOpen(false)} />
          </div>
        )}
      </div>
    </BookProvider>
  )
}

export default App