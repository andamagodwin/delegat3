
import { Routes, Route, Navigate } from 'react-router-dom'
import { useWallet } from './hooks/useWalletContext'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import DelegatePage from './pages/dashboard/DelegatePage'
import StewardsPage from './pages/dashboard/StewardsPage'
import HistoryPage from './pages/dashboard/HistoryPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import WalletConnect from './components/WalletConnect'
import './App.css'

function App() {
  const { walletState, connectWallet, disconnectWallet, switchToBase, isOnBase } = useWallet()
  
  // Removed debug logging

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!walletState.isConnected) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <WalletConnect onConnect={connectWallet} />
        </div>
      )
    }

    if (!isOnBase) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Wrong Network</h2>
            <p className="text-gray-300 mb-6">
              Please switch to Base network to use the delegation features.
            </p>
            <button
              onClick={switchToBase}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
            >
              Switch to Base
            </button>
          </div>
        </div>
      )
    }

    return (
      <DashboardLayout onDisconnect={disconnectWallet} walletAddress={walletState.address}>
        {children}
      </DashboardLayout>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      
      {/* Legacy app route - redirect to dashboard */}
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardOverview />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/delegate" element={
        <ProtectedRoute>
          <DelegatePage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/stewards" element={
        <ProtectedRoute>
          <StewardsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/history" element={
        <ProtectedRoute>
          <HistoryPage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/analytics" element={
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
