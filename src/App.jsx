import { useState, useEffect } from 'react'
import { useAuth } from './utils/useAuth'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'
import RecommendationsPage from './pages/RecommendationsPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AboutUs from './pages/AboutUs'
import { useDataset } from './utils/useDataset'

function App() {
  const { user, loading, isAuthenticated, logout, login, register } = useAuth()
  const { dataset } = useDataset()
  const [currentPage, setCurrentPage] = useState('dashboard') // 'dashboard', 'chat', 'about', 'recommendations'
  const [authPage, setAuthPage] = useState('login') // 'login' or 'signup'

  // Store navigation methods globally
  useEffect(() => {
    window.goToPage = setCurrentPage
    window.goToAuthPage = setAuthPage
    window.logout = () => {
      logout()
      setCurrentPage('dashboard')
    }
  }, [logout])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show auth pages
  if (!isAuthenticated) {
    if (authPage === 'signup') {
      return (
        <Signup
          register={register}
          onSignupSuccess={() => {
            setAuthPage('login')
          }}
          onSwitchToLogin={() => setAuthPage('login')}
        />
      )
    }
    return (
      <Login
        login={login}
        onLoginSuccess={() => {
          setCurrentPage('dashboard')
        }}
        onSwitchToSignup={() => setAuthPage('signup')}
      />
    )
  }

  // Authenticated - show app pages
  return (
    <>
      {currentPage === 'dashboard' && <Dashboard user={user} />}
      {currentPage === 'chat' && <ChatPage user={user} />}
      {currentPage === 'recommendations' && <RecommendationsPage user={user} dataset={dataset} />}
      {currentPage === 'about' && <AboutUs onGoBack={() => setCurrentPage('dashboard')} />}
    </>
  )
}

export default App

