import '@testing-library/jest-dom'

// Mock canvas for react-three-fiber
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  drawImage: jest.fn(),
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawWindow: jest.fn(),
  fillText: jest.fn(),
}))

// Mock fetch for API tests
global.fetch = jest.fn()

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  cb(0)
  return 1
})
