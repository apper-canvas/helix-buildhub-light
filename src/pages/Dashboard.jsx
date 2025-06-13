import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { projectService, clientService, expenseService, workerService } from '../services'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    clients: [],
    expenses: [],
    workers: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [projects, clients, expenses, workers] = await Promise.all([
          projectService.getAll(),
          clientService.getAll(),
          expenseService.getAll(),
          workerService.getAll()
        ])
        
        setDashboardData({ projects, clients, expenses, workers })
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { projects, clients, expenses, workers } = dashboardData

  // Calculate metrics
  const activeProjects = projects.filter(p => p.status === 'Active').length
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const availableWorkers = workers.filter(w => w.projectIds.length === 0).length
  const upcomingDeadlines = projects.filter(p => {
    const deadline = new Date(p.deadline)
    const now = new Date()
    const daysDiff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
    return daysDiff <= 7 && daysDiff >= 0
  }).length

  const kpiCards = [
    {
      title: 'Active Projects',
      value: activeProjects,
      total: projects.length,
      icon: 'Building2',
      color: 'bg-primary',
      change: '+12%'
    },
    {
      title: 'Budget Status',
      value: `$${(totalBudget - totalSpent).toLocaleString()}`,
      subtitle: `of $${totalBudget.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'bg-success',
      change: '+8%'
    },
    {
      title: 'Available Workers',
      value: availableWorkers,
      total: workers.length,
      icon: 'HardHat',
      color: 'bg-accent',
      change: '-3%'
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines,
      subtitle: 'within 7 days',
      icon: 'Clock',
      color: 'bg-warning',
      change: '+5%'
    }
  ]

  const recentActivity = [
    { action: 'New project "Downtown Mall" created', time: '2 hours ago', icon: 'Plus' },
    { action: 'Expense of $2,500 added for materials', time: '4 hours ago', icon: 'Receipt' },
    { action: 'Worker John Smith assigned to Project A', time: '6 hours ago', icon: 'User' },
    { action: 'Client meeting scheduled for next week', time: '1 day ago', icon: 'Calendar' },
    { action: 'Document "Safety Manual" uploaded', time: '2 days ago', icon: 'FileText' }
  ]

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-display text-secondary mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={card.icon} className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-success">{card.change}</span>
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
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <ApperIcon name="Building2" className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">Due: {new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Active' ? 'bg-success/10 text-success' :
                    project.status === 'Planning' ? 'bg-warning/10 text-warning' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={activity.icon} className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 break-words">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard