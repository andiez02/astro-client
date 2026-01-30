'use client'

import Header from "@/src/components/layout/Header";
import { HEADER_HEIGHT } from "@/src/common/utils/constants";
import uploadImage from "@/src/common/assets/images/upload-image.png"
import Image from "next/image";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Button } from "@/src/components/ui/Button";
import { api } from "@/src/services/apiService";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMint } from "@/src/components/providers/MintProvider";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile) {
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        }
    };

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const router = useRouter();
    const searchParams = useSearchParams();
    const address = searchParams.get('contractAddress') || 'new'; // Default to 'new' if not present
    const { setUploadData } = useMint();

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        try {
            const response = await api.upload.uploadFile(file, (percent) => setProgress(percent));
            toast.success('Upload successful!');

            // "data": { "ipfsUrl": "...", "gatewayUrl": "..." }
            // API returns { success: true, data: { ... } }
            // So we need response.data.data
            console.log("Upload Response Data:", response.data);
            const { ipfsUrl, gatewayUrl } = response.data.data;

            if (!ipfsUrl || !gatewayUrl) {
                toast.error("Upload failed: Invalid server response");
                console.error("Missing ipfsUrl or gatewayUrl", response.data);
                return;
            }

            // Save to context
            setUploadData({
                ipfsUrl,
                gatewayUrl,
                fileType: file.type,
                contractAddress: address // This comes from query param
            });

            // Redirect to mint page with address query param
            router.push(`/create/mint?contractAddress=${address}`);

            // Don't clearFile() here to avoid UI flicker before redirect
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Upload failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };


    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
                <div
                    className={`w-full h-[88vh] bg-white mx-20 my-2 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-200 ${isDragging ? 'border-2 border-dashed border-blue-500 bg-blue-50' : ''
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        className="hidden"
                        accept=".jpg,.png,.gif,.svg,.gltf,.glb,.mov,.mp4"
                    />

                    {!file ? (
                        <div
                            className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                            onClick={triggerFileInput}
                        >
                            <Image src={uploadImage} alt="upload" width={500} height={600} className="object-contain max-h-[50vh]" />
                            <h1 className='text-2xl font-bold mb-2'>Upload a media file</h1>
                            <p className='text-gray-500 font-medium w-1/5 text-center'>
                                Drag and drop, or click to upload a JPG, PNG, GIF, SVG, GLTF, GLB, MOV, or MP4 file
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full p-10 relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-8">
                                {file.type.startsWith('image/') ? (
                                    <img src={previewUrl || ''} alt="Preview" className="max-w-full max-h-full object-contain" />
                                ) : file.type.startsWith('video/') ? (
                                    <video src={previewUrl || ''} controls className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <p className="font-semibold text-lg">{file.name}</p>
                                        <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={clearFile} variant="secondary">
                                    Change File
                                </Button>
                                <Button onClick={handleUpload} isLoading={isLoading}>
                                    Upload File
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}