import { useState, useEffect } from 'react'

/**
 * Custom Hook: useLocalStorage
 * Hook untuk menyimpan dan memuat data dari localStorage secara reaktif
 * 
 * @param {string} key - Key untuk localStorage
 * @param {*} initialValue - Nilai awal jika belum ada di localStorage
 * @returns {[value, setValue]} - Nilai saat ini dan fungsi untuk mengubahnya
 */
function useLocalStorage(key, initialValue) {
  // Inisialisasi state dengan lazy initializer
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  // Efek untuk menyimpan ke localStorage setiap kali nilai berubah
  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(storedValue)
      window.localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export default useLocalStorage