import { HEADER_HEIGHT } from '@/src/common/utils/constants'

export default function NotificationsPage() {
    return (
        <div
            className="flex flex-col items-center justify-center bg-gray-100"
            style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT})` }}
        >
            <h1 className='text-4xl font-bold font-display'>Notifications</h1>
        </div>
    )
}
