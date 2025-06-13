import HomePage from '@/components/pages/HomePage'
import DashboardPage from '@/components/pages/DashboardPage'
import ProjectsPage from '@/components/pages/ProjectsPage'
import ClientsPage from '@/components/pages/ClientsPage'
import ExpensesPage from '@/components/pages/ExpensesPage'
import WorkersPage from '@/components/pages/WorkersPage'
import DocumentsPage from '@/components/pages/DocumentsPage'
import ReportsPage from '@/components/pages/ReportsPage'
import SettingsPage from '@/components/pages/SettingsPage'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Building2',
component: ProjectsPage
  },
  clients: {
    id: 'clients',
    label: 'Clients',
    path: '/clients',
    icon: 'Users',
component: ClientsPage
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'Receipt',
component: ExpensesPage
  },
  workers: {
    id: 'workers',
    label: 'Workers',
    path: '/workers',
    icon: 'HardHat',
component: WorkersPage
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    icon: 'FileText',
component: DocumentsPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
component: ReportsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  }
}

export const routeArray = Object.values(routes)