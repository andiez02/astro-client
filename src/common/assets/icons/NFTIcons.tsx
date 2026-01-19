import { IconProps } from './IconProps'

const NFTIcon = ({ color = 'currentColor', size = 26, ...props }: IconProps) => (
    <svg
        {...props}
        width={size}
        height={size}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 16 16'
    >
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9.592.427a3.185 3.185 0 0 0-3.184 0l-4.17 2.407A3.185 3.185 0 0 0 .645 5.592v4.816c0 1.137.607 2.189 1.593 2.758l4.17 2.407c.985.57 2.199.57 3.184 0l4.17-2.407a3.185 3.185 0 0 0 1.593-2.758V5.592c0-1.137-.607-2.189-1.593-2.758L9.592.427Zm1.359 6.312a.696.696 0 0 0-.021-.986.7.7 0 0 0-.989.021L7.126 8.708 6.082 7.504a.7.7 0 0 0-.985-.07.696.696 0 0 0-.072.983L6.571 10.2a.7.7 0 0 0 1.034.026l3.346-3.487Z'
            fill={color}
        ></path>
    </svg>
)

export { NFTIcon }
