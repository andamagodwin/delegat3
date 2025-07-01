import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { DelegationState, DelegationRecord } from '../types';

// Unlock Protocol UP token contract on Base
const UP_TOKEN_ADDRESS = '0x82f5bF4aBfA0c41Dc8C0f7f4b3De6BB5b5ad3c4e'; // Placeholder - replace with actual address

// Simplified ERC20Votes ABI for delegation
const ERC20_VOTES_ABI = [
  'function delegate(address delegatee) external',
  'function delegates(address account) external view returns (address)',
  'function getVotes(address account) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)',
];

export const useDelegation = (provider: ethers.BrowserProvider | null, address: string | null) => {
  const [delegationState, setDelegationState] = useState<DelegationState>({
    currentDelegate: null,
    isLoading: false,
    error: null,
  });

  const [delegationHistory, setDelegationHistory] = useState<DelegationRecord[]>([]);

  const getCurrentDelegate = useCallback(async () => {
    if (!provider || !address) return;

    try {
      setDelegationState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const contract = new ethers.Contract(UP_TOKEN_ADDRESS, ERC20_VOTES_ABI, provider);
      const currentDelegate = await contract.delegates(address);
      
      setDelegationState(prev => ({
        ...prev,
        currentDelegate,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error getting current delegate:', error);
      setDelegationState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [provider, address]);

  const delegateVotes = async (delegatee: string) => {
    if (!provider || !address) return { success: false, error: 'No provider or address' };

    try {
      setDelegationState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(UP_TOKEN_ADDRESS, ERC20_VOTES_ABI, signer);
      
      const tx = await contract.delegate(delegatee);
      const receipt = await tx.wait();

      // Record the delegation
      const record: DelegationRecord = {
        id: Date.now().toString(),
        delegator: address,
        delegatee,
        timestamp: Date.now(),
        transactionHash: receipt?.hash,
        type: 'delegate',
      };

      setDelegationHistory(prev => [record, ...prev]);
      
      // Update current delegate
      setDelegationState(prev => ({
        ...prev,
        currentDelegate: delegatee,
        isLoading: false,
      }));

      // Save to localStorage
      const existingHistory = JSON.parse(localStorage.getItem('delegationHistory') || '[]');
      localStorage.setItem('delegationHistory', JSON.stringify([record, ...existingHistory]));

      return { success: true, transactionHash: receipt?.hash };
    } catch (error) {
      console.error('Error delegating votes:', error);
      setDelegationState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const undelegateVotes = async () => {
    // Delegating to zero address effectively undelegates
    return delegateVotes('0x0000000000000000000000000000000000000000');
  };

  const getVotingPower = async (account?: string) => {
    if (!provider) return '0';

    try {
      const contract = new ethers.Contract(UP_TOKEN_ADDRESS, ERC20_VOTES_ABI, provider);
      const votes = await contract.getVotes(account || address);
      return ethers.formatEther(votes);
    } catch (error) {
      console.error('Error getting voting power:', error);
      return '0';
    }
  };

  const getTokenBalance = async (account?: string) => {
    if (!provider) return '0';

    try {
      const contract = new ethers.Contract(UP_TOKEN_ADDRESS, ERC20_VOTES_ABI, provider);
      const balance = await contract.balanceOf(account || address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  };

  // Load delegation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('delegationHistory');
    if (savedHistory) {
      setDelegationHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Get current delegate when address or provider changes
  useEffect(() => {
    if (provider && address) {
      getCurrentDelegate();
    }
  }, [provider, address, getCurrentDelegate]);

  return {
    delegationState,
    delegationHistory,
    delegateVotes,
    undelegateVotes,
    getCurrentDelegate,
    getVotingPower,
    getTokenBalance,
  };
};
