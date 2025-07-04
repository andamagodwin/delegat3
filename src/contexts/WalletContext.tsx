import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';
import type { WalletState } from '../types';

interface WalletContextType {
  walletState: WalletState;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<{ success: boolean; error?: string }>;
  disconnectWallet: () => void;
  switchToBase: () => Promise<void>;
  isOnBase: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export { WalletContext };

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: null,
  });

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const BASE_CHAIN_ID = 8453; // Base mainnet

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('No ethereum wallet found');
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();
      const balance = await browserProvider.getBalance(accounts[0]);

      setWalletState({
        address: accounts[0],
        isConnected: true,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
    });
    setProvider(null);
  };

  const switchToBase = async () => {
    try {
      if (!window.ethereum) return;

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
      });
    } catch (error: unknown) {
      // Chain doesn't exist, add it
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          await window.ethereum!.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                chainName: 'Base',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Base network:', addError);
        }
      } else {
        console.error('Failed to switch to Base network:', error);
      }
    }
  };

  const isOnBase = walletState.chainId === BASE_CHAIN_ID;

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletState(prev => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const chainId = args[0] as string;
      setWalletState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Auto-connect failed:', error);
      }
    };

    autoConnect();
  }, []);

  const value: WalletContextType = {
    walletState,
    provider,
    connectWallet,
    disconnectWallet,
    switchToBase,
    isOnBase,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
