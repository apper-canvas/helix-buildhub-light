import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Clients from './pages/Clients'
import Expenses from './pages/Expenses'
import Workers from './pages/Workers'
import Documents from './pages/Documents'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="clients" element={<Clients />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="workers" element={<Workers />} />
            <Route path="documents" element={<Documents />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
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