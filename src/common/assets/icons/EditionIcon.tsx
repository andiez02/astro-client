import { IconProps } from './IconProps'

const EditionIcon = ({ color = 'currentColor', size = 26, ...props }: IconProps) => (
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
            d='m15.562 11.37-.852-.307-5.797 2.105a2.666 2.666 0 0 1-1.818 0l-5.804-2.105-.852.306a.667.667 0 0 0 0 1.254l7.334 2.666a.667.667 0 0 0 .456 0l7.333-2.666a.666.666 0 0 0 0-1.254Zm0-4-.852-.308-5.797 2.106a2.667 2.667 0 0 1-1.818 0L1.291 7.062.44 7.37a.667.667 0 0 0 0 1.253l7.334 2.667a.667.667 0 0 0 .456 0l7.333-2.667a.667.667 0 0 0 0-1.253ZM8.229.695l7.333 2.667a.667.667 0 0 1 0 1.253L8.229 7.283a.667.667 0 0 1-.456 0L.439 4.616a.667.667 0 0 1 0-1.253L7.773.696a.667.667 0 0 1 .456 0Z'
            fill={color}
        ></path>
    </svg>
)

export { EditionIcon }
