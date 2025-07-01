import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import API from './api'

// Mock the API module
vi.mock('./api', () => ({
  default: {
    getGreeting: vi.fn()
  }
}))

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  it('renders the application title', () => {
    render(<App />)
    expect(screen.getByText('Sample App')).toBeInTheDocument()
  })

  it('updates state when input values change', () => {
    render(<App />)
    
    // Find the input elements
    const nameInput = screen.getByLabelText(/Name:/i)
    const greetingInput = screen.getByLabelText(/Greeting:/i)
    const excitedCheckbox = screen.getByLabelText(/Excited/i)
    
    // Change input values
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(greetingInput, { target: { value: 'Hi' } })
    fireEvent.click(excitedCheckbox)
    
    // Check that inputs reflect the new values
    expect(nameInput.value).toBe('Test User')
    expect(greetingInput.value).toBe('Hi')
    expect(excitedCheckbox.checked).toBe(true)
  })

  it('calls the API when the button is clicked', async () => {
    // Mock successful API response
    API.getGreeting.mockResolvedValue({
      status: 200,
      data: { message: 'Hello Test User!' }
    })
    
    render(<App />)
    
    // Fill in the name input (required)
    const nameInput = screen.getByLabelText(/Name:/i)
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    
    // Click the button to get a greeting
    const button = screen.getByText('Get a greeting')
    fireEvent.click(button)
    
    // Verify API was called with correct parameters
    expect(API.getGreeting).toHaveBeenCalledWith('Test User', '', false)
    
    // Wait for the response to be rendered
    await waitFor(() => {
      expect(screen.getByText('Hello Test User!')).toBeInTheDocument()
    })
  })

  it('does not call the API when name is empty', () => {
    render(<App />)
    
    // Click the button without filling in the name
    const button = screen.getByText('Get a greeting')
    fireEvent.click(button)
    
    // Verify API was not called
    expect(API.getGreeting).not.toHaveBeenCalled()
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
    API.getGreeting.mockRejectedValue(new Error('API Error'))
    
    render(<App />)
    
    // Fill in the name input
    const nameInput = screen.getByLabelText(/Name:/i)
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    
    // Click the button to get a greeting
    const button = screen.getByText('Get a greeting')
    fireEvent.click(button)
    
    // Verify API was called
    expect(API.getGreeting).toHaveBeenCalled()
    
    // Wait for error to be handled
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalled()
    })
    
    consoleErrorMock.mockRestore()
  })
})