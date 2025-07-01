import type { Steward } from '../types';

export const UNLOCK_STEWARDS: Steward[] = [
  {
    address: '0x1234567890123456789012345678901234567890', // Placeholder address
    name: 'Julien Genestoux',
    description: 'Co-founder of Unlock Protocol. Leading protocol development and ecosystem growth.',
    avatar: '👨‍💻'
  },
  {
    address: '0x2345678901234567890123456789012345678901', // Placeholder address
    name: 'Christopher Carfi',
    description: 'Head of Community at Unlock Protocol. Focused on community building and partnerships.',
    avatar: '🤝'
  },
  {
    address: '0x3456789012345678901234567890123456789012', // Placeholder address
    name: 'Clément Lesaege',
    description: 'Technical advisor and governance expert. Contributing to protocol security and governance.',
    avatar: '🔒'
  },
  {
    address: '0x4567890123456789012345678901234567890123', // Placeholder address
    name: 'Angela Steffens',
    description: 'Growth and partnerships lead. Working on protocol adoption and strategic partnerships.',
    avatar: '📈'
  },
  {
    address: '0x5678901234567890123456789012345678901234', // Placeholder address
    name: 'Kalidou Diagne',
    description: 'Core developer focused on smart contract development and protocol improvements.',
    avatar: '⚡'
  }
];

export const getStewardByAddress = (address: string): Steward | undefined => {
  return UNLOCK_STEWARDS.find(steward => 
    steward.address.toLowerCase() === address.toLowerCase()
  );
};
