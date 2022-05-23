import { APP_URL, PATH_PREFIX } from 'config/general';

export default {
    thumbnailImage: {
        defaultImageName: process.env.GALLERY_IMAGE_PATH_PREPEND
            ? `${process.env.GALLERY_IMAGE_PATH_PREPEND}image_unavailable.svg`
            : `${APP_URL}${PATH_PREFIX}images/thumbs/image_unavailable.svg`,
        defaultImageMimeType: 'image/svg+xml',
        defaultWidth: 150,
        defaultHeight: 150,
        defaultItemsPerRow: 4,
        defaultLazyLoading: true,
    },
    allowedTypes: [
        { viewType: 'Image' },
        { viewType: 'Digilib Image' },
        { viewType: 'Manuscript' },
        { viewType: 'Design', subType: 'Non-NTRO' },
        { viewType: 'Video Document' },
    ],
};
