import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { projectService, clientService, expenseService, workerService } from '@/services';

import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import AlertMessage from '@/components/molecules/AlertMessage';
import KPICard from '@/components/molecules/KPICard';
import ProjectListItem from '@/components/molecules/ProjectListItem';
import ExpenseListItem from '@/components/molecules/ExpenseListItem';
import ActivityItem from '@/components/molecules/ActivityItem';
import Card from '@/components/molecules/Card';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    clients: [],
    expenses: [],
    workers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projects, clients, expenses, workers] = await Promise.all([
        projectService.getAll(),
        clientService.getAll(),
        expenseService.getAll(),
        workerService.getAll()
      ]);
      
      setDashboardData({ projects, clients, expenses, workers });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertMessage
          title="Error Loading Dashboard"
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  const { projects, clients, expenses, workers } = dashboardData;

  // Calculate metrics
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const availableWorkers = workers.filter(w => w.projectIds.length === 0).length;
  const upcomingDeadlines = projects.filter(p => {
    const deadline = new Date(p.deadline);
    const now = new Date();
    const daysDiff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7 && daysDiff >= 0;
  }).length;

  const kpiCardsData = [
    {
      title: 'Active Projects',
      value: activeProjects,
      total: projects.length,
      icon: 'Building2',
      color: 'bg-primary',
      change: '+12%',
      onClick: () => navigate('/projects')
    },
    {
      title: 'Budget Status',
      value: `$${(totalBudget - totalSpent).toLocaleString()}`,
      subtitle: `of $${totalBudget.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'bg-success',
      change: '+8%',
      onClick: () => navigate('/expenses')
    },
    {
      title: 'Available Workers',
      value: availableWorkers,
      total: workers.length,
      icon: 'HardHat',
      color: 'bg-accent',
      change: '-3%',
      onClick: () => navigate('/workers')
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines,
      subtitle: 'within 7 days',
      icon: 'Clock',
      color: 'bg-warning',
      change: '+5%',
      onClick: () => navigate('/projects')
    }
  ];

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
  ];

  const recentActivity = [
    { action: 'New project "Downtown Mall" created', time: '2 hours ago', icon: 'Plus' },
    { action: 'Expense of $2,500 added for materials', time: '4 hours ago', icon: 'Receipt' },
    { action: 'Worker John Smith assigned to Project A', time: '6 hours ago', icon: 'User' },
    { action: 'Client meeting scheduled for next week', time: '1 day ago', icon: 'Calendar' },
    { action: 'Document "Safety Manual" uploaded', time: '2 days ago', icon: 'FileText' }
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Text as="h1" className="text-3xl font-bold font-display text-secondary mb-2">Dashboard</Text>
        <Text as="p" className="text-gray-600">Welcome back! Here's what's happening with your projects.</Text>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {kpiCardsData.map((card, index) => (
          <KPICard key={index} {...card} />
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div>
        <Text as="h2" className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left cursor-pointer"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
              </div>
              <Text as="h3" className="font-medium text-gray-900 mb-1">{action.label}</Text>
              <Text as="p" className="text-sm text-gray-500">{action.description}</Text>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Text as="h2" className="text-lg font-semibold text-gray-900">Recent Projects</Text>
            <Button
              onClick={() => navigate('/projects')}
              variant="ghost"
              className="!text-primary hover:!text-primary/80 !text-sm !font-medium !p-0" // override default button styles
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Text as="h2" className="text-lg font-semibold text-gray-900">Recent Expenses</Text>
            <Button
              onClick={() => navigate('/expenses')}
              variant="ghost"
              className="!text-primary hover:!text-primary/80 !text-sm !font-medium !p-0" // override default button styles
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {expenses.slice(0, 3).map((expense) => (
              <ExpenseListItem key={expense.id} expense={expense} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;