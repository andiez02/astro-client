import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia, zoraSepolia } from 'wagmi/chains'
import type { Chain } from 'viem'
import { PROJECT_ID, APP_CHAIN_ID } from '@/src/common/utils/constants'

const localRpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'

const localChain: Chain = {
    id: APP_CHAIN_ID,
    name: 'GO Testnet',
    nativeCurrency: { name: 'GO', symbol: 'GO', decimals: 18 },
    rpcUrls: {
        default: { http: [localRpcUrl] },
        public: { http: [localRpcUrl] },
    },
}

export const config = getDefaultConfig({
    appName: 'Astro Marketplace',
    projectId: PROJECT_ID || '',
    chains: [sepolia, zoraSepolia, localChain],
    ssr: false,
})
