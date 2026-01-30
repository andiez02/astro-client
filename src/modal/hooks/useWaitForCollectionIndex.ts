import { api } from '@/src/services/apiService'

export async function waitForCollectionIndexed(
  creatorAddress: string | undefined, // Keep signature compatible or update? Let's check call sites. Only StandardPage calls it?
  targetAddress: string,
  timeoutMs = 60000, // Increased timeout just in case
  intervalMs = 2000
) {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
        // Try to fetch specific collection directly - more efficient and accurate
        const res = await api.collection.getCollection(targetAddress)
        if (res) {
            return res
        }
    } catch (e) {
        // Ignore errors (404 etc) while polling
    }
    
    await new Promise((r) => setTimeout(r, intervalMs))
  }

  throw new Error('Collection indexing timeout')
}
