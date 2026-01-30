import { useWriteContract } from 'wagmi'
import CollectionFactoryABI from '@/src/abis/CollectionFactory.json'

export function useCreateCollection() {
  return useWriteContract()
}
