import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit';
import { SiweMessage } from 'siwe';
import { getAccount } from 'wagmi/actions';
import { config } from './wagmi';
import { api } from '@/src/services/apiService';

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    // Get connected address from wagmi
    const account = getAccount(config);
    
    if (!account.address) {
      throw new Error('Wallet not connected');
    }

    // Fetch nonce from backend
    const nonce = await api.auth.getNonce(account.address);
    return nonce;
  },

  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to Krypto Marketplace.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce,
    });
  },

  verify: async ({ message, signature }) => {
    try {
      const siweMessage = message as SiweMessage;
      const messageString = siweMessage.prepareMessage();

      // Call backend to verify and get token
      const { accessToken } = await api.auth.login(messageString, signature);

      // Save token to localStorage
      api.auth.saveToken(accessToken);

      return true;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  },

  signOut: async () => {
    api.auth.logout();
  },
});

