import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Projects from '../pages/Projects'
import Clients from '../pages/Clients'
import Expenses from '../pages/Expenses'
import Workers from '../pages/Workers'
import Documents from '../pages/Documents'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Building2',
    component: Projects
  },
  clients: {
    id: 'clients',
    label: 'Clients',
    path: '/clients',
    icon: 'Users',
    component: Clients
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'Receipt',
    component: Expenses
  },
  workers: {
    id: 'workers',
    label: 'Workers',
    path: '/workers',
    icon: 'HardHat',
    component: Workers
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    icon: 'FileText',
    component: Documents
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
}

export const routeArray = Object.values(routes)