'use client';

import { useEffect, useRef } from 'react';
import { useAccount, useSignMessage, useChainId, useSwitchChain } from 'wagmi';
import { SiweMessage } from 'siwe';
import { api } from '@/src/services/apiService';
import { SEPOLIA_CHAIN_ID } from '../utils/constants';

export function useAutoLogin() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  
  // Prevent multiple login attempts
  const isLoggingIn = useRef(false);

  console.log('🥦 ~ useAutoLogin ~ isLoggingIn:', isLoggingIn)

  const lastAddress = useRef<string | null>(null);

  useEffect(() => {
    const performLogin = async () => {
      // Skip if not connected or already logging in
      if (!isConnected || !address) return;
      if (isLoggingIn.current) return;
      
      // Check if user already has a valid token (verify with backend)
      const hasValidToken = await api.auth.checkAuthAsync();
      
      // If token exists but is invalid with backend, remove it
      if (!hasValidToken && api.auth.getToken()) {
        console.log('⚠️ Token exists but invalid with backend, removing...');
        api.auth.logout();
        lastAddress.current = null;
      }
      
      // If we have a valid token and this is the same address, skip auto-login
      if (hasValidToken) {
        if (lastAddress.current === address) {
          console.log('✅ Already authenticated with valid token, skipping auto-login');
          return;
        }
        // If address changed but we have a token, logout old session
        if (lastAddress.current && lastAddress.current !== address) {
          console.log('⚠️ Address changed, logging out old session');
          api.auth.logout();
        }
        // Set current address to prevent re-login on reload
        lastAddress.current = address;
        console.log('✅ Valid token verified with backend, skipping auto-login');
        return;
      }

      // No valid token - proceed with auto-login
      isLoggingIn.current = true;

      try {
        // Check if on wrong chain and switch if needed
        if (chainId !== SEPOLIA_CHAIN_ID) {
          console.log('⚠️ Wrong chain detected:', chainId, '- Switching to Sepolia...');
          
          try {
            await switchChainAsync({ chainId: SEPOLIA_CHAIN_ID });
            console.log('✅ Switched to Sepolia');
            // After chain switch, the effect will re-run with new chainId
            // Reset flag to allow re-attempt
            isLoggingIn.current = false;
            return;
          } catch (switchError) {
            console.error('❌ Failed to switch chain:', switchError);
            isLoggingIn.current = false;
            return;
          }
        }

        lastAddress.current = address;
        console.log('🚀 Auto-login started for:', address);
        
        // 1. Get nonce from backend
        const nonce = await api.auth.getNonce(address);
        console.log('🔑 Got nonce:', nonce);

        // 2. Create SIWE message
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to Krypto Marketplace.',
          uri: window.location.origin,
          version: '1',
          chainId: SEPOLIA_CHAIN_ID,
          nonce,
        });

        const messageString = message.prepareMessage();
        console.log('📝 Message prepared');

        // 3. Sign message with wallet (MetaMask popup)
        const signature = await signMessageAsync({ message: messageString });
        console.log('✍️ Message signed');

        // 4. Verify with backend and get token
        const result = await api.auth.login(messageString, signature);
        
        if (result?.accessToken) {
          api.auth.saveToken(result.accessToken);
          console.log('✅ Login successful!');
        }
      } catch (error) {
        console.error('❌ Auto-login error:', error);
        // Reset on error so user can retry
        lastAddress.current = null;
      } finally {
        isLoggingIn.current = false;
      }
    };

    performLogin();
  }, [isConnected, address, chainId, signMessageAsync, switchChainAsync]);
}

