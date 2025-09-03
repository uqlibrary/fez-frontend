import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from 'modules/SharedComponents/Toolbox/Alert/components/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import ReactPlayer from 'react-player';
import * as MediaPreviewUtils from './MediaPreviewUtils';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
        <Box
            sx={theme => ({ padding: { xs: `${theme.spacing(1)} 0`, sm: theme.spacing(1) } })}
            id={id}
            data-testid={id}
        >
            <Grid container spacing={2} padding={0} justifyContent="flex-end" direction="row">
                {mediaUrl && (
                    <Grid xs={12} sm="auto">
                        <Button
                            id="open-original-file"
                            data-analyticsid="open-original-file"
                            data-testid="open-original-file"
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
                    <Grid xs={12} sm="auto">
                        <Button
                            id="open-web-file"
                            data-analyticsid="open-web-file"
                            data-testid="open-web-file"
                            variant="contained"
                            onClick={openWebFileInNewWindow}
                            color="primary"
                            fullWidth
                        >
                            {openWeb}
                        </Button>
                    </Grid>
                )}

                <Grid xs={12} sm="auto">
                    <Button id="close-preview" variant="contained" onClick={onClose} fullWidth>
                        {close}
                    </Button>
                </Grid>
            </Grid>
        </Box>
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
    const {
        mediaUrl,
        previewMediaUrl,
        mimeType,
        videoErrorMsg,
        videoErrorCode,
        videoLoading,
        imageError,
        onVideoLoad,
        onVideoFailed,
        onImageFailed,
    } = props;
    const mediaPreviewRef = React.useRef();

    const { videoTitle, imageTitle, videoLoadingMessage } = locale.viewRecord.sections.files.preview;
    const isVideo = mimeType.indexOf('video') >= 0 || mimeType === 'application/mxf';
    const isPreviewable = mimeType.indexOf('image') >= 0 || mimeType.indexOf('pdf') >= 0;
    const title = isVideo ? videoTitle : imageTitle;
    const theme = useTheme();
    const desktopVisible = useMediaQuery(theme.breakpoints.up('sm'));
    const mobileVisible = useMediaQuery(theme.breakpoints.down('sm'));

    React.useEffect(() => {
        if (imageError || (videoErrorCode && videoErrorMsg) || !videoLoading) {
            MediaPreviewUtils.scrollToPreview(mediaPreviewRef);
        }
    }, [imageError, videoErrorCode, videoErrorMsg, videoLoading]);

    return (
        <React.Fragment>
            <Grid container spacing={0} direction="row" style={{ marginTop: 32 }}>
                <span ref={mediaPreviewRef} />
                <Grid xs>
                    <Typography id="medie-preview-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                </Grid>
                {desktopVisible && (
                    <Grid>
                        <MediaPreviewButtons {...{ id: 'media-preview-buttons-larger-screen', ...props }} />
                    </Grid>
                )}
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
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                    <ReactPlayer
                        id="previewVideo"
                        style={{ backgroundColor: 'black', position: 'absolute', top: 0, left: 0 }}
                        onReady={onVideoLoad}
                        width={'100%'}
                        height={'100%'}
                        controls
                        onError={onVideoFailed}
                        url={previewMediaUrl}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: 'nodownload',
                                },
                            },
                        }}
                    />
                </div>
            )}
            {isPreviewable && !imageError && (
                <Grid container spacing={4}>
                    <Grid xs />
                    <Grid xs="auto">
                        <img
                            id="image-preview"
                            data-analyticsid="image-preview"
                            data-testid="image-preview"
                            src={previewMediaUrl}
                            alt={mediaUrl}
                            onLoad={MediaPreviewUtils.scrollToPreview(mediaPreviewRef)}
                            style={{ border: '5px solid black', maxWidth: '100%', marginTop: 32, marginBottom: 32 }}
                            onError={onImageFailed}
                        />
                    </Grid>
                    <Grid xs />
                </Grid>
            )}
            {isVideo && !imageError && videoLoading && (
                <div style={{ marginTop: 12, marginBottom: 12 }}>
                    <InlineLoader message={videoLoadingMessage} />
                </div>
            )}
            {mobileVisible && <MediaPreviewButtons {...{ id: 'media-preview-buttons-smaller-screen', ...props }} />}
        </React.Fragment>
    );
};

MediaPreview.propTypes = {
    mediaUrl: PropTypes.string.isRequired,
    previewMediaUrl: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    videoErrorMsg: PropTypes.string,
    videoErrorCode: PropTypes.number,
    videoLoading: PropTypes.bool,
    imageError: PropTypes.bool,
    onVideoFailed: PropTypes.func,
    onVideoLoad: PropTypes.func,
    onImageFailed: PropTypes.func,
};

export default React.memo(MediaPreview);
