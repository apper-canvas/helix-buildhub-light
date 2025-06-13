import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { expenseService, projectService } from '../services'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [formData, setFormData] = useState({
    projectId: '',
    category: 'Materials',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    receipt: ''
  })

  const categories = ['Materials', 'Labor', 'Transportation', 'Equipment', 'Permits', 'Other']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [expensesData, projectsData] = await Promise.all([
        expenseService.getAll(),
        projectService.getAll()
      ])
      setExpenses(expensesData)
      setProjects(projectsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0
      }

      if (editingExpense) {
        await expenseService.update(editingExpense.id, expenseData)
        setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...e, ...expenseData } : e))
        toast.success('Expense updated successfully')
      } else {
        const newExpense = await expenseService.create(expenseData)
        setExpenses([...expenses, newExpense])
        toast.success('Expense created successfully')
      }

      setShowModal(false)
      resetForm()
    } catch (err) {
      toast.error('Failed to save expense')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id)
        setExpenses(expenses.filter(e => e.id !== id))
        toast.success('Expense deleted successfully')
      } catch (err) {
        toast.error('Failed to delete expense')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      projectId: '',
      category: 'Materials',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      receipt: ''
    })
    setEditingExpense(null)
  }

  const openEditModal = (expense) => {
    setEditingExpense(expense)
    setFormData({
      projectId: expense.projectId,
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      description: expense.description,
      receipt: expense.receipt || ''
    })
    setShowModal(true)
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'Unknown Project'
  }

  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === selectedCategory)

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  const expensesByCategory = categories.reduce((acc, category) => {
    acc[category] = expenses.filter(e => e.category === category).reduce((sum, e) => sum + (e.amount || 0), 0)
    return acc
  }, {})

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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Expenses</h3>
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
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">Expenses</h1>
          <p className="text-gray-600">Track and manage project expenses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Expense</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            <ApperIcon name="DollarSign" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">This Month</h3>
            <ApperIcon name="Calendar" className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${expenses.filter(e => {
              const expenseDate = new Date(e.date)
              const now = new Date()
              return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
            }).reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Materials</h3>
            <ApperIcon name="Package" className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${expensesByCategory.Materials.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Labor</h3>
            <ApperIcon name="HardHat" className="w-5 h-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${expensesByCategory.Labor.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
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

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Receipt" className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory === 'All' ? 'Add your first expense to get started' : `No ${selectedCategory.toLowerCase()} expenses found`}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Expense
          </button>
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense, index) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getProjectName(expense.projectId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        expense.category === 'Materials' ? 'bg-warning/10 text-warning' :
                        expense.category === 'Labor' ? 'bg-accent/10 text-accent' :
                        expense.category === 'Transportation' ? 'bg-info/10 text-info' :
                        expense.category === 'Equipment' ? 'bg-success/10 text-success' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(expense)}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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
                      {editingExpense ? 'Edit Expense' : 'New Expense'}
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
                          Project
                        </label>
                        <select
                          required
                          value={formData.projectId}
                          onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select project</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
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
                          Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Describe the expense..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Receipt/Invoice
                        </label>
                        <input
                          type="text"
                          value={formData.receipt}
                          onChange={(e) => setFormData({...formData, receipt: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Receipt number or file reference"
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
                        {editingExpense ? 'Update Expense' : 'Add Expense'}
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

export default Expenses