import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';

const SettingsNotifications = ({ settings, onSave, onToggle }) => {
  const notificationOptions = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'projectDeadlines', label: 'Project Deadlines', description: 'Get alerts for upcoming project deadlines' },
    { key: 'expenseAlerts', label: 'Expense Alerts', description: 'Notifications for budget thresholds and expense approvals' },
    { key: 'workerUpdates', label: 'Worker Updates', description: 'Alerts for worker assignments and schedule changes' },
    { key: 'clientCommunications', label: 'Client Communications', description: 'Notifications for client messages and updates' },
    { key: 'documentReminders', label: 'Document Reminders', description: 'Reminders for document expiration and renewals' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Text as="h2" className="text-xl font-semibold text-gray-900">Notification Preferences</Text>
        <Button onClick={() => onSave('notifications')} variant="primary">
          Save Changes
        </Button>
      </div>

      <div className="space-y-4">
        {notificationOptions.map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Text as="h3" className="font-medium text-gray-900">{item.label}</Text>
              <Text as="p" className="text-sm text-gray-500">{item.description}</Text>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <Input
                type="checkbox"
                className="sr-only peer"
                value={settings.notifications[item.key]}
                onChange={() => onToggle('notifications', item.key)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsNotifications;