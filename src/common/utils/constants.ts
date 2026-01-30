export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID

export const HEADER_HEIGHT = '60px'

export const APP_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111)

export const BASE_CLASS =
    'flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200 md:hover:bg-gray-100 transition-colors group cursor-pointer'
export const ICON_CLASS = 'size-6 md:size-7 transition-colors'

export const routes = {
    CREATE_NFT: '/create/nft',
    CREATE_EDITION: '/create/edition',
    CREATE_DROP: '/create/drop',
    CREATE_COLLECTION: '/create/standard',
    CREATE_MINT: '/create/mint',

    HOME: '/',
    EXPLORE: '/explore',
    NOTIFICATIONS: '/notifications',
    PROFILE: '/profile',
}
