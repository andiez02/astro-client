import { HEADER_HEIGHT } from '@/src/common/utils/constants'
import Header from '@/src/components/layout/Header'
import Sidebar from '@/src/components/layout/Sidebar'

export default function ExplorePage() {
    return (
        <>
            <Header />
            <Sidebar />
            <div
                className='flex flex-col items-center justify-center bg-gray-100'
                style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT})` }}
            >
                <h1 className='text-4xl font-bold font-display'>Explore</h1>
            </div>
        </>
    )
}
