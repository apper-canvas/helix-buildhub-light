import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { clientService, projectService } from '../services'

const Clients = () => {
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ])
      setClients(clientsData)
      setProjects(projectsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, formData)
        setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c))
        toast.success('Client updated successfully')
      } else {
        const newClient = await clientService.create(formData)
        setClients([...clients, newClient])
        toast.success('Client created successfully')
      }

      setShowModal(false)
      resetForm()
    } catch (err) {
      toast.error('Failed to save client')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.delete(id)
        setClients(clients.filter(c => c.id !== id))
        toast.success('Client deleted successfully')
      } catch (err) {
        toast.error('Failed to delete client')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    })
    setEditingClient(null)
  }

  const openEditModal = (client) => {
    setEditingClient(client)
    setFormData({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes || ''
    })
    setShowModal(true)
  }

  const getClientProjects = (clientId) => {
    return projects.filter(p => p.clientId === clientId)
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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Clients</h3>
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
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">Clients</h1>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>New Client</span>
        </motion.button>
      </div>

      {/* Clients List */}
      {clients.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Users" className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients yet</h3>
          <p className="text-gray-500 mb-4">Add your first client to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Client
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clients.map((client, index) => {
            const clientProjects = getClientProjects(client.id)
            return (
              <motion.div
                key={client.id}
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
                        <ApperIcon name="Building" className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 break-words">{client.companyName}</h3>
                        <p className="text-sm text-gray-500">{client.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openEditModal(client)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 break-words">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{client.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600 break-words">{client.address}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Projects</span>
                        <span className="text-sm text-gray-500">{clientProjects.length}</span>
                      </div>
                      {clientProjects.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {clientProjects.slice(0, 3).map(project => (
                            <div key={project.id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 break-words">{project.name}</span>
                              <span className={`px-2 py-1 rounded-full ${
                                project.status === 'Active' ? 'bg-success/10 text-success' :
                                project.status === 'Planning' ? 'bg-warning/10 text-warning' :
                                project.status === 'Completed' ? 'bg-info/10 text-info' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          ))}
                          {clientProjects.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{clientProjects.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
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
                      {editingClient ? 'Edit Client' : 'New Client'}
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
                          Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter contact person"
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

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter address"
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
                          placeholder="Additional notes..."
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
                        {editingClient ? 'Update Client' : 'Create Client'}
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

export default Clients