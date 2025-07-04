import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Vote, 
  History, 
  Settings, 
  Users, 
  BarChart3, 
  Menu, 
  X,
  LogOut,
  Wallet
} from 'lucide-react'



interface SidebarProps {
  onDisconnect: () => void
  walletAddress?: string | null
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const Sidebar = ({ onDisconnect, walletAddress, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Vote, label: 'Delegate', path: '/dashboard/delegate' },
    { icon: Users, label: 'Stewards', path: '/dashboard/stewards' },
    { icon: History, label: 'History', path: '/dashboard/history' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ]

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white/10 backdrop-blur-sm border-r border-white/20 z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 border-b border-white/20 ${isCollapsed ? 'px-2' : ''}`}>
            <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                {!isCollapsed && (
                  <img 
                    src="/delegat3.svg" 
                    alt="Delegat3 Logo" 
                    className={`rounded-lg ${isCollapsed ? 'w-12' : 'w-20'}`}
                  />
                )  }
              </div>
              {!isCollapsed && (
                <>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden text-white hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block text-white hover:text-gray-300"
                  >
                    <Menu size={16} />
                  </button>
                </>
              )}
              {isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:block text-white hover:text-gray-300 absolute top-4 right-2"
                >
                  <Menu size={16} />
                </button>
              )}
            </div>
          </div>


          {/* Wallet Info */}
          {walletAddress && (
            <div className={`p-4 border-b border-white/20 ${isCollapsed ? 'px-2' : ''}`}>
              <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className={`bg-green-500/20 rounded-full flex items-center justify-center ${isCollapsed ? 'w-10 h-10' : 'w-8 h-8'}`}>
                  <Wallet size={isCollapsed ? 20 : 16} className="text-green-400" />
                </div>
                {!isCollapsed && (
                  <div>
                    <p className="text-white text-sm font-medium">Connected</p>
                    <p className="text-gray-400 text-xs">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 p-4 ${isCollapsed ? 'px-2' : ''}`}>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = isActivePath(item.path)
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        flex items-center space-x-3 rounded-lg transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }
                        ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2'}
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      <Icon size={isCollapsed ? 24 : 20} />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Disconnect Button */}
          <div className={`p-4 border-t border-white/20 ${isCollapsed ? 'px-2' : ''}`}>
            <button
              onClick={onDisconnect}
              className={`
                flex items-center space-x-3 rounded-lg w-full group relative
                text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200
                ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2'}
              `}
              title={isCollapsed ? 'Disconnect' : ''}
            >
              <LogOut size={isCollapsed ? 24 : 20} />
              {!isCollapsed && <span className="font-medium">Disconnect</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Disconnect
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
