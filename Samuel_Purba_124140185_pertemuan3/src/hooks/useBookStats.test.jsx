import React from 'react'
import { render, screen } from '@testing-library/react'
import useBookStats from './useBookStats'

/**
 * Test untuk custom hook useBookStats
 */

// Test component untuk gunakan hook
function TestComponent({ books }) {
  const stats = useBookStats(books)
  
  return (
    <div>
      <span data-testid="total">{stats.total}</span>
      <span data-testid="owned">{stats.owned}</span>
      <span data-testid="reading">{stats.reading}</span>
      <span data-testid="toBuy">{stats.toBuy}</span>
      <span data-testid="completion">{stats.completionRate}</span>
    </div>
  )
}

describe('useBookStats Hook', () => {
  test('returns zero stats when books array is empty', () => {
    render(<TestComponent books={[]} />)
    
    expect(screen.getByTestId('total').textContent).toBe('0')
    expect(screen.getByTestId('owned').textContent).toBe('0')
    expect(screen.getByTestId('reading').textContent).toBe('0')
    expect(screen.getByTestId('toBuy').textContent).toBe('0')
    expect(screen.getByTestId('completion').textContent).toBe('0')
  })

  test('returns correct counts for each status', () => {
    const mockBooks = [
      { id: '1', status: 'milik' },
      { id: '2', status: 'milik' },
      { id: '3', status: 'baca' },
      { id: '4', status: 'beli' }
    ]
    
    render(<TestComponent books={mockBooks} />)
    
    expect(screen.getByTestId('total').textContent).toBe('4')
    expect(screen.getByTestId('owned').textContent).toBe('2')
    expect(screen.getByTestId('reading').textContent).toBe('1')
    expect(screen.getByTestId('toBuy').textContent).toBe('1')
    expect(screen.getByTestId('completion').textContent).toBe('50')
  })

  test('calculates completion rate correctly', () => {
    const mockBooks = [
      { id: '1', status: 'milik' },
      { id: '2', status: 'milik' },
      { id: '3', status: 'milik' },
      { id: '4', status: 'baca' },
      { id: '5', status: 'beli' }
    ]
    
    render(<TestComponent books={mockBooks} />)
    
    expect(screen.getByTestId('completion').textContent).toBe('60')
  })
})