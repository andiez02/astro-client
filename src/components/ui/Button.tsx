'use client'

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/src/common/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    isLoading?: boolean
    fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-200 disabled:text-gray-400',
    secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400',
    outline:
        'border-2 border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 active:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 disabled:text-white',
    success:
        'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 disabled:text-white',
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            leftIcon,
            rightIcon,
            isLoading = false,
            fullWidth = false,
            className = '',
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold cursor-pointer',
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
                    'disabled:cursor-default',
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && 'w-full',
                    className,
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className='h-4 w-4 animate-spin'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            />
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            />
                        </svg>
                        {size !== 'icon' && <span>Loading...</span>}
                    </>
                ) : (
                    <>
                        {leftIcon && <span className='shrink-0'>{leftIcon}</span>}
                        {size !== 'icon' && children}
                        {rightIcon && <span className='shrink-0'>{rightIcon}</span>}
                    </>
                )}
            </button>
        )
    },
)

Button.displayName = 'Button'
