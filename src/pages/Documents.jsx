import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { documentService } from '../services'

const Documents = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: 'Contracts',
    tags: [],
    fileUrl: ''
  })

  const categories = ['Contracts', 'Permits', 'Safety', 'Insurance', 'Compliance', 'Licenses', 'Manuals', 'Other']
  const commonTags = ['Important', 'Urgent', 'Legal', 'Safety', 'Reference', 'Template', 'Archive']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const documentsData = await documentService.getAll()
      setDocuments(documentsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const documentData = {
        ...formData,
        uploadDate: new Date().toISOString().split('T')[0],
        size: Math.floor(Math.random() * 5000) + 100 // Mock file size
      }

      if (editingDocument) {
        await documentService.update(editingDocument.id, documentData)
        setDocuments(documents.map(d => d.id === editingDocument.id ? { ...d, ...documentData } : d))
        toast.success('Document updated successfully')
      } else {
        const newDocument = await documentService.create(documentData)
        setDocuments([...documents, newDocument])
        toast.success('Document uploaded successfully')
      }

      setShowModal(false)
      resetForm()
    } catch (err) {
      toast.error('Failed to save document')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.delete(id)
        setDocuments(documents.filter(d => d.id !== id))
        toast.success('Document deleted successfully')
      } catch (err) {
        toast.error('Failed to delete document')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Contracts',
      tags: [],
      fileUrl: ''
    })
    setEditingDocument(null)
  }

  const openEditModal = (document) => {
    setEditingDocument(document)
    setFormData({
      name: document.name,
      category: document.category,
      tags: document.tags || [],
      fileUrl: document.fileUrl
    })
    setShowModal(true)
  }

  const toggleTag = (tag) => {
    const currentTags = formData.tags || []
    if (currentTags.includes(tag)) {
      setFormData({
        ...formData,
        tags: currentTags.filter(t => t !== tag)
      })
    } else {
      setFormData({
        ...formData,
        tags: [...currentTags, tag]
      })
    }
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return 'FileText'
      case 'doc':
      case 'docx':
        return 'FileText'
      case 'xls':
      case 'xlsx':
        return 'FileSpreadsheet'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image'
      default:
        return 'File'
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Documents</h3>
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
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">Documents</h1>
          <p className="text-gray-600">Manage your business documents and files</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Upload" className="w-5 h-5" />
          <span>Upload Document</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="FileText" className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'All' ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filters' 
              : 'Upload your first document to get started'
            }
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Upload Document
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                      <ApperIcon name={getFileIcon(document.name)} className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                      <p className="text-sm text-gray-500">{document.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(document)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Uploaded</span>
                    <span className="text-gray-900">{new Date(document.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Size</span>
                    <span className="text-gray-900">{formatFileSize(document.size)}</span>
                  </div>
                </div>

                {document.tags?.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {document.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(document.fileUrl, '_blank')}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => window.open(document.fileUrl, '_blank')}
                    className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1"
                  >
                    <ApperIcon name="Download" className="w-4 h-4" />
                    <span>Download</span>
                  </button>
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
                      {editingDocument ? 'Edit Document' : 'Upload Document'}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter document name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File URL
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.fileUrl}
                        onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://example.com/document.pdf"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {commonTags.map(tag => (
                          <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.tags || []).includes(tag)}
                              onChange={() => toggleTag(tag)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">{tag}</span>
                          </label>
                        ))}
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
                        {editingDocument ? 'Update Document' : 'Upload Document'}
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

export default Documents