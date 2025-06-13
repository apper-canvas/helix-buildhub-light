import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company')
  const [settings, setSettings] = useState({
    company: {
      name: 'BuildHub Construction Co.',
      email: 'admin@buildhub.com',
      phone: '+1 (555) 123-4567',
      address: '123 Construction Ave, Builder City, BC 12345',
      website: 'www.buildhub.com',
      taxId: '12-3456789'
    },
    notifications: {
      emailNotifications: true,
      projectDeadlines: true,
      expenseAlerts: true,
      workerUpdates: false,
      clientCommunications: true,
      documentReminders: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      backupFrequency: 'weekly'
    },
    preferences: {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      timezone: 'America/New_York'
    }
  })

  const tabs = [
    { id: 'company', label: 'Company Info', icon: 'Building' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ]

  const handleSave = (section) => {
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`)
  }

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleToggle = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-secondary mb-2">Settings</h1>
        <p className="text-gray-600">Manage your application preferences and configuration</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
      >
        {/* Company Info Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
              <button
                onClick={() => handleSave('company')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.company.name}
                  onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.company.email}
                  onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.company.phone}
                  onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={settings.company.website}
                  onChange={(e) => handleInputChange('company', 'website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  value={settings.company.address}
                  onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID / EIN
                </label>
                <input
                  type="text"
                  value={settings.company.taxId}
                  onChange={(e) => handleInputChange('company', 'taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
              <button
                onClick={() => handleSave('notifications')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'projectDeadlines', label: 'Project Deadlines', description: 'Get alerts for upcoming project deadlines' },
                { key: 'expenseAlerts', label: 'Expense Alerts', description: 'Notifications for budget thresholds and expense approvals' },
                { key: 'workerUpdates', label: 'Worker Updates', description: 'Alerts for worker assignments and schedule changes' },
                { key: 'clientCommunications', label: 'Client Communications', description: 'Notifications for client messages and updates' },
                { key: 'documentReminders', label: 'Document Reminders', description: 'Reminders for document expiration and renewals' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications[item.key]}
                      onChange={() => handleToggle('notifications', item.key)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
              <button
                onClick={() => handleSave('security')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.security.twoFactorAuth}
                    onChange={() => handleToggle('security', 'twoFactorAuth')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Expiry (days)
                  </label>
                  <select
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleInputChange('security', 'passwordExpiry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.security.backupFrequency}
                    onChange={(e) => handleInputChange('security', 'backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Security Recommendations</h3>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                      <li>Enable two-factor authentication for enhanced security</li>
                      <li>Use strong, unique passwords for all accounts</li>
                      <li>Regularly review and update security settings</li>
                      <li>Keep your application updated to the latest version</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Application Preferences</h2>
              <button
                onClick={() => handleSave('preferences')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Preference Notes</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Changes to theme and language will take effect immediately. 
                    Date format and currency changes will apply to new data entries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Settings