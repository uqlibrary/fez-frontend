import { PATH_PREFIX } from 'config/general';

const placeholderImage = require('../../public/images/thumbs/image_unavailable.svg');
console.log('>>>>', process.env, process.env.NODE_ENV, process.env.USE_MOCK, PATH_PREFIX);

export default {
    thumbnailImage: {
        defaultImageName: `${process.env.NODE_ENV === 'development' ? '' : '/'}${placeholderImage}`,
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
