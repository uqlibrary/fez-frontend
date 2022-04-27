export default {
    thumbnailImage: {
        defaultImageName: process.env.GALLERY_IMAGE_PATH_PREPEND
            ? `${process.env.GALLERY_IMAGE_PATH_PREPEND}uqlogo.svg`
            : 'assets/29fa0b621d784c4afef5b774a9a6adf5.svg', // TODO - fix this bodge this so it works across installs,
        defaultImageMimeType: 'image/svg+xml',
        defaultWidth: 150,
        defaultHeight: 150,
        defaultItemsPerRow: 5,
        defaultLazyLoading: true,
    },
    allowedTypes: ['Image', 'Digilib Image', 'Manuscript', 'Design', 'Video Document'],
};
