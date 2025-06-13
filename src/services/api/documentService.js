import { delay } from '../index'

let documents = null

const loadDocuments = async () => {
  if (!documents) {
    const response = await import('../mockData/documents.json')
    documents = response.default
  }
  return documents
}

const documentService = {
  async getAll() {
    await delay(300)
    const data = await loadDocuments()
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const data = await loadDocuments()
    const document = data.find(d => d.id === id)
    return document ? { ...document } : null
  },

  async create(documentData) {
    await delay(400)
    const data = await loadDocuments()
    const newDocument = {
      id: Date.now().toString(),
      ...documentData,
      uploadDate: new Date().toISOString().split('T')[0],
      size: Math.floor(Math.random() * 5000) + 100
    }
    data.push(newDocument)
    return { ...newDocument }
  },

  async update(id, documentData) {
    await delay(350)
    const data = await loadDocuments()
    const index = data.findIndex(d => d.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...documentData }
      return { ...data[index] }
    }
    throw new Error('Document not found')
  },

  async delete(id) {
    await delay(250)
    const data = await loadDocuments()
    const index = data.findIndex(d => d.id === id)
    if (index !== -1) {
      const deleted = data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Document not found')
  }
}

export default documentService