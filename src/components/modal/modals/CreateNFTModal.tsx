import { useState } from "react"
import { BaseModal } from "../../ui/BaseModal"
import { NFTIcon } from "@/src/common/assets/icons/NFTIcons"
import { EditionIcon } from "@/src/common/assets/icons/EditionIcon"
import { DropIcon } from "@/src/common/assets/icons/DropIcon"
import { CollectionIcon } from "@/src/common/assets/icons/CollectionIcon"
import Image from "next/image"
import createNFTImage from "@/src/common/assets/images/create-nft.jpg"
import createEditionImage from "@/src/common/assets/images/create-edition.png"
import createDropImage from "@/src/common/assets/images/create-drop.png"
import createCollectionImage from "@/src/common/assets/images/create-collection.png"
import { PlusIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CreateNFTModal({
    onClose,
}: {
    onClose: () => void
}) {
    const tabs = [
        { id: 'nft', label: 'NFT', Icon: NFTIcon },
        { id: 'edition', label: 'Edition', Icon: EditionIcon },
        { id: 'drop', label: 'Drop', Icon: DropIcon },
        { id: 'collection', label: 'Collection', Icon: CollectionIcon },
    ] as const

    const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('nft')

    const getBackgroundImage = () => {
        switch (activeTab) {
            case 'edition':
                return createEditionImage
            case 'drop':
                return createDropImage
            case 'collection':
                return createCollectionImage
            case 'nft':
            default:
                return createNFTImage
        }
    }

    const getTabContent = () => {
        switch (activeTab) {
            case 'edition':
                return {
                    Icon: EditionIcon,
                    title: 'Edition',
                    description: 'Create multiple editions of a digital collectible to share with your community.'
                }
            case 'drop':
                return {
                    Icon: DropIcon,
                    title: 'Drop',
                    description: 'Launch a curated drop with a series of NFTs released together.'
                }
            case 'collection':
                return {
                    Icon: CollectionIcon,
                    title: 'Collection',
                    description: 'Create and organize a collection to group your NFTs under one brand.'
                }
            case 'nft':
            default:
                return {
                    Icon: NFTIcon,
                    title: 'NFT',
                    description: 'Create a unique 1/1 NFT with rich metadata and media.'
                }
        }
    }

    const contentVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
        exit: {
            opacity: 0,
            y: 10,
            transition: {
                duration: 0.2,
            },
        },
    }

    return (
        <BaseModal
            open
            onClose={onClose}
            size="4xl"
        >
            <div className="flex">
                {/* Tabs list */}
                <div className="w-1/4 flex flex-col gap-4 mb-52 p-6">
                    <span className="uppercase text-xs font-semibold tracking-wide text-gray-500 mt-2">
                        Create
                    </span>

                    <div className="flex flex-col gap-2">
                        {tabs.map(tab => {
                            const isActive = activeTab === tab.id
                            const Icon = tab.Icon

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-3 py-2 rounded-lg text-md font-semibold
                                        transition-colors cursor-pointer text-left
                                        ${isActive
                                            ? 'bg-gray-200'
                                            : 'bg-transparent hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <Icon className="size-4" />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="relative w-3/4 min-h-[260px] overflow-hidden rounded-r-lg">
                    <Image
                        src={getBackgroundImage()}
                        alt="Create NFT"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Optional overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Gradient fade effect for entire right tab area */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />

                    <div className="relative flex h-full w-full items-end justify-between p-6 gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                className="flex flex-col items-start gap-3 max-w-md pb-4"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {(() => {
                                    const content = getTabContent()
                                    const ContentIcon = content.Icon
                                    return (
                                        <>
                                            <ContentIcon className="size-8 text-white shrink-0 mt-0.5" />
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-4xl font-semibold text-white">
                                                    {content.title}
                                                </h3>
                                                <p className="text-md text-white/90">
                                                    {content.description}
                                                </p>
                                            </div>
                                        </>
                                    )
                                })()}
                            </motion.div>
                        </AnimatePresence>
                        <motion.button
                            type="button"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 text-gray-900 text-md font-semibold shadow-md hover:bg-white transition-colors cursor-pointer mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            Create
                            <PlusIcon className="size-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}

