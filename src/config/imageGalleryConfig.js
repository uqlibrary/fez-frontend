import PlaceholderImage from '../../public/images/thumbs/image_unavailable.svg';

export default {
    thumbnailImage: {
        defaultImageName: PlaceholderImage,
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
        { viewType: 'Design', subTypes: [null, 'Non-NTRO'] },
        { viewType: 'Video Document' },
    ],
};
