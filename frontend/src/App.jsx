import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Article from './pages/Article'
import Quiz from './pages/Quiz'
import QuizPlay from './pages/QuizPlay'
import QuizResult from './pages/QuizResult'
import Calculator from './pages/Calculator'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-fin-mist text-fin-ink">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:topic" element={<Article />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:topic/result" element={<QuizResult />} />
          <Route path="/quiz/:topic" element={<QuizPlay />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
