'use client'

import Header from '@/src/components/layout/Header'
import { HEADER_HEIGHT, routes } from '@/src/common/utils/constants'
import { InputField } from '@/src/components/ui/InputField'
import { EthereumIcon } from '@/src/common/assets/icons/EthereumIcon'
import { Button } from '@/src/components/ui/Button'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAccount, usePublicClient } from 'wagmi'
import { useCreateCollection } from '@/src/common/hooks/useCreateCollection'
import { toast } from 'sonner'
import CollectionFactoryABI from '@/src/abis/CollectionFactory.json'
import { Abi, decodeEventLog } from 'viem'
import { waitForCollectionIndexed } from '@/src/modal/hooks/useWaitForCollectionIndex'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CircleCheckBig } from 'lucide-react'

export default function CreateStandardPage() {
    const { address } = useAccount()
    const publicClient = usePublicClient()
    const { writeContractAsync } = useCreateCollection()
    const router = useRouter()

    const [collectionAddress, setCollectionAddress] = useState('')
    const [isSmartContractDeployed, setIsSmartContractDeployed] = useState(false)

    {/* Form validation */ }
    type FormValues = z.infer<typeof schema>
    const schema = z.object({
        collectionName: z.string().min(1, 'A collection name is required'),
        collectionSymbol: z.string().min(1, 'A collection symbol is required')
    })
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        control,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            collectionName: '',
            collectionSymbol: '',
        },
    })
    const collectionName = useWatch({ control, name: 'collectionName' }) || ''
    const collectionSymbol = useWatch({ control, name: 'collectionSymbol' }) || ''

    {/* Submit form */ }
    const onSubmit = async (data: FormValues) => {
        if (!address) {
            toast.error('Please connect wallet')
            return
        }

        try {
            // =========================
            // STEP 1: SEND TRANSACTION
            // =========================
            const txHash = await writeContractAsync({
                address: process.env.NEXT_PUBLIC_COLLECTION_FACTORY_ADDRESS as `0x${string}`,
                abi: CollectionFactoryABI.abi as Abi,
                functionName: 'createERC721Collection',
                args: [
                    data.collectionName,
                    data.collectionSymbol,
                    address,
                    0, // royalty 0%
                ],
            })
            toast.success('Transaction sent. Waiting for confirmation...')
            console.log('Tx hash:', txHash)

            // =========================
            // STEP 2: WAIT TX MINED
            // =========================

            const receipt = await publicClient?.waitForTransactionReceipt({ hash: txHash })
            if (!receipt) {
                toast.error('Transaction failed')
                return
            }

            toast.success('Collection deployed. Indexing...')
            console.log('Receipt:', receipt)

            // =========================
            // STEP 3: DECODE EVENT & GET ADDRESS
            // =========================
            const factoryAddress = process.env.NEXT_PUBLIC_COLLECTION_FACTORY_ADDRESS as `0x${string}`
            const log = receipt.logs.find(
                (log) => log.address.toLowerCase() === factoryAddress.toLowerCase()
            )

            let deployedAddress = '';

            if (log) {
                try {
                    const event = decodeEventLog({
                        abi: CollectionFactoryABI.abi as Abi,
                        data: log.data,
                        topics: log.topics,
                        eventName: 'CollectionCreated',
                    })

                    const args = event.args as unknown as {
                        creator: `0x${string}`
                        collection: `0x${string}`
                        collectionType: string
                    }
                    deployedAddress = args.collection
                    console.log('Collection address from event:', deployedAddress)
                    toast.success(`Collection created at ${deployedAddress.slice(0, 6)}...${deployedAddress.slice(-4)}`)
                } catch (err) {
                    console.error('Failed to decode event:', err)
                    toast.error("Failed to decode collection address")
                    return;
                }
            } else {
                console.error("No log found from factory");
                toast.error("Could not find collection creation log");
                return;
            }

            // =========================
            // STEP 4: WAIT FOR COLLECTION INDEXED
            // =========================
            if (deployedAddress) {
                const collection = await waitForCollectionIndexed(address, deployedAddress)
                setCollectionAddress(collection.contractAddress)
                setIsSmartContractDeployed(true)
            }

        } catch (err) {
            toast.error((err as Error).message || 'Create collection failed')
        }
    }

    const handleMintNFT = () => {
        if (!collectionAddress) return
        router.push(`/create/upload?contractAddress=${collectionAddress}`)
    }

    {/* UI */ }
    return (
        <>
            <Header
                showLogo
                showWallet
                showSearch={false}
                showThemeToggle={false}
                className='bg-gray-100'
            />
            <div className='flex bg-gray-100' style={{ height: `calc(100vh - ${HEADER_HEIGHT})` }}>
                <div className='flex gap-10 justify-end pr-6 mt-10 flex-1/6'>
                    {isSmartContractDeployed ? (
                        <>
                            <div className='w-[600px] h-[48%] rounded-3xl p-16 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.14)] border border-gray-100'>
                                <CircleCheckBig size={40} />
                                <h1 className='text-3xl font-bold mt-8'>Your smart contract was deployed!</h1>
                                <p className='mt-4 font-semibold text-gray-500 text-md'>Congratulations! Your smart contract was deployed to the blockchain.</p>
                                <div className='flex gap-4 mt-12 w-full justify-center'>
                                    <Button className='w-1/2 h-12 rounded-full' onClick={handleMintNFT}>Mint an NFT</Button>
                                    <Button className='w-1/2 h-12 rounded-full'>View Collection</Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='w-[560px] h-[80%] rounded-3xl p-16 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.14)] border border-gray-100'>
                                <h1 className='text-3xl font-bold'>Create a standard collection</h1>
                                <p className='mt-4 font-semibold text-gray-500 text-md'>
                                    Deploy a standard NFT contract that you can mint to at anytime. The
                                    following details are used to create your own smart contract.
                                </p>

                                {/* Form */}
                                <form className='my-8 space-y-5' onSubmit={handleSubmit(onSubmit)}>
                                    {/* Collection Name */}
                                    <InputField
                                        label='Collection Name'
                                        error={errors.collectionName?.message}
                                        className='h-12 text-base font-bold'
                                        {...register('collectionName')}
                                    />

                                    {/* Collection Symbol */}
                                    <InputField
                                        label='Collection Symbol'
                                        error={errors.collectionSymbol?.message}
                                        className='h-12 text-base font-bold'
                                        {...register('collectionSymbol')}
                                    />

                                    {/* Chain */}
                                    <InputField
                                        label='Chain'
                                        value='Sepolia'
                                        disabled
                                        leftIcon={<EthereumIcon className='w-5 h-5' />}
                                        className='h-12 font-bold bg-gray-50 cursor-not-allowed'
                                    />

                                    {/* Continue Button */}
                                    <div className='pt-8'>
                                        <Button
                                            variant='primary'
                                            size='lg'
                                            fullWidth
                                            className='rounded-2xl'
                                            disabled={!isValid || isSubmitting}
                                            isLoading={isSubmitting}
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            Continue
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div >
                <div
                    className={`flex-1 justify-start pl-6 mt-10 min-h-(calc(100vh-${HEADER_HEIGHT}))`}
                >
                    <div className='w-[340px] h-[55%] rounded-3xl p-6 bg-st-black2 border-4 border-gray-200 flex flex-col justify-between'>
                        <div className='flex justify-between gap-4'>
                            <div className='size-28 bg-st-black5 rounded-lg animate-pulse' />
                            {collectionSymbol ? (
                                <div className='px-4 h-10 max-w-[140px] min-w-0 rounded-2xl bg-st-black5 flex items-center text-base font-bold text-gray-900'>
                                    <span className='block w-full truncate' title={collectionSymbol}>
                                        {collectionSymbol}
                                    </span>
                                </div>
                            ) : (
                                <div className='w-28 h-10 bg-st-black5 rounded-2xl animate-pulse' />
                            )}
                        </div>
                        <div className='flex flex-col gap-4'>
                            {collectionName ? (
                                <div className='text-2xl font-extrabold text-gray-900'>
                                    {collectionName}
                                </div>
                            ) : (
                                <div className='w-32 h-10 bg-st-black5 rounded-lg animate-pulse' />
                            )}
                            <div className='w-40 h-10 bg-st-black5 rounded-lg animate-pulse' />
                            <p className='text-2xl text-st-black20 font-bold'>0 NFTs</p>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
