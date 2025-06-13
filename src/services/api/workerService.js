import { delay } from '../index'

let workers = null

const loadWorkers = async () => {
  if (!workers) {
    const response = await import('../mockData/workers.json')
    workers = response.default
  }
  return workers
}

const workerService = {
  async getAll() {
    await delay(300)
    const data = await loadWorkers()
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const data = await loadWorkers()
    const worker = data.find(w => w.id === id)
    return worker ? { ...worker } : null
  },

  async create(workerData) {
    await delay(400)
    const data = await loadWorkers()
    const newWorker = {
      id: Date.now().toString(),
      ...workerData,
      projectIds: workerData.projectIds || []
    }
    data.push(newWorker)
    return { ...newWorker }
  },

  async update(id, workerData) {
    await delay(350)
    const data = await loadWorkers()
    const index = data.findIndex(w => w.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...workerData }
      return { ...data[index] }
    }
    throw new Error('Worker not found')
  },

  async delete(id) {
    await delay(250)
    const data = await loadWorkers()
    const index = data.findIndex(w => w.id === id)
    if (index !== -1) {
      const deleted = data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Worker not found')
  }
}

export default workerService