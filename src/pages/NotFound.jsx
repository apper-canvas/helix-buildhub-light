import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h1 className="text-6xl font-bold font-display text-secondary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to building great things.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound