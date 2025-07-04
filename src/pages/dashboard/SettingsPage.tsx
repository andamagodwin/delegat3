import { useState, useEffect } from 'react'
import { useWallet } from '../../hooks/useWalletContext'
import { useSupabase } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Download, 
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react'

const SettingsPage = () => {
  const { walletState, disconnectWallet } = useWallet()
  const { error: supabaseError } = useSupabase(walletState.address)
  const [notifications, setNotifications] = useState(true)
  const [autoDelegate, setAutoDelegate] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase.from('user_profiles').select('count').limit(1)
        if (error) throw error
        setDbStatus('connected')
      } catch (error) {
        console.error('Supabase connection error:', error)
        setDbStatus('error')
      }
    }

    checkSupabaseConnection()
  }, [])

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your delegation history? This cannot be undone.')) {
      localStorage.removeItem('delegationHistory')
      // Trigger page refresh or state update
      window.location.reload()
    }
  }

  const exportData = () => {
    const data = {
      wallet: walletState.address,
      history: JSON.parse(localStorage.getItem('delegationHistory') || '[]'),
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `delegat3-data-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and data</p>
      </div>

      {/* Database Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <Database className="text-purple-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Database Status</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Supabase Connection</span>
            <div className="flex items-center space-x-2">
              {dbStatus === 'checking' && (
                <>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400">Checking...</span>
                </>
              )}
              {dbStatus === 'connected' && (
                <>
                  <Wifi className="text-green-400" size={16} />
                  <span className="text-green-400">Connected</span>
                </>
              )}
              {dbStatus === 'error' && (
                <>
                  <WifiOff className="text-red-400" size={16} />
                  <span className="text-red-400">Disconnected</span>
                </>
              )}
            </div>
          </div>
          
          {supabaseError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">
                Database Error: {supabaseError}
              </p>
            </div>
          )}
          
          <p className="text-gray-400 text-sm">
            {dbStatus === 'connected' 
              ? 'Your delegation data is being saved to the cloud.' 
              : 'Data is currently saved locally. Cloud sync unavailable.'
            }
          </p>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="text-blue-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Account Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Connected Wallet
            </label>
            <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
              <code className="text-white font-mono text-sm flex-1">
                {walletState.address}
              </code>
              <button
                onClick={copyAddress}
                className="p-2 text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <a
                href={`https://basescan.org/address/${walletState.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Network
            </label>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white">Base Network (Chain ID: 8453)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Balance
            </label>
            <div className="p-3 bg-white/5 rounded-lg">
              <span className="text-white">{walletState.balance ? `${parseFloat(walletState.balance).toFixed(4)} ETH` : 'Loading...'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="text-purple-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Preferences</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Notifications</h4>
              <p className="text-gray-400 text-sm">Get notified about delegation activities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Auto-delegate to Self</h4>
              <p className="text-gray-400 text-sm">Automatically delegate new tokens to yourself</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoDelegate}
                onChange={(e) => setAutoDelegate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <Download className="text-green-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Data Management</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Export Data</h4>
              <p className="text-gray-400 text-sm">Download your delegation history and settings</p>
            </div>
            <button
              onClick={exportData}
              className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Clear History</h4>
              <p className="text-gray-400 text-sm">Remove all local delegation history</p>
            </div>
            <button
              onClick={clearHistory}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
        <div className="flex items-center space-x-2 mb-6">
          <Trash2 className="text-red-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div>
              <h4 className="text-white font-medium">Disconnect Wallet</h4>
              <p className="text-gray-400 text-sm">This will log you out and clear your session</p>
            </div>
            <button
              onClick={disconnectWallet}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-500/10 rounded-lg border border-blue-500/20 p-4">
        <div className="flex items-start space-x-2">
          <div className="text-blue-400 mt-0.5">ℹ️</div>
          <div className="text-blue-200 text-sm">
            <p className="font-medium mb-1">Privacy Notice</p>
            <p>
              Your delegation history is stored locally in your browser and on-chain. 
              No personal data is collected or stored on external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
