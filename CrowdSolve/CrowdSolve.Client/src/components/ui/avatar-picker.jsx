'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'
import { useState } from 'react'

export default function AvatarPicker({ onAvatarChange }) {
    const [preview, setPreview] = useState(null)

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            onAvatarChange(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target?.result)
            }
            reader.readAsDataURL(file)
        }
    }, [onAvatarChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        multiple: false
    })

    return (
        <div {...getRootProps()} className="relative w-24 h-24 mx-auto">
            <input {...getInputProps()} aria-label="Seleccionar imagen de avatar" />
            <Avatar className="w-24 h-24 border-2 border-gray-200">
                {preview ? (
                    <AvatarImage src={preview} alt="Avatar seleccionado" />
                ) : (
                    <AvatarFallback>
                        <span className="text-xs text-center">Seleccionar avatar</span>
                    </AvatarFallback>
                )}
            </Avatar>
            <div
                className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300 ${isDragActive ? 'bg-primary/20' : 'bg-black/40 opacity-0 hover:opacity-100'
                    }`}
                aria-hidden="true"
            >
                <Camera className="w-8 h-8 text-white" />
            </div>
        </div>
    )
}