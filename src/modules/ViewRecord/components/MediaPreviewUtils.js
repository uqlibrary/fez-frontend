export const scrollToPreview = mediaPreviewRef => {
    const scrollToMedia = () => {
        mediaPreviewRef &&
            mediaPreviewRef.current &&
            mediaPreviewRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center',
            });
    };
    setTimeout(() => {
        scrollToMedia();
    }, 80);
};
