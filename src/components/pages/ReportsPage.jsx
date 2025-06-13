import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { projectService, expenseService, workerService, clientService } from '@/services';

import Spinner from '@/components/atoms/Spinner';
import AlertMessage from '@/components/molecules/AlertMessage';
import ReportsPanel from '@/components/organisms/ReportsPanel';
import ReportOverview from '@/components/organisms/ReportOverview';
import Text from '@/components/atoms/Text';
import Badge from '@/components/atoms/Badge';

const ReportsPage = () => {
  const [reportData, setReportData] = useState({
    projects: [],
    expenses: [],
    workers: [],
    clients: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year'];
  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'projects', label: 'Projects', icon: 'Building2' },
    { id: 'expenses', label: 'Expenses', icon: 'Receipt' },
    { id: 'workers', label: 'Workers', icon: 'HardHat' }
  ];

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projects, expenses, workers, clients] = await Promise.all([
        projectService.getAll(),
        expenseService.getAll(),
        workerService.getAll(),
        clientService.getAll()
      ]);
      
      setReportData({ projects, expenses, workers, clients });
    } catch (err) {
      setError(err.message || 'Failed to load report data');
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const generateOverviewReport = () => {
    const { projects, expenses, workers, clients } = reportData;
    
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalWorkers = workers.length;
    const availableWorkers = workers.filter(w => (w.projectIds || []).length === 0).length;
    const totalClients = clients.length;

    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const projectsByStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

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
    };
  };

  const generateProjectReport = () => {
    const { projects, expenses } = reportData;
    
    return projects.map(project => {
      const projectExpenses = expenses.filter(e => e.projectId === project.id);
      const totalSpent = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
      const budgetUtilization = project.budget > 0 ? (totalSpent / project.budget * 100).toFixed(1) : 0;
      
      return {
        ...project,
        totalSpent,
        budgetUtilization,
        expenseCount: projectExpenses.length
      };
    });
  };

  const generateExpenseReport = () => {
    const { expenses, projects } = reportData;
    
    const expensesByCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, count: 0, expenses: [] };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      acc[expense.category].expenses.push(expense);
      return acc;
    }, {});

    const expensesByProject = expenses.reduce((acc, expense) => {
      const project = projects.find(p => p.id === expense.projectId);
      const projectName = project ? project.name : 'Unknown Project';
      
      if (!acc[projectName]) {
        acc[projectName] = { total: 0, count: 0 };
      }
      acc[projectName].total += expense.amount;
      acc[projectName].count += 1;
      return acc;
    }, {});

    return { expensesByCategory, expensesByProject };
  };

  const generateWorkerReport = () => {
    const { workers, projects } = reportData;
    
    return workers.map(worker => {
      const assignedProjects = (worker.projectIds || []).map(id => {
        const project = projects.find(p => p.id === id);
        return project ? project.name : 'Unknown Project';
      });
      
      return {
        ...worker,
        assignedProjects,
        projectCount: worker.projectIds?.length || 0,
        utilization: worker.projectIds?.length > 0 ? 'Assigned' : 'Available'
      };
    });
  };

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
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertMessage
          title="Error Loading Reports"
          message={error}
          onRetry={loadReportData}
        />
      </div>
    );
  }

  const overviewData = generateOverviewReport();
  const projectData = generateProjectReport();
  const expenseData = generateExpenseReport();
  const workerData = generateWorkerReport();

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Planning': return 'warning';
      case 'Completed': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <ReportsPanel
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        periods={periods}
        exportReport={exportReport}
        reportTypes={reportTypes}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
      />

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <ReportOverview overviewData={overviewData} />
      )}

      {selectedReport === 'projects' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6">
            <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Project Performance Report</Text>
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
                        <Badge variant={getStatusVariant(project.status)}>
                          {project.status}
                        </Badge>
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
              <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</Text>
              <div className="space-y-3">
                {Object.entries(expenseData.expensesByCategory).map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div>
                      <Text as="span" className="text-sm font-medium text-gray-900">{category}</Text>
                      <Text as="span" className="text-xs text-gray-500 ml-2">({data.count} items)</Text>
                    </div>
                    <Text as="span" className="text-sm font-medium text-gray-900">${data.total.toLocaleString()}</Text>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Expenses by Project</Text>
              <div className="space-y-3">
                {Object.entries(expenseData.expensesByProject).map(([project, data]) => (
                  <div key={project} className="flex items-center justify-between">
                    <div>
                      <Text as="span" className="text-sm font-medium text-gray-900">{project}</Text>
                      <Text as="span" className="text-xs text-gray-500 ml-2">({data.count} items)</Text>
                    </div>
                    <Text as="span" className="text-sm font-medium text-gray-900">${data.total.toLocaleString()}</Text>
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
            <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Worker Utilization Report</Text>
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
                        <Badge variant={worker.utilization === 'Available' ? 'success' : 'warning'}>
                          {worker.utilization}
                        </Badge>
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
  );
};

export default ReportsPage;