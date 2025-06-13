import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './Layout'
import HomePage from '@/components/pages/HomePage'
import DashboardPage from '@/components/pages/DashboardPage'
import ProjectsPage from '@/components/pages/ProjectsPage'
import ClientsPage from '@/components/pages/ClientsPage'
import ExpensesPage from '@/components/pages/ExpensesPage'
import WorkersPage from '@/components/pages/WorkersPage'
import DocumentsPage from '@/components/pages/DocumentsPage'
import ReportsPage from '@/components/pages/ReportsPage'
import SettingsPage from '@/components/pages/SettingsPage'
import NotFoundPage from '@/components/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="workers" element={<WorkersPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!bg-white !text-gray-900 !border !border-gray-200"
          progressClassName="!bg-primary"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  )
}

export default App