'use client'

import Header from '@/src/components/layout/Header'
import { HEADER_HEIGHT } from '@/src/common/utils/constants'
import { InputField } from '@/src/components/ui/InputField'
import { Button } from '@/src/components/ui/Button'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { blo } from 'blo'
import { useMint } from '@/src/components/providers/MintProvider'
import { useEffect, use, useState } from 'react'
import { api } from '@/src/services/apiService'
import { CollectionResponseDTO } from '@/src/services/types/apiType'
import { toast } from 'sonner'

export default function MintPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const contractAddressFromQuery = searchParams.get('contractAddress');

    // contractAddress here comes from the provider (session storage)
    const { ipfsUrl, gatewayUrl, fileType, isLoaded, contractAddress } = useMint();
    const { address } = useAccount();
    const [collection, setCollection] = useState<CollectionResponseDTO | null>(null);

    // Use the address from provider if available (stronger link to the upload), otherwise query
    const activeAddress = contractAddress || contractAddressFromQuery;

    useEffect(() => {
        const fetchCollection = async () => {
            if (!activeAddress) return;
            try {
                // Fetch collection by address directly
                const collectionData = await api.collection.getCollection(activeAddress);
                if (collectionData) {
                    setCollection(collectionData);
                }
            } catch (error) {
                console.error("Failed to fetch collection", error);
                // toast.error("Could not fetch collection details");
            }
        };

        fetchCollection();
    }, [activeAddress]);

    useEffect(() => {
        if (!isLoaded) return; // Wait for provider to load

        if (!ipfsUrl || !gatewayUrl) {
            // If direct access or refresh, redirect back to upload
            const targetAddress = activeAddress && activeAddress !== 'new' ? activeAddress : '';
            if (targetAddress) {
                router.push(`/create/upload?contractAddress=${targetAddress}`);
            } else {
                router.push(`/create/upload`);
            }
        }
    }, [ipfsUrl, gatewayUrl, router, activeAddress, isLoaded]);

    const isVideo = fileType?.startsWith('video/');

    {/* Form validation */ }
    type FormValues = z.infer<typeof schema>
    const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
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
            name: '',
            description: '',
        },
    })

    // Watch values only if needed for other logic, but removed from preview as requested
    // const name = useWatch({ control, name: 'name' }) || ''
    const description = useWatch({ control, name: 'description' }) || ''

    const onSubmit = async (data: FormValues) => {
        console.log("Minting with:", { ...data, ipfsUrl, gatewayUrl, address: activeAddress });
        // TODO: Implement Minting Logic
    }

    return (
        <>
            <Header
                showLogo
                showWallet
                showSearch={false}
                showThemeToggle={false}
                className='bg-gray-100'
            />
            <div className='flex justify-center gap-6 bg-gray-100 pt-10' style={{ height: `calc(100vh - ${HEADER_HEIGHT})` }}>
                <div className='min-h-[80%]'>
                    <div className='w-[560px] min-h-[80%] rounded-3xl p-16 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.14)] border border-gray-100 overflow-y-auto'>
                        <h1 className='text-3xl font-bold'>Mint an NFT</h1>
                        <p className='mt-4 font-semibold text-gray-500 text-md'>
                            Once your NFT is minted to the blockchain, you will not be able to edit or update any of its information.
                        </p>

                        {/* Form */}
                        <form className='my-8 space-y-5' onSubmit={handleSubmit(onSubmit)}>
                            {/* Name */}
                            <InputField
                                label='Name'
                                error={errors.name?.message}
                                className='h-12 text-base font-bold'
                                placeholder='Name'
                                {...register('name')}
                            />

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-900">Description</label>
                                <div
                                    className={`flex items-start gap-2 rounded-lg border bg-white px-3 py-2 transition-colors ${errors.description
                                        ? 'border-red-300 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100'
                                        : 'border-gray-200 focus-within:border-gray-300 focus-within:ring-4 focus-within:ring-gray-100'
                                        }`}
                                >
                                    <textarea
                                        className="w-full bg-transparent outline-none placeholder:text-gray-400 resize-none h-32 text-base font-semibold text-gray-900"
                                        placeholder="Description"
                                        maxLength={1000}
                                        {...register('description')}
                                    />
                                </div>
                                {errors.description && (
                                    <p className="text-xs font-medium text-red-600">{errors.description.message}</p>
                                )}
                                <div className="flex justify-end mt-1">
                                    <span className="text-xs text-gray-400 font-medium">{description.length}/1000</span>
                                </div>
                            </div>

                            {/* Collection Info */}
                            {collection && (
                                <div className="flex flex-col gap-1">
                                    <label className="block text-sm font-semibold text-gray-900">Collection</label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900">{collection.name}</p>
                                            <p className="text-xs text-gray-500">{collection.symbol}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Create Button */}
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
                                    Create NFT
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='h-fit'>
                    <div className='w-[340px] rounded-3xl p-6 bg-white border-4 border-gray-200 flex flex-col gap-4 shadow-lg'>
                        <div className='w-full aspect-square bg-gray-100 rounded-xl overflow-hidden relative'>
                            {gatewayUrl ? (
                                isVideo ? (
                                    <video src={gatewayUrl} controls className="w-full h-full object-cover" />
                                ) : (
                                    <img src={gatewayUrl} alt="Preview" className="w-full h-full object-cover" />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"></div>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                                {address ? (
                                    <div className='flex items-center gap-2'>
                                        <div
                                            style={{
                                                backgroundImage: `url(${blo(address as `0x${string}`)})`,
                                            }}
                                            className='w-6 h-6 rounded-full bg-cover bg-center'
                                        ></div>
                                        <div className='text-sm font-bold text-gray-500'>
                                            {address.slice(0, 6)}...{address.slice(-4)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='text-sm font-bold text-gray-500'>Not connected</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
