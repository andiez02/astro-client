'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface MintContextType {
    ipfsUrl: string | null
    gatewayUrl: string | null
    fileType: string | null
    contractAddress: string | null
    isLoaded: boolean
    setUploadData: (data: { ipfsUrl: string; gatewayUrl: string; fileType: string; contractAddress: string }) => void
    clearUploadData: () => void
}

const MintContext = createContext<MintContextType | undefined>(undefined)

const STORAGE_KEY = 'MINT_UPLOAD_DATA';

export function MintProvider({ children }: { children: ReactNode }) {
    const [uploadData, setUploadDataState] = useState<{
        ipfsUrl: string | null
        gatewayUrl: string | null
        fileType: string | null
        contractAddress: string | null
    }>({
        ipfsUrl: null,
        gatewayUrl: null,
        fileType: null,
        contractAddress: null,
    })
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from session storage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setUploadDataState(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse stored mint data", e);
                }
            }
            setIsLoaded(true);
        } else {
            setIsLoaded(true);
        }
    }, []);

    const setUploadData = (data: { ipfsUrl: string; gatewayUrl: string; fileType: string; contractAddress: string }) => {
        setUploadDataState(data)
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }

    const clearUploadData = () => {
        setUploadDataState({
            ipfsUrl: null,
            gatewayUrl: null,
            fileType: null,
            contractAddress: null,
        })
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }

    return (
        <MintContext.Provider
            value={{
                ...uploadData,
                isLoaded,
                setUploadData,
                clearUploadData,
            }}
        >
            {children}
        </MintContext.Provider>
    )
}

export function useMint() {
    const context = useContext(MintContext)
    if (context === undefined) {
        throw new Error('useMint must be used within a MintProvider')
    }
    return context
}
