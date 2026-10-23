import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import useLocalStorage from './useLocalStorage'

/**
 * Test untuk custom hook useLocalStorage
 */

// Test component untuk gunakan hook
function TestComponent({ initialValue }) {
  const [value, setValue] = useLocalStorage('test-key', initialValue)
  
  return (
    <div>
      <span data-testid="value">{value}</span>
      <button 
        onClick={() => setValue('new-value')}
        data-testid="change-btn"
      >
        Change
      </button>
    </div>
  )
}

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('returns initial value when key does not exist', () => {
    render(<TestComponent initialValue="initial" />)
    
    expect(screen.getByTestId('value').textContent).toBe('initial')
  })

  test('returns existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'))
    
    render(<TestComponent initialValue="default" />)
    
    expect(screen.getByTestId('value').textContent).toBe('existing')
  })

  test('updates state when value changes', () => {
    render(<TestComponent initialValue="initial" />)
    
    expect(screen.getByTestId('value').textContent).toBe('initial')
    
    const changeButton = screen.getByTestId('change-btn')
    fireEvent.click(changeButton)
    
    // Verify state was updated
    expect(screen.getByTestId('value').textContent).toBe('new-value')
  })
})