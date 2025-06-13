import { delay } from '../index'

let clients = null

const loadClients = async () => {
  if (!clients) {
    const response = await import('../mockData/clients.json')
    clients = response.default
  }
  return clients
}

const clientService = {
  async getAll() {
    await delay(300)
    const data = await loadClients()
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const data = await loadClients()
    const client = data.find(c => c.id === id)
    return client ? { ...client } : null
  },

  async create(clientData) {
    await delay(400)
    const data = await loadClients()
    const newClient = {
      id: Date.now().toString(),
      ...clientData,
      projectIds: []
    }
    data.push(newClient)
    return { ...newClient }
  },

  async update(id, clientData) {
    await delay(350)
    const data = await loadClients()
    const index = data.findIndex(c => c.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...clientData }
      return { ...data[index] }
    }
    throw new Error('Client not found')
  },

  async delete(id) {
    await delay(250)
    const data = await loadClients()
    const index = data.findIndex(c => c.id === id)
    if (index !== -1) {
      const deleted = data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Client not found')
  }
}

export default clientService