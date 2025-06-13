import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-secondary">BuildHub Pro</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 text-xl font-bold font-display text-secondary">BuildHub Pro</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {routeArray.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="ml-3">{route.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon 
                name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} 
                className="w-5 h-5 text-gray-600" 
              />
            </button>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Mobile Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: mobileMenuOpen ? 0 : -280 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50"
        >
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold font-display text-secondary">BuildHub Pro</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {routeArray.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3">{route.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout