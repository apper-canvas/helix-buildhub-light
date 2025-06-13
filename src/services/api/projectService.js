import { delay } from '../index'

let projects = null

const loadProjects = async () => {
  if (!projects) {
    const response = await import('../mockData/projects.json')
    projects = response.default
  }
  return projects
}

const projectService = {
  async getAll() {
    await delay(300)
    const data = await loadProjects()
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const data = await loadProjects()
    const project = data.find(p => p.id === id)
    return project ? { ...project } : null
  },

  async create(projectData) {
    await delay(400)
    const data = await loadProjects()
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      spent: 0
    }
    data.push(newProject)
    return { ...newProject }
  },

  async update(id, projectData) {
    await delay(350)
    const data = await loadProjects()
    const index = data.findIndex(p => p.id === id)
    if (index !== -1) {
      data[index] = { ...data[index], ...projectData }
      return { ...data[index] }
    }
    throw new Error('Project not found')
  },

  async delete(id) {
    await delay(250)
    const data = await loadProjects()
    const index = data.findIndex(p => p.id === id)
    if (index !== -1) {
      const deleted = data.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Project not found')
  }
}

export default projectService