import React from 'react'
import { useBookContext } from '../../context/BookContext'
import useBookStats from '../../hooks/useBookStats'
import './Stats.css'

/**
 * Stats Component
 * Halaman statistik yang menampilkan grafik buku berdasarkan status
 */
function Stats() {
  const { books } = useBookContext()
  const stats = useBookStats(books)

  // Warna untuk setiap status
  const statusColors = {
    total: '#4a5568',
    owned: '#48bb78',
    reading: '#ed8936',
    toBuy: '#ed3333'
  }

  // Data untuk chart
  const chartData = [
    { label: 'Total', value: stats.total, color: statusColors.total },
    { label: 'Milik', value: stats.owned, color: statusColors.owned },
    { label: 'Baca', value: stats.reading, color: statusColors.reading },
    { label: 'Beli', value: stats.toBuy, color: statusColors.toBuy }
  ]

  // Hitung persentase untuk masing-masing status
  const getStatusPercentage = (count) => {
    return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
  }

  return (
    <div className="stats">
      <h2 className="page-title">Statistik Buku</h2>
      
      <div className="stats-summary">
        <div className="stat-card total">
          <h3>Total Buku</h3>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-icon">📚</div>
        </div>
        
        <div className="stat-card owned">
          <h3>Milik</h3>
          <div className="stat-value">{stats.owned}</div>
          <div className="stat-icon">✓</div>
        </div>
        
        <div className="stat-card reading">
          <h3>Sedang Dibaca</h3>
          <div className="stat-value">{stats.reading}</div>
          <div className="stat-icon">📖</div>
        </div>
        
        <div className="stat-card toBuy">
          <h3>Ingin Dibeli</h3>
          <div className="stat-value">{stats.toBuy}</div>
          <div className="stat-icon">💰</div>
        </div>
      </div>

      <div className="stats-chart">
        <h3>Distribusi Status</h3>
        
        <div className="chart-bars">
          {chartData.map((item) => (
            <div key={item.label} className="chart-item">
              <div className="chart-label">{item.label}</div>
              <div className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{ 
                    width: `${getStatusPercentage(item.value)}%`,
                    backgroundColor: item.color
                  }}
                ></div>
                <span className="chart-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {stats.total > 0 && (
        <div className="stats-info">
          <p>Progress memiliki buku: <strong>{stats.completionRate}%</strong></p>
        </div>
      )}
    </div>
  )
}

export default Stats