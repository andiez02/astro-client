'use client'

import { SearchIcon } from "lucide-react"

export default function SearchBar() {
    return (
        <div className="flex items-center w-[500px] gap-2 border border-gray-300 bg-neutral rounded-lg px-4 py-2">
            <button className="text-black text-sm px-2 py-2 rounded-full font-semibold transition-all active:scale-95 font-mono ">
                <SearchIcon className="w-4 h-4" />
            </button>
            <input type="text" placeholder="Search" className="outline-none text-sm font-medium text-gray-900" />
        </div>
    )
}
