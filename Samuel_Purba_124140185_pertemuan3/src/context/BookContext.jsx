import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Inisialisasi reducer untuk manajemen state buku
const initialState = {
  books: [],
  filterStatus: 'semua',
  searchTerm: ''
}

// Action types
const ADD_BOOK = 'ADD_BOOK'
const UPDATE_BOOK = 'UPDATE_BOOK'
const DELETE_BOOK = 'DELETE_BOOK'
const SET_FILTER = 'SET_FILTER'
const SET_SEARCH = 'SET_SEARCH'
const LOAD_BOOKS = 'LOAD_BOOKS'

// Reducer function
function bookReducer(state, action) {
  switch (action.type) {
    case ADD_BOOK:
      return {
        ...state,
        books: [...state.books, action.payload]
      }
    case UPDATE_BOOK:
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        )
      }
    case DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload)
      }
    case SET_FILTER:
      return {
        ...state,
        filterStatus: action.payload
      }
    case SET_SEARCH:
      return {
        ...state,
        searchTerm: action.payload
      }
    case LOAD_BOOKS:
      return {
        ...state,
        books: action.payload
      }
    default:
      return state
  }
}

// Buat context
const BookContext = createContext()

// Provider component
export function BookProvider({ children }) {
  const [state, dispatch] = useReducer(bookReducer, initialState)

  // Load books dari localStorage ketika komponen pertama kali dirender
  useEffect(() => {
    const storedBooks = localStorage.getItem('books')
    if (storedBooks) {
      dispatch({ type: LOAD_BOOKS, payload: JSON.parse(storedBooks) })
    }
  }, [])

  // Save books ke localStorage setiap kali state berubah
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(state.books))
  }, [state.books])

  // Action creators
  const addBook = (book) => {
    dispatch({ type: ADD_BOOK, payload: book })
  }

  const updateBook = (book) => {
    dispatch({ type: UPDATE_BOOK, payload: book })
  }

  const deleteBook = (id) => {
    dispatch({ type: DELETE_BOOK, payload: id })
  }

  const setFilter = (status) => {
    dispatch({ type: SET_FILTER, payload: status })
  }

  const setSearch = (term) => {
    dispatch({ type: SET_SEARCH, payload: term })
  }

  return (
    <BookContext.Provider value={{
      books: state.books,
      filterStatus: state.filterStatus,
      searchTerm: state.searchTerm,
      addBook,
      updateBook,
      deleteBook,
      setFilter,
      setSearch
    }}>
      {children}
    </BookContext.Provider>
  )
}

// Custom hook untuk mengakses context
export const useBookContext = () => {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider')
  }
  return context
}