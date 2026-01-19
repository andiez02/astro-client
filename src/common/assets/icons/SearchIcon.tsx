const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill='currentColor' viewBox='0 0 256 256'>
        <path fill='none' d='M0 0h256v256H0z'></path>
        <circle
            cx='112'
            cy='112'
            r='80'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
        ></circle>
        <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='24'
            d='M168.57 168.57 224 224'
        ></path>
    </svg>
)

export { SearchIcon }
