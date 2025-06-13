export { default as projectService } from './api/projectService'
export { default as clientService } from './api/clientService'
export { default as expenseService } from './api/expenseService'
export { default as workerService } from './api/workerService'
export { default as documentService } from './api/documentService'

// Utility function for adding delays to simulate API calls
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))