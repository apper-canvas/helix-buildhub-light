import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { projectService, clientService, workerService } from '../services'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    startDate: '',
    deadline: '',
    status: 'Planning',
    budget: '',
    workerIds: [],
    phase: 'Planning',
    notes: ''
  })

  const statusOptions = ['Planning', 'Active', 'Completed', 'On Hold']
  const phaseOptions = ['Planning', 'Foundation', 'Framing', 'Finishing', 'Completed']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projectsData, clientsData, workersData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll(),
        workerService.getAll()
      ])
      setProjects(projectsData)
      setClients(clientsData)
      setWorkers(workersData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        spent: editingProject?.spent || 0
      }

      if (editingProject) {
        await projectService.update(editingProject.id, projectData)
        setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p))
        toast.success('Project updated successfully')
      } else {
        const newProject = await projectService.create(projectData)
        setProjects([...projects, newProject])
        toast.success('Project created successfully')
      }

      setShowModal(false)
      resetForm()
    } catch (err) {
      toast.error('Failed to save project')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(id)
        setProjects(projects.filter(p => p.id !== id))
        toast.success('Project deleted successfully')
      } catch (err) {
        toast.error('Failed to delete project')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      clientId: '',
      startDate: '',
      deadline: '',
      status: 'Planning',
      budget: '',
      workerIds: [],
      phase: 'Planning',
      notes: ''
    })
    setEditingProject(null)
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      clientId: project.clientId,
      startDate: project.startDate,
      deadline: project.deadline,
      status: project.status,
      budget: project.budget.toString(),
      workerIds: project.workerIds || [],
      phase: project.phase,
      notes: project.notes || ''
    })
    setShowModal(true)
  }

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.companyName : 'Unknown Client'
  }

  const getWorkerNames = (workerIds) => {
    return workerIds.map(id => {
      const worker = workers.find(w => w.id === id)
      return worker ? worker.name : 'Unknown'
    }).join(', ')
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Projects</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">Projects</h1>
          <p className="text-gray-600">Manage your construction projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Building2" className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 break-words">{project.name}</h3>
                      <p className="text-sm text-gray-500">{getClientName(project.clientId)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'Active' ? 'bg-success/10 text-success' :
                      project.status === 'Planning' ? 'bg-warning/10 text-warning' :
                      project.status === 'Completed' ? 'bg-info/10 text-info' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phase</span>
                    <span className="text-sm font-medium text-gray-900">{project.phase}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget</span>
                    <span className="text-sm font-medium text-gray-900">${project.budget?.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Deadline</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {project.workerIds?.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Workers</span>
                      <p className="text-sm text-gray-900 mt-1 break-words">{getWorkerNames(project.workerIds)}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingProject ? 'Edit Project' : 'New Project'}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter project name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client
                        </label>
                        <select
                          required
                          value={formData.clientId}
                          onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.companyName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deadline
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.deadline}
                          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phase
                        </label>
                        <select
                          value={formData.phase}
                          onChange={(e) => setFormData({...formData, phase: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {phaseOptions.map(phase => (
                            <option key={phase} value={phase}>{phase}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Project notes..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false)
                          resetForm()
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Projects