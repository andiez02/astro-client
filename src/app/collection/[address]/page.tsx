'use client'

import { useParams } from "next/navigation"

export default function MintNFTPage() {
    const { address } = useParams()
    return (
        <div>
            <h1>Mint NFT: {address}</h1>
        </div>
    )
}
