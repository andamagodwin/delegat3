import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import type { WalletState } from '../types';
import type { ethers } from 'ethers';

interface WalletContextType {
  walletState: WalletState;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<{ success: boolean; error?: string }>;
  disconnectWallet: () => void;
  switchToBase: () => Promise<void>;
  isOnBase: boolean;
}

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
