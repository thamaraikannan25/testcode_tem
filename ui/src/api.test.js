import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import API from './api'

// Mock axios
vi.mock('axios', () => ({
  create: vi.fn().mockReturnValue({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  })
}))

// Mock config
vi.mock('./config.json', () => ({
  default: {
    baseURL: 'http://localhost:4000'
  }
}))

describe('API', () => {
  let mockApiClient

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    // Get the mocked axios instance
    mockApiClient = axios.create()
  })

  describe('getGreeting', () => {
    it('should call axios.get with the correct parameters', async () => {
      // Mock response
      const mockResponse = {
        data: { message: 'Hello Test!' },
        status: 200
      }
      mockApiClient.get.mockResolvedValue(mockResponse)

      // Call the API function
      const result = await API.getGreeting('Test', 'Hello', false)

      // Check that axios.get was called with the correct URL and parameters
      expect(mockApiClient.get).toHaveBeenCalledWith('/greet', {
        params: { name: 'Test', greeting: 'Hello', excited: false }
      })
      
      // Verify the result
      expect(result).toEqual(mockResponse)
    })

    it('should handle the excited parameter correctly', async () => {
      // Mock response
      const mockResponse = {
        data: { message: 'HELLO TEST!!!' },
        status: 200
      }
      mockApiClient.get.mockResolvedValue(mockResponse)

      // Call the API function with excited=true
      const result = await API.getGreeting('Test', 'Hello', true)

      // Check that axios.get was called with the correct URL and parameters
      expect(mockApiClient.get).toHaveBeenCalledWith('/greet', {
        params: { name: 'Test', greeting: 'Hello', excited: true }
      })
      
      // Verify the result
      expect(result).toEqual(mockResponse)
    })

    it('should work with only the required name parameter', async () => {
      // Mock response
      const mockResponse = {
        data: { message: 'Hello Test!' },
        status: 200
      }
      mockApiClient.get.mockResolvedValue(mockResponse)

      // Call the API function with only the name parameter
      const result = await API.getGreeting('Test')

      // Check that axios.get was called with the correct URL and parameters
      expect(mockApiClient.get).toHaveBeenCalledWith('/greet', {
        params: { name: 'Test', greeting: undefined, excited: undefined }
      })
      
      // Verify the result
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      // Mock error response
      const mockError = new Error('Network Error')
      mockApiClient.get.mockRejectedValue(mockError)

      // Call the API function and expect it to reject
      await expect(API.getGreeting('Test')).rejects.toThrow('Network Error')
    })
  })
})