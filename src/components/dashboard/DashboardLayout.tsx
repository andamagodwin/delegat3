import { useState } from 'react'
import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
  onDisconnect: () => void
  walletAddress?: string | null
}

const DashboardLayout = ({ children, onDisconnect, walletAddress }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar 
        onDisconnect={onDisconnect} 
        walletAddress={walletAddress}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out min-h-screen ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <main className="p-6">
          {children}
        </main>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>
    </div>
  )
}

export default DashboardLayout
