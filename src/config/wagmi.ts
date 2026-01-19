import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia, zoraSepolia } from 'wagmi/chains'
import { PROJECT_ID } from '@/src/common/utils/constants'

export const config = getDefaultConfig({
    appName: 'Astro Marketplace',
    projectId: PROJECT_ID || '',
    chains: [sepolia, zoraSepolia],
    ssr: true,
})
