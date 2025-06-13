import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const navigate = useNavigate()

  const quickActions = [
    { label: 'View Dashboard', path: '/dashboard', icon: 'LayoutDashboard', color: 'bg-primary' },
    { label: 'Create Project', path: '/projects', icon: 'Plus', color: 'bg-success' },
    { label: 'Add Expense', path: '/expenses', icon: 'Receipt', color: 'bg-warning' },
    { label: 'Manage Workers', path: '/workers', icon: 'HardHat', color: 'bg-accent' }
  ]

  return (
    <div className="min-h-full bg-gradient-to-br from-surface to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <ApperIcon name="Building2" className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-secondary mb-4">
            Welcome to BuildHub Pro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your comprehensive construction management platform. Streamline projects, manage teams, 
            track expenses, and keep everything organized in one powerful dashboard.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.label}</h3>
            </motion.button>
          ))}
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold font-display text-secondary mb-8 text-center">
            Everything You Need to Manage Your Construction Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'Building2',
                title: 'Project Management',
                description: 'Track projects from planning to completion with detailed progress monitoring.'
              },
              {
                icon: 'Users',
                title: 'Client Management',
                description: 'Maintain comprehensive client records and communication history.'
              },
              {
                icon: 'Receipt',
                title: 'Expense Tracking',
                description: 'Monitor costs by category and generate detailed financial reports.'
              },
              {
                icon: 'HardHat',
                title: 'Workforce Management',
                description: 'Manage worker assignments, schedules, and track attendance.'
              },
              {
                icon: 'FileText',
                title: 'Document Storage',
                description: 'Centralized repository for all your important business documents.'
              },
              {
                icon: 'BarChart3',
                title: 'Reporting & Analytics',
                description: 'Generate insights with comprehensive reports and data visualization.'
              }
            ].map((feature, index) => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started with Dashboard
            <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2 inline" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Home