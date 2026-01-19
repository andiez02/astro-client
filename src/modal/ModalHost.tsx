import { useModal } from './hooks/useModal'
import { CreateNFTModal } from './modals/CreateNFTModal'

function ModalHost() {
    const { state, close } = useModal()

    if (state.type === null) return null

    switch (state.type) {
        case 'CREATE_NFT':
            return <CreateNFTModal onClose={close} />
    }
}

export default ModalHost
