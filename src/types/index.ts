export interface DelegationRecord {
  id: string;
  delegator: string;
  delegatee: string;
  timestamp: number;
  transactionHash?: string;
  type: 'delegate' | 'undelegate';
}

export interface Steward {
  address: string;
  name: string;
  description: string;
  avatar?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
}

export interface DelegationState {
  currentDelegate: string | null;
  isLoading: boolean;
  error: string | null;
}
