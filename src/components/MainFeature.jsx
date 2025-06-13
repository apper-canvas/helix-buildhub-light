import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { projectService, expenseService, workerService, clientService } from '../services'

const MainFeature = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    expenses: [],
    workers: [],
    clients: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projects, expenses, workers, clients] = await Promise.all([
        projectService.getAll(),
        expenseService.getAll(),
        workerService.getAll(),
        clientService.getAll()
      ])
      
      setDashboardData({ projects, expenses, workers, clients })
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { projects, expenses, workers, clients } = dashboardData

  // Calculate key metrics
  const activeProjects = projects.filter(p => p.status === 'Active').length
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const availableWorkers = workers.filter(w => (w.projectIds || []).length === 0).length

  const quickActions = [
    { 
      label: 'New Project', 
      path: '/projects', 
      icon: 'Plus', 
      color: 'bg-primary',
      description: 'Create a new construction project'
    },
    { 
      label: 'Add Expense', 
      path: '/expenses', 
      icon: 'Receipt', 
      color: 'bg-warning',
      description: 'Log project expenses'
    },
    { 
      label: 'Add Worker', 
      path: '/workers', 
      icon: 'UserPlus', 
      color: 'bg-success',
      description: 'Add team members'
    },
    { 
      label: 'Upload Document', 
      path: '/documents', 
      icon: 'Upload', 
      color: 'bg-accent',
      description: 'Store important files'
    }
  ]

  const kpiCards = [
    {
      title: 'Active Projects',
      value: activeProjects,
      total: projects.length,
      icon: 'Building2',
      color: 'bg-primary',
      path: '/projects'
    },
    {
      title: 'Budget Remaining',
      value: `$${(totalBudget - totalExpenses).toLocaleString()}`,
      subtitle: `of $${totalBudget.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'bg-success',
      path: '/expenses'
    },
    {
      title: 'Available Workers',
      value: availableWorkers,
      total: workers.length,
      icon: 'HardHat',
      color: 'bg-accent',
      path: '/workers'
    },
    {
      title: 'Total Clients',
      value: clients.length,
      subtitle: 'active clients',
      icon: 'Users',
      color: 'bg-info',
      path: '/clients'
    }
  ]

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(card.path)}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={card.icon} className="w-6 h-6 text-white" />
              </div>
              <ApperIcon name="ArrowUpRight" className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{card.value}</span>
              {card.total && (
                <span className="text-sm text-gray-500">/ {card.total}</span>
              )}
              {card.subtitle && (
                <span className="text-sm text-gray-500">{card.subtitle}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.label}</h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <button
              onClick={() => navigate('/projects')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
                    <ApperIcon name="Building2" className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
                    <p className="text-xs text-gray-500">Due: {new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'Active' ? 'bg-success/10 text-success' :
                  project.status === 'Planning' ? 'bg-warning/10 text-warning' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <button
              onClick={() => navigate('/expenses')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center">
                    <ApperIcon name="Receipt" className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{expense.description}</h3>
                    <p className="text-xs text-gray-500">{expense.category}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">${expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature