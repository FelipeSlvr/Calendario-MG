import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppNavbar } from './components/AppNavbar'
import { CalendarPage } from './pages/CalendarPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <div className="appShell">
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
