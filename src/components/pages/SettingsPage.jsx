import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';

import Text from '@/components/atoms/Text';
import SettingsCompanyInfo from '@/components/organisms/SettingsCompanyInfo';
import SettingsNotifications from '@/components/organisms/SettingsNotifications';
import SettingsSecurity from '@/components/organisms/SettingsSecurity';
import SettingsPreferences from '@/components/organisms/SettingsPreferences';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company');
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
  });

  const tabs = [
    { id: 'company', label: 'Company Info', icon: 'Building' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ];

  const handleSave = (section) => {
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggle = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Text as="h1" className="text-3xl font-bold font-display text-secondary mb-2">Settings</Text>
        <Text as="p" className="text-gray-600">Manage your application preferences and configuration</Text>
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
        {activeTab === 'company' && (
          <SettingsCompanyInfo
            settings={settings}
            onSave={handleSave}
            onInputChange={handleInputChange}
          />
        )}

        {activeTab === 'notifications' && (
          <SettingsNotifications
            settings={settings}
            onSave={handleSave}
            onToggle={handleToggle}
          />
        )}

        {activeTab === 'security' && (
          <SettingsSecurity
            settings={settings}
            onSave={handleSave}
            onInputChange={handleInputChange}
            onToggle={handleToggle}
          />
        )}

        {activeTab === 'preferences' && (
          <SettingsPreferences
            settings={settings}
            onSave={handleSave}
            onInputChange={handleInputChange}
          />
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;