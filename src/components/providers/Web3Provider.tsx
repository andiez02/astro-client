'use client'

import React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from '@/src/config/wagmi'
import { useAutoLogin } from '@/src/common/hooks/useAutoLogin'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

// Component to trigger auto-login after wallet connects
function AutoLoginHandler({ children }: { children: React.ReactNode }) {
    useAutoLogin()
    return <>{children}</>
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()}>
                    <AutoLoginHandler>{children}</AutoLoginHandler>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
