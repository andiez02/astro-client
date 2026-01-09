'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '4xl' | 'full' | 'fullscreen' | 'custom'

type BaseModalProps = {
    open: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    description?: string
    size?: ModalSize
    className?: string
}

const sizeClasses: Record<Exclude<ModalSize, 'custom' | 'fullscreen'>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '4xl': 'max-w-4xl',
    full: 'w-[calc(100%-2rem)] max-w-full',
}

/* =========================
   Motion Variants 
========================= */

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.96,
        y: 8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 320,
            damping: 26,
            mass: 0.9,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.97,
        y: 6,
        transition: {
            duration: 0.15,
            ease: 'easeInOut' as const,
        },
    },
}

const fullscreenVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.18 },
    },
}

export function BaseModal({
    open,
    onClose,
    children,
    title,
    description,
    size = 'md',
    className = '',
}: BaseModalProps) {
    /* =========================
       FULLSCREEN MODAL
    ========================= */
    if (size === 'fullscreen') {
        const fullscreenClassName = `
            fixed inset-0 z-50 w-screen h-screen
            bg-background shadow-lg
            focus:outline-none
            ${className}
        `
            .trim()
            .replace(/\s+/g, ' ')

        return (
            <AnimatePresence mode="wait">
                {open && (
                    <Dialog.Root open={open} onOpenChange={o => !o && onClose()}>
                        <Dialog.Portal forceMount>
                            {/* Overlay */}
                            <Dialog.Overlay asChild>
                                <motion.div
                                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                                    variants={overlayVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                />
                            </Dialog.Overlay>

                            {/* Content */}
                            <Dialog.Content asChild>
                                <motion.div
                                    className={fullscreenClassName}
                                    variants={fullscreenVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    style={{ willChange: 'opacity' }}
                                >
                                    <Dialog.Title
                                        className={
                                            title
                                                ? 'mb-4 text-lg font-semibold p-6 pb-0'
                                                : 'sr-only'
                                        }
                                    >
                                        {title ?? 'Dialog'}
                                    </Dialog.Title>

                                    <Dialog.Description className="sr-only">
                                        {description || ''}
                                    </Dialog.Description>

                                    <div className="h-full overflow-auto p-6">
                                        {children}
                                    </div>

                                    <Dialog.Close asChild>
                                        <button
                                            aria-label="Close"
                                            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center
                                            cursor-pointer rounded-full 
                                            border border-white/20 
                                            bg-white/10 backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-110
                                            shadow-lg shadow-black/10
                                            text-gray-700
                                            transition-all duration-200
                                            hover:bg-white/20 hover:border-white/30 hover:shadow-xl hover:shadow-black/20
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </Dialog.Close>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                )}
            </AnimatePresence>
        )
    }

    /* =========================
       NORMAL MODAL
    ========================= */

    const sizeClass = size === 'custom' ? '' : sizeClasses[size]

    const modalClassName = `
        fixed left-1/2 top-1/2 z-50 w-full
        -translate-x-1/2 -translate-y-1/2
        rounded-lg bg-background shadow-lg
        focus:outline-none
        ${sizeClass}
        ${className}
    `
        .trim()
        .replace(/\s+/g, ' ')

    return (
        <AnimatePresence mode="wait">
            {open && (
                <Dialog.Root open={open} onOpenChange={o => !o && onClose()}>
                    <Dialog.Portal forceMount>
                        {/* Overlay */}
                        <Dialog.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                                variants={overlayVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            />
                        </Dialog.Overlay>

                        {/* Content */}
                        <Dialog.Content asChild>
                            <motion.div
                                className={modalClassName}
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{ willChange: 'transform, opacity' }}
                            >
                                <Dialog.Title
                                    className={
                                        title ? 'mb-4 text-lg font-semibold' : 'sr-only'
                                    }
                                >
                                    {title ?? 'Dialog'}
                                </Dialog.Title>

                                <Dialog.Description className="sr-only">
                                    {description || ''}
                                </Dialog.Description>

                                {children}

                                <Dialog.Close asChild>
                                    <button
                                        aria-label="Close"
                                        className="cursor-pointer absolute right-4 top-4 inline-flex size-7 items-center justify-center
                                        rounded-full 
                                        border border-white/20 
                                        bg-white/10 backdrop-blur-xl backdrop-saturate-150 backdrop-brightness-110
                                        shadow-lg shadow-black/10
                                        text-gray-700
                                        transition-all duration-200
                                        hover:bg-white/20 hover:border-white/30 hover:shadow-xl hover:shadow-black/20
                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </Dialog.Close>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </AnimatePresence>
    )
}
