'use client'

import { createContext, useReducer } from 'react'
import ModalHost from '../../modal/ModalHost'
import { ModalState } from '../../modal/modal.type'

type Action = { type: 'OPEN'; modal: ModalState } | { type: 'CLOSE' }

export const ModalContext = createContext<{
    state: ModalState
    open: (modal: ModalState) => void
    close: () => void
} | null>(null)

function reducer(_: ModalState, action: Action): ModalState {
    switch (action.type) {
        case 'OPEN':
            return action.modal
        case 'CLOSE':
            return { type: null }
    }
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { type: null })

    return (
        <ModalContext.Provider
            value={{
                state,
                open: modal => dispatch({ type: 'OPEN', modal }),
                close: () => dispatch({ type: 'CLOSE' }),
            }}
        >
            {children}
            <ModalHost />
        </ModalContext.Provider>
    )
}
