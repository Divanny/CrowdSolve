import { ImageIcon, FileTextIcon, FileArchiveIcon as FileZipIcon, FileIcon } from 'lucide-react';

export const IconoArchivo = ({ tipo }) => {
    switch (tipo) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/webp':
        case 'image/svg+xml':
            return <ImageIcon />
        case 'application/pdf':
            return <FileTextIcon />
        case 'application/zip':
            return <FileZipIcon />
        default:
            return <FileIcon />
    }
}