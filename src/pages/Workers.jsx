import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { workerService, projectService } from '../services'

const Workers = () => {
  const [workers, setWorkers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingWorker, setEditingWorker] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    projectIds: [],
    dailyRate: '',
    skills: []
  })

  const commonRoles = ['Site Manager', 'Carpenter', 'Electrician', 'Plumber', 'Laborer', 'Heavy Equipment Operator', 'Foreman']
  const commonSkills = ['Carpentry', 'Electrical', 'Plumbing', 'Masonry', 'Welding', 'Heavy Equipment', 'Safety', 'Project Management']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [workersData, projectsData] = await Promise.all([
        workerService.getAll(),
        projectService.getAll()
      ])
      setWorkers(workersData)
      setProjects(projectsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load workers')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const workerData = {
        ...formData,
        dailyRate: parseFloat(formData.dailyRate) || 0
      }

      if (editingWorker) {
        await workerService.update(editingWorker.id, workerData)
        setWorkers(workers.map(w => w.id === editingWorker.id ? { ...w, ...workerData } : w))
        toast.success('Worker updated successfully')
      } else {
        const newWorker = await workerService.create(workerData)
        setWorkers([...workers, newWorker])
        toast.success('Worker created successfully')
      }

      setShowModal(false)
      resetForm()
    } catch (err) {
      toast.error('Failed to save worker')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await workerService.delete(id)
        setWorkers(workers.filter(w => w.id !== id))
        toast.success('Worker deleted successfully')
      } catch (err) {
        toast.error('Failed to delete worker')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      projectIds: [],
      dailyRate: '',
      skills: []
    })
    setEditingWorker(null)
  }

  const openEditModal = (worker) => {
    setEditingWorker(worker)
    setFormData({
      name: worker.name,
      role: worker.role,
      phone: worker.phone,
      email: worker.email,
      projectIds: worker.projectIds || [],
      dailyRate: worker.dailyRate?.toString() || '',
      skills: worker.skills || []
    })
    setShowModal(true)
  }

  const getProjectNames = (projectIds) => {
    return projectIds.map(id => {
      const project = projects.find(p => p.id === id)
      return project ? project.name : 'Unknown'
    }).join(', ')
  }

  const toggleSkill = (skill) => {
    const currentSkills = formData.skills || []
    if (currentSkills.includes(skill)) {
      setFormData({
        ...formData,
        skills: currentSkills.filter(s => s !== skill)
      })
    } else {
      setFormData({
        ...formData,
        skills: [...currentSkills, skill]
      })
    }
  }

  const availableWorkers = workers.filter(w => (w.projectIds || []).length === 0).length
  const totalWorkers = workers.length
  const averageRate = workers.reduce((sum, w) => sum + (w.dailyRate || 0), 0) / (workers.length || 1)

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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Workers</h3>
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
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">Workers</h1>
          <p className="text-gray-600">Manage your workforce and assignments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Worker</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Workers</h3>
            <ApperIcon name="Users" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalWorkers}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Available</h3>
            <ApperIcon name="UserCheck" className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{availableWorkers}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg. Daily Rate</h3>
            <ApperIcon name="DollarSign" className="w-5 h-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${averageRate.toFixed(0)}</p>
        </div>
      </div>

      {/* Workers List */}
      {workers.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="HardHat" className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No workers yet</h3>
          <p className="text-gray-500 mb-4">Add your first worker to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Worker
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {workers.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="HardHat" className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 break-words">{worker.name}</h3>
                      <p className="text-sm text-gray-500">{worker.role}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(worker)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{worker.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 break-words">{worker.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="DollarSign" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">${worker.dailyRate}/day</span>
                  </div>

                  {worker.projectIds?.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Building2" className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Assigned Projects</span>
                      </div>
                      <p className="text-sm text-gray-600 break-words">{getProjectNames(worker.projectIds)}</p>
                    </div>
                  )}

                  {worker.skills?.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Wrench" className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {worker.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      (worker.projectIds || []).length === 0
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {(worker.projectIds || []).length === 0 ? 'Available' : 'Assigned'}
                    </span>
                  </div>
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
                      {editingWorker ? 'Edit Worker' : 'New Worker'}
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
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter worker name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <select
                          required
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select role</option>
                          {commonRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Rate ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.dailyRate}
                          onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Assignments
                        </label>
                        <select
                          multiple
                          value={formData.projectIds}
                          onChange={(e) => setFormData({
                            ...formData,
                            projectIds: Array.from(e.target.selectedOptions, option => option.value)
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          size="3"
                        >
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple projects</p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Skills
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {commonSkills.map(skill => (
                            <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(formData.skills || []).includes(skill)}
                                onChange={() => toggleSkill(skill)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-gray-700">{skill}</span>
                            </label>
                          ))}
                        </div>
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
                        {editingWorker ? 'Update Worker' : 'Add Worker'}
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

export default Workers