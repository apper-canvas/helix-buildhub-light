import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { expenseService, projectService } from '@/services';

import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Spinner from '@/components/atoms/Spinner';
import AlertMessage from '@/components/molecules/AlertMessage';
import EmptyState from '@/components/molecules/EmptyState';
import Modal from '@/components/molecules/Modal';
import KPICard from '@/components/molecules/KPICard';
import ExpenseForm from '@/components/organisms/ExpenseForm';
import ExpenseListTable from '@/components/organisms/ExpenseListTable';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['Materials', 'Labor', 'Transportation', 'Equipment', 'Permits', 'Other'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesData, projectsData] = await Promise.all([
        expenseService.getAll(),
        projectService.getAll()
      ]);
      setExpenses(expensesData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.id, expenseData);
        setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...e, ...expenseData } : e));
        toast.success('Expense updated successfully');
      } else {
        const newExpense = await expenseService.create(expenseData);
        setExpenses([...expenses, newExpense]);
        toast.success('Expense created successfully');
      }

      setShowModal(false);
      setEditingExpense(null);
    } catch (err) {
      toast.error('Failed to save expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        setExpenses(expenses.filter(e => e.id !== id));
        toast.success('Expense deleted successfully');
      } catch (err) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const filteredExpenses = selectedCategory === 'All'
    ? expenses
    : expenses.filter(e => e.category === selectedCategory);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const expensesByCategory = categories.reduce((acc, category) => {
    acc[category] = expenses.filter(e => e.category === category).reduce((sum, e) => sum + (e.amount || 0), 0);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertMessage
          title="Error Loading Expenses"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Text as="h1" className="text-3xl font-bold font-display text-secondary mb-2">Expenses</Text>
          <Text as="p" className="text-gray-600">Track and manage project expenses</Text>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          variant="primary"
          icon="Plus"
          iconPosition="left"
        >
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="DollarSign"
          color="bg-primary"
        />
        <KPICard
          title="This Month"
          value={`$${expenses.filter(e => {
            const expenseDate = new Date(e.date);
            const now = new Date();
            return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
          }).reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}`}
          icon="Calendar"
          color="bg-success"
        />
        <KPICard
          title="Materials"
          value={`$${expensesByCategory.Materials.toLocaleString()}`}
          icon="Package"
          color="bg-warning"
        />
        <KPICard
          title="Labor"
          value={`$${expensesByCategory.Labor.toLocaleString()}`}
          icon="HardHat"
          color="bg-accent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setSelectedCategory('All')}
            className={`!px-3 !py-1 !text-sm font-medium transition-colors ${
              selectedCategory === 'All'
                ? '!bg-primary !text-white'
                : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200'
            }`}
            variant="ghost" // override base styles
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`!px-3 !py-1 !text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? '!bg-primary !text-white'
                  : '!bg-gray-100 !text-gray-700 hover:!bg-gray-200'
              }`}
              variant="ghost" // override base styles
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon="Receipt"
          title="No expenses found"
          description={selectedCategory === 'All' ? 'Add your first expense to get started' : `No ${selectedCategory.toLowerCase()} expenses found`}
          buttonText="Add Expense"
          onButtonClick={openAddModal}
        />
      ) : (
        <ExpenseListTable
          expenses={filteredExpenses}
          projects={projects}
          onEdit={openEditModal}
          onDelete={handleDeleteExpense}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingExpense ? 'Edit Expense' : 'New Expense'}
      >
        <ExpenseForm
          onSubmit={handleSaveExpense}
          onCancel={closeModal}
          editingExpense={editingExpense}
          projects={projects}
        />
      </Modal>
    </div>
  );
};

export default ExpensesPage;