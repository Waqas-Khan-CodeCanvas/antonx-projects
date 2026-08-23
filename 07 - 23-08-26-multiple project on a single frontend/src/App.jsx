import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BackToTop from './components/ui/BackToTop'
import Home from './pages/Home'
import TodoApp from './pages/TodoApp'
import QuizApp from './pages/QuizApp'
import ExpenseTracker from './pages/ExpenseTracker'
import WeatherDashboard from './pages/WeatherDashboard'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps/todo" element={<TodoApp />} />
          <Route path="/apps/quiz" element={<QuizApp />} />
          <Route path="/apps/expenses" element={<ExpenseTracker />} />
          <Route path="/apps/weather" element={<WeatherDashboard />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}