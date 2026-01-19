import { IconProps } from './IconProps'

const CollectionIcon = ({ color = 'currentColor', size = 26, ...props }: IconProps) => (
    <svg
        {...props}
        width={size}
        height={size}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 16 16'
    >
        <path
            d='M13 9.5a1 1 0 1 0-2 0V11H9.5a1 1 0 1 0 0 2H11v1.5a1 1 0 1 0 2 0V13h1.5a1 1 0 1 0 0-2H13V9.5ZM2.5 9A1.5 1.5 0 0 0 1 10.5v3A1.5 1.5 0 0 0 2.5 15h3A1.5 1.5 0 0 0 7 13.5v-3A1.5 1.5 0 0 0 5.5 9h-3ZM2.5 1A1.5 1.5 0 0 0 1 2.5v3A1.5 1.5 0 0 0 2.5 7h3A1.5 1.5 0 0 0 7 5.5v-3A1.5 1.5 0 0 0 5.5 1h-3ZM9 2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3Z'
            fill={color}
        ></path>
    </svg>
)

export { CollectionIcon }
