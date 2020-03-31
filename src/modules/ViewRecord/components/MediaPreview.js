import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Alert from 'modules/SharedComponents/Toolbox/Alert/components/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import ReactJWPlayer from 'react-jw-player';

const MediaPreviewButtons = React.memo(({ ...props }) => {
    const { openOriginal, openWeb, close } = locale.viewRecord.sections.files.preview;
    const { mediaUrl, fileName, webMediaUrl, onClose, id } = props;

    const openFileInNewWindow = useCallback(() => {
        window.open(fileName);
    }, [fileName]);

    const openWebFileInNewWindow = useCallback(() => {
        window.open(webMediaUrl);
    }, [webMediaUrl]);

    return (
        <div style={{ padding: 8 }} id={id}>
            <Grid container spacing={2} justify="flex-end" direction="row">
                {mediaUrl && (
                    <Grid item xs={12} sm="auto">
                        <Button
                            id="open-original-file"
                            variant="contained"
                            onClick={openFileInNewWindow}
                            color="primary"
                            fullWidth
                        >
                            {openOriginal}
                        </Button>
                    </Grid>
                )}

                {webMediaUrl && (
                    <Grid item xs={12} sm="auto">
                        <Button
                            id="open-web-file"
                            variant="contained"
                            onClick={openWebFileInNewWindow}
                            color="primary"
                            fullWidth
                        >
                            {openWeb}
                        </Button>
                    </Grid>
                )}

                <Grid item xs={12} sm="auto">
                    <Button id="close-preview" variant="contained" onClick={onClose} fullWidth>
                        {close}
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
});

MediaPreviewButtons.propTypes = {
    mediaUrl: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    webMediaUrl: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    id: PropTypes.string,
};

export const MediaPreview = ({ ...props }) => {
    const { mediaUrl, previewMediaUrl, mimeType } = props;
    const mediaPreviewRef = React.createRef();

    const [videoErrorMsg, setVideoErrorMsg] = useState(null);
    const [videoErrorCode, setVideoErrorCode] = useState(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const [imageError, setImageError] = useState(null);

    const { videoTitle, imageTitle, videoLoadingMessage } = locale.viewRecord.sections.files.preview;
    const isVideo = mimeType.indexOf('video') >= 0;
    const isPreviewable = mimeType.indexOf('image') >= 0 || mimeType.indexOf('pdf') >= 0;
    const title = isVideo ? videoTitle : imageTitle;

    const scrollToPreview = useCallback(() => {
        const scrollToMedia = () => {
            if (((mediaPreviewRef || {}).current || {}).scrollIntoView) {
                mediaPreviewRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'center',
                });
            }
        };
        setTimeout(() => {
            scrollToMedia();
        }, 80);
    }, [mediaPreviewRef]);

    const videoLoaded = () => setVideoLoading(false);

    const videoFailed = event => {
        if (event.message && event.code) {
            setVideoErrorCode(event.code);
            setVideoErrorMsg(event.message);
        }
    };

    const imageFailed = () => setImageError(true);

    useEffect(() => {
        if (imageError || (videoErrorCode && videoErrorMsg) || !videoLoading) {
            scrollToPreview();
        }
    }, [imageError, scrollToPreview, videoErrorCode, videoErrorMsg, videoLoading]);

    return (
        <React.Fragment>
            <Grid container spacing={0} direction="row" style={{ marginTop: 32 }}>
                <span ref={mediaPreviewRef} />
                <Grid item xs>
                    <Typography id="medie-preview-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                </Grid>
                <Hidden xsDown>
                    <Grid item>
                        <MediaPreviewButtons {...{ id: 'media-preview-buttons-larger-screen', ...props }} />
                    </Grid>
                </Hidden>
            </Grid>
            {isVideo && videoErrorMsg && videoErrorCode && (
                <div style={{ marginTop: 12, marginBottom: 12 }}>
                    <Alert
                        {...locale.viewRecord.videoFailedAlert}
                        message={`${locale.viewRecord.videoFailedAlert.message} (${videoErrorMsg} - ${videoErrorCode})`}
                    />
                </div>
            )}
            {isPreviewable && imageError && (
                <div style={{ marginTop: 12, marginBottom: 12 }}>
                    <Alert
                        {...locale.viewRecord.imageFailedAlert}
                        message={locale.viewRecord.imageFailedAlert.message}
                    />
                </div>
            )}
            {isVideo && !videoErrorMsg && (
                <ReactJWPlayer
                    playerId="previewVideo"
                    playerScript="https://cdn.jwplayer.com/libraries/VrkpYhtx.js"
                    onVideoLoad={videoLoaded}
                    onSetupError={videoFailed}
                    onMediaError={videoFailed}
                    isAutoPlay
                    file={previewMediaUrl}
                    // TODO : Was put in for cloudfront not liking 'range' in request headers
                    // playlist={
                    //     [{
                    //         sources: [
                    //             {
                    //                 file: previewMediaUrl,
                    //                 onXhrOpen: (xhr, url) => {
                    //                     console.log(url);
                    //                     xhr.setRequestHeader('Range', '');
                    //                 },
                    //             },
                    //         ],
                    //     }]
                    // }
                />
            )}
            {isPreviewable && !imageError && (
                <Grid container spacing={4}>
                    <Grid item xs />
                    <Grid item xs="auto">
                        <img
                            id="image-preview"
                            src={previewMediaUrl}
                            alt={mediaUrl}
                            onLoad={scrollToPreview()}
                            style={{ border: '5px solid black', maxWidth: '100%', marginTop: 32, marginBottom: 32 }}
                            onError={imageFailed}
                        />
                    </Grid>
                    <Grid item xs />
                </Grid>
            )}
            {isVideo && !imageError && videoLoading && (
                <div style={{ marginTop: 12, marginBottom: 12 }}>
                    <InlineLoader message={videoLoadingMessage} />
                </div>
            )}
            <Hidden smUp>
                <MediaPreviewButtons {...{ id: 'media-preview-buttons-smaller-screen', ...props }} />
            </Hidden>
        </React.Fragment>
    );
};

MediaPreview.propTypes = {
    mediaUrl: PropTypes.string.isRequired,
    previewMediaUrl: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
};

export default React.memo(MediaPreview);
