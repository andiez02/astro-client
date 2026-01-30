'use client'

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react'
import { cn } from '@/src/common/utils/cn'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    hint?: string
    error?: string
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, hint, error, leftIcon, rightIcon, className = '', id, disabled, ...props }, ref) => {
        const autoId = useId()
        const inputId = id ?? autoId
        const hintId = hint ? `${inputId}-hint` : undefined
        const errorId = error ? `${inputId}-error` : undefined
        const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
        const isDisabled = !!disabled

        return (
            <div className='space-y-1.5'>
                {label && (
                    <label htmlFor={inputId} className='block text-sm font-semibold text-gray-900'>
                        {label}
                    </label>
                )}

                <div
                    className={cn(
                        'flex items-center gap-2 rounded-lg border bg-white px-3 py-2 transition-colors',
                        isDisabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : error
                              ? 'border-red-300 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100'
                              : 'border-gray-200 focus-within:border-gray-300 focus-within:ring-4 focus-within:ring-gray-100',
                    )}
                >
                    {leftIcon ? (
                        <span
                            className={`shrink-0 ${isDisabled ? 'text-gray-300' : 'text-gray-400'}`}
                        >
                            {leftIcon}
                        </span>
                    ) : null}

                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={!!error}
                        aria-describedby={describedBy}
                        disabled={disabled}
                        className={cn(
                            'w-full bg-transparent outline-none placeholder:text-gray-400 text-sm',
                            isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900',
                            className,
                        )}
                        {...props}
                    />

                    {rightIcon ? (
                        <span
                            className={`shrink-0 ${isDisabled ? 'text-gray-300' : 'text-gray-400'}`}
                        >
                            {rightIcon}
                        </span>
                    ) : null}
                </div>

                {hint && !error && (
                    <p id={hintId} className='text-xs text-gray-500'>
                        {hint}
                    </p>
                )}

                {error && (
                    <p id={errorId} className='text-xs font-medium text-red-600'>
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

InputField.displayName = 'InputField'
