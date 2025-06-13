import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { projectService, expenseService, workerService, clientService } from '../services'

const Reports = () => {
  const [reportData, setReportData] = useState({
    projects: [],
    expenses: [],
    workers: [],
    clients: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')
  const [selectedReport, setSelectedReport] = useState('overview')

  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year']
  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'projects', label: 'Projects', icon: 'Building2' },
    { id: 'expenses', label: 'Expenses', icon: 'Receipt' },
    { id: 'workers', label: 'Workers', icon: 'HardHat' }
  ]

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projects, expenses, workers, clients] = await Promise.all([
        projectService.getAll(),
        expenseService.getAll(),
        workerService.getAll(),
        clientService.getAll()
      ])
      
      setReportData({ projects, expenses, workers, clients })
    } catch (err) {
      setError(err.message || 'Failed to load report data')
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format) => {
    toast.success(`Report exported as ${format.toUpperCase()}`)
  }

  const generateOverviewReport = () => {
    const { projects, expenses, workers, clients } = reportData
    
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'Active').length
    const completedProjects = projects.filter(p => p.status === 'Completed').length
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    const totalWorkers = workers.length
    const availableWorkers = workers.filter(w => (w.projectIds || []).length === 0).length
    const totalClients = clients.length

    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    const projectsByStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {})

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalBudget,
      totalExpenses,
      totalWorkers,
      availableWorkers,
      totalClients,
      budgetUtilization: totalBudget > 0 ? (totalExpenses / totalBudget * 100).toFixed(1) : 0,
      expensesByCategory,
      projectsByStatus
    }
  }

  const generateProjectReport = () => {
    const { projects, expenses } = reportData
    
    return projects.map(project => {
      const projectExpenses = expenses.filter(e => e.projectId === project.id)
      const totalSpent = projectExpenses.reduce((sum, e) => sum + e.amount, 0)
      const budgetUtilization = project.budget > 0 ? (totalSpent / project.budget * 100).toFixed(1) : 0
      
      return {
        ...project,
        totalSpent,
        budgetUtilization,
        expenseCount: projectExpenses.length
      }
    })
  }

  const generateExpenseReport = () => {
    const { expenses, projects } = reportData
    
    const expensesByCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, count: 0, expenses: [] }
      }
      acc[expense.category].total += expense.amount
      acc[expense.category].count += 1
      acc[expense.category].expenses.push(expense)
      return acc
    }, {})

    const expensesByProject = expenses.reduce((acc, expense) => {
      const project = projects.find(p => p.id === expense.projectId)
      const projectName = project ? project.name : 'Unknown Project'
      
      if (!acc[projectName]) {
        acc[projectName] = { total: 0, count: 0 }
      }
      acc[projectName].total += expense.amount
      acc[projectName].count += 1
      return acc
    }, {})

    return { expensesByCategory, expensesByProject }
  }

  const generateWorkerReport = () => {
    const { workers, projects } = reportData
    
    return workers.map(worker => {
      const assignedProjects = (worker.projectIds || []).map(id => {
        const project = projects.find(p => p.id === id)
        return project ? project.name : 'Unknown Project'
      })
      
      return {
        ...worker,
        assignedProjects,
        projectCount: worker.projectIds?.length || 0,
        utilization: worker.projectIds?.length > 0 ? 'Assigned' : 'Available'
      }
    })
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
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
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Reports</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadReportData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const overviewData = generateOverviewReport()
  const projectData = generateProjectReport()
  const expenseData = generateExpenseReport()
  const workerData = generateWorkerReport()

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-secondary mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportReport('pdf')}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            >
              <ApperIcon name="Download" className="w-5 h-5" />
              <span>Export PDF</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportReport('excel')}
              className="bg-success text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            >
              <ApperIcon name="FileSpreadsheet" className="w-5 h-5" />
              <span>Export Excel</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-2">
          {reportTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                selectedReport === type.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ApperIcon name={type.icon} className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Projects</h3>
                <ApperIcon name="Building2" className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{overviewData.totalProjects}</p>
              <p className="text-sm text-success mt-1">{overviewData.activeProjects} active</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Budget Utilization</h3>
                <ApperIcon name="DollarSign" className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{overviewData.budgetUtilization}%</p>
              <p className="text-sm text-gray-500 mt-1">${overviewData.totalExpenses.toLocaleString()} spent</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Workforce</h3>
                <ApperIcon name="HardHat" className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{overviewData.totalWorkers}</p>
              <p className="text-sm text-success mt-1">{overviewData.availableWorkers} available</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Active Clients</h3>
                <ApperIcon name="Users" className="w-5 h-5 text-info" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{overviewData.totalClients}</p>
              <p className="text-sm text-gray-500 mt-1">Total clients</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
              <div className="space-y-3">
                {Object.entries(overviewData.expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium text-gray-900">${amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</h3>
              <div className="space-y-3">
                {Object.entries(overviewData.projectsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{status}</span>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {selectedReport === 'projects' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Performance Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilization
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectData.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'Active' ? 'bg-success/10 text-success' :
                          project.status === 'Planning' ? 'bg-warning/10 text-warning' :
                          project.status === 'Completed' ? 'bg-info/10 text-info' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${project.budget.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${project.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.budgetUtilization}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {selectedReport === 'expenses' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
              <div className="space-y-3">
                {Object.entries(expenseData.expensesByCategory).map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{category}</span>
                      <span className="text-xs text-gray-500 ml-2">({data.count} items)</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">${data.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Project</h3>
              <div className="space-y-3">
                {Object.entries(expenseData.expensesByProject).map(([project, data]) => (
                  <div key={project} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{project}</span>
                      <span className="text-xs text-gray-500 ml-2">({data.count} items)</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">${data.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {selectedReport === 'workers' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Worker Utilization Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Worker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Daily Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workerData.map((worker) => (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {worker.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {worker.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          worker.utilization === 'Available' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {worker.utilization}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {worker.assignedProjects.length > 0 
                          ? worker.assignedProjects.join(', ') 
                          : 'None'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${worker.dailyRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Reports