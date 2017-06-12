export function getByteConversion(bytes, decimals) {
    if(bytes === 0) return '0 Bytes';

    const kb = 1000;
    const dm = decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const result = Math.floor(Math.log(bytes) / Math.log(kb));

    return parseFloat((bytes / Math.pow(kb, result)).toFixed(dm)) + ' ' + sizes[result];
}

export function getIcon(mimeType) {
    switch(mimeType) {
        case 'application/pdf':
            return 'movie';
        case 'image/jpeg':
        case 'image/pjpeg':
        case 'image/x-png':
        case 'image/png':
        case 'image/gif':
            return 'photo';
        default:
            return 'insert_drive_file';
    }
}
