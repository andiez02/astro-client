'use client'

import { SearchIcon } from 'lucide-react'
import { useRef } from 'react'

export default function SearchBar() {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleContainerClick = () => {
        inputRef.current?.focus()
    }

    return (
        <div
            onClick={handleContainerClick}
            className='flex items-center w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px] h-[42px] mt-4 gap-2 border border-gray-300 bg-neutral rounded-lg px-3 sm:px-4 py-2 cursor-text'
        >
            <button
                type='button'
                onClick={e => {
                    e.stopPropagation()
                    inputRef.current?.focus()
                }}
                className='flex items-center justify-center text-black text-sm px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-full font-semibold transition-all active:scale-95 shrink-0'
            >
                <SearchIcon className='w-4 h-4' />
            </button>
            <input
                ref={inputRef}
                type='text'
                placeholder='Search'
                className='outline-none text-sm font-medium text-gray-900 w-full bg-transparent placeholder:text-gray-500'
            />
        </div>
    )
}
