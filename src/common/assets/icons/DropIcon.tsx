import { IconProps } from './IconProps';

const DropIcon = ({ color = 'currentColor', size = 26, ...props }: IconProps) => (
    <svg {...props} width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.312 14.345A3.988 3.988 0 0 0 11.5 11.5V3.265l3.184.853a1.5 1.5 0 0 1 1.06 1.837l-2.073 7.738a1.5 1.5 0 0 1-1.837 1.06l-1.522-.408ZM0 2.5A1.5 1.5 0 0 1 1.5 1h6A1.5 1.5 0 0 1 9 2.5v9A1.5 1.5 0 0 1 7.5 13h-6A1.5 1.5 0 0 1 0 11.5v-9Z" fill={color}></path></svg>
);

export { DropIcon };
