import { useMemo } from 'react'

/**
 * Custom Hook: useBookStats
 * Hook untuk menghitung statistik buku dari array buku
 * 
 * @param {Array} books - Array objek buku
 * @returns {Object} - Statistik buku (total, owned, reading, toBuy)
 */
function useBookStats(books) {
  const stats = useMemo(() => {
    const total = books.length
    const owned = books.filter(book => book.status === 'milik').length
    const reading = books.filter(book => book.status === 'baca').length
    const toBuy = books.filter(book => book.status === 'beli').length

    return {
      total,
      owned,
      reading,
      toBuy,
      completionRate: total > 0 ? Math.round((owned / total) * 100) : 0
    }
  }, [books])

  return stats
}

export default useBookStats