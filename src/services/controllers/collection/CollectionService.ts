import { AxiosInstance } from "axios"
import { CollectionResponseDTO } from "@/src/services/types/apiType"

class CollectionService {
    constructor(private apiClient: AxiosInstance) {}

    async getCollections(creatorAddress: string): Promise<CollectionResponseDTO[]> {
        const res = await this.apiClient.get(`/collections?creatorAddress=${creatorAddress}`)
        return res?.data?.data
    }

    async getCollection(collectionAddress: string): Promise<CollectionResponseDTO> {
        const res = await this.apiClient.get(`/collections/${collectionAddress}`)
        return res?.data?.data
    }
}

export default CollectionService