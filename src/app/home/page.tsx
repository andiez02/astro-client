import { HEADER_HEIGHT } from '@/src/common/utils/constants';

export default function Home() {
    return (
        <div
            className="flex flex-col items-center justify-center bg-background"
            style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT})` }}
        >
            <h1 className='text-4xl font-bold font-display'>Home</h1>
        </div>
    )
}
