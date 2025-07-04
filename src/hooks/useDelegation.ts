import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { DelegationState, DelegationRecord } from '../types';
import { useSupabase } from './useSupabase';

// Unlock Protocol UP token contract on Base
// NOTE: Currently using USDC as placeholder since actual UP token address on Base is not available
// Replace VITE_UP_TOKEN_ADDRESS in .env with actual UP token address when available
const UP_TOKEN_ADDRESS = import.meta.env.VITE_UP_TOKEN_ADDRESS 
  ? ethers.getAddress(import.meta.env.VITE_UP_TOKEN_ADDRESS)
  : ethers.getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'); // Placeholder (USDC on Base)

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
  const { saveDelegationRecord, getDelegationHistory } = useSupabase(address);

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
      const record: Omit<DelegationRecord, 'id' | 'timestamp'> = {
        delegator: address,
        delegatee,
        transactionHash: receipt?.hash,
        type: 'delegate',
      };

      // Save to Supabase
      await saveDelegationRecord({
        delegator: address,
        delegatee: record.delegatee,
        transaction_hash: record.transactionHash,
        type: record.type,
        block_number: receipt?.blockNumber
      });

      // Update local state
      const localRecord: DelegationRecord = {
        ...record,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      setDelegationHistory(prev => [localRecord, ...prev]);
      
      // Update current delegate
      setDelegationState(prev => ({
        ...prev,
        currentDelegate: delegatee,
        isLoading: false,
      }));

      // Still save to localStorage as backup
      const existingHistory = JSON.parse(localStorage.getItem('delegationHistory') || '[]');
      localStorage.setItem('delegationHistory', JSON.stringify([localRecord, ...existingHistory]));

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
    if (!provider || !address) return { success: false, error: 'No provider or address' };

    try {
      setDelegationState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(UP_TOKEN_ADDRESS, ERC20_VOTES_ABI, signer);
      
      // Delegating to zero address effectively undelegates
      const tx = await contract.delegate('0x0000000000000000000000000000000000000000');
      const receipt = await tx.wait();

      // Record the undelegation
      const record: Omit<DelegationRecord, 'id' | 'timestamp'> = {
        delegator: address,
        delegatee: '0x0000000000000000000000000000000000000000',
        transactionHash: receipt?.hash,
        type: 'undelegate',
      };

      // Save to Supabase
      await saveDelegationRecord({
        delegator: address,
        delegatee: record.delegatee,
        transaction_hash: record.transactionHash,
        type: record.type,
        block_number: receipt?.blockNumber
      });

      // Update local state
      const localRecord: DelegationRecord = {
        ...record,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      setDelegationHistory(prev => [localRecord, ...prev]);
      
      // Update current delegate
      setDelegationState(prev => ({
        ...prev,
        currentDelegate: '0x0000000000000000000000000000000000000000',
        isLoading: false,
      }));

      // Still save to localStorage as backup
      const existingHistory = JSON.parse(localStorage.getItem('delegationHistory') || '[]');
      localStorage.setItem('delegationHistory', JSON.stringify([localRecord, ...existingHistory]));

      return { success: true, transactionHash: receipt?.hash };
    } catch (error) {
      console.error('Error undelegating votes:', error);
      setDelegationState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
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

  // Load delegation history from Supabase
  const loadDelegationHistory = useCallback(async () => {
    if (!address) return;

    try {
      const result = await getDelegationHistory();
      if (result.success && result.data) {
        // Convert Supabase records to local format
        const localHistory: DelegationRecord[] = result.data.map(record => ({
          id: record.id,
          delegator: record.delegator,
          delegatee: record.delegatee,
          timestamp: new Date(record.created_at).getTime(),
          transactionHash: record.transaction_hash,
          type: record.type,
        }));
        setDelegationHistory(localHistory);
      }
    } catch (error) {
      console.error('Error loading delegation history from Supabase:', error);
      // Fallback to localStorage
      const savedHistory = localStorage.getItem('delegationHistory');
      if (savedHistory) {
        setDelegationHistory(JSON.parse(savedHistory));
      }
    }
  }, [address, getDelegationHistory]);

  // Load delegation history from localStorage (fallback)
  useEffect(() => {
    if (address) {
      loadDelegationHistory();
    } else {
      // If no address, load from localStorage as fallback
      const savedHistory = localStorage.getItem('delegationHistory');
      if (savedHistory) {
        setDelegationHistory(JSON.parse(savedHistory));
      }
    }
  }, [address, loadDelegationHistory]);

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
    loadDelegationHistory,
  };
};
