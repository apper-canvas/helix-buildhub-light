import { motion } from 'framer-motion';
import KPICard from '@/components/molecules/KPICard';
import Text from '@/components/atoms/Text';

const ReportOverview = ({ overviewData }) => {
  const kpiCards = [
    {
      title: 'Total Projects',
      value: overviewData.totalProjects,
      subtitle: `${overviewData.activeProjects} active`,
      icon: 'Building2',
      color: 'bg-primary'
    },
    {
      title: 'Budget Utilization',
      value: `${overviewData.budgetUtilization}%`,
      subtitle: `$${overviewData.totalExpenses.toLocaleString()} spent`,
      icon: 'DollarSign',
      color: 'bg-warning'
    },
    {
      title: 'Workforce',
      value: overviewData.totalWorkers,
      subtitle: `${overviewData.availableWorkers} available`,
      icon: 'HardHat',
      color: 'bg-accent'
    },
    {
      title: 'Active Clients',
      value: overviewData.totalClients,
      subtitle: 'Total clients',
      icon: 'Users',
      color: 'bg-info'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <KPICard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</Text>
          <div className="space-y-3">
            {Object.entries(overviewData.expensesByCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <Text as="span" className="text-sm text-gray-600">{category}</Text>
                <Text as="span" className="text-sm font-medium text-gray-900">${amount.toLocaleString()}</Text>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</Text>
          <div className="space-y-3">
            {Object.entries(overviewData.projectsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <Text as="span" className="text-sm text-gray-600">{status}</Text>
                <Text as="span" className="text-sm font-medium text-gray-900">{count}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportOverview;