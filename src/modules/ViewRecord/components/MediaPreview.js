import React, { useState, useCallback, useEffect, useMemo } from 'react';
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

    const openFileInNewWindow = useMemo(() => {
        window.open(fileName);
    }, [fileName]);

    const openWebFileInNewWindow = useMemo(() => {
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

// export default class OldMediaPreview extends React.Component {
//     static propTypes = {
//         mediaUrl: PropTypes.string.isRequired,
//         fileName: PropTypes.string.isRequired,
//         webMediaUrl: PropTypes.string,
//         previewMediaUrl: PropTypes.string.isRequired,
//         mimeType: PropTypes.string.isRequired,
//         onClose: PropTypes.func.isRequired,
//     };

//     constructor(props) {
//         super(props);
//         this.mediaPreviewRef = React.createRef();
//         this.state = {
//             videoErrorMsg: null,
//             videoErrorCode: null,
//             imageError: null,
//             videoLoading: true,
//         };
//     }

//     componentWillReceiveProps(nextProps) {
//         if (this.props.previewMediaUrl !== nextProps.previewMediaUrl) {
//             this.setState({
//                 videoErrorMsg: null,
//                 videoErrorCode: null,
//                 imageError: null,
//                 videoLoading: true,
//             });
//         }
//     }

//     openFileInNewWindow = () => {
//         window.open(this.props.fileName);
//     };

//     openWebFileInNewWindow = () => {
//         window.open(this.props.webMediaUrl);
//     };

//     scrollToPreview = () => {
//         setTimeout(() => {
//             this.scrollToMedia();
//         }, 80);
//     };

//     scrollToMedia() {
//         if (((this.mediaPreviewRef || {}).current || {}).scrollIntoView) {
//             this.mediaPreviewRef.current.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start',
//                 inline: 'center',
//             });
//         }
//     }

//     videoLoaded = () => {
//         this.setState({
//             videoLoading: false,
//         });
//         this.scrollToPreview();
//     };

//     videoFailed = event => {
//         if (event.message && event.code) {
//             this.setState(
//                 {
//                     videoErrorMsg: event.message,
//                     videoErrorCode: event.code,
//                     videoLoading: false,
//                 },
//                 () => {
//                     this.scrollToPreview();
//                 },
//             );
//         }
//     };

//     imageFailed = () => {
//         this.setState(
//             {
//                 imageError: true,
//             },
//             () => {
//                 this.scrollToPreview();
//             },
//         );
//         return null;
//     };

//     MediaPreviewButtons = ({ openOriginal, openWeb, close }) => {
//         return (
//             <div style={{ padding: 8 }}>
//                 <Grid container spacing={2} justify="flex-end" direction="row">
//                     {this.props.mediaUrl && (
//                         <Grid item xs={12} sm="auto">
//                             <Button variant="contained" onClick={this.openFileInNewWindow} color="primary" fullWidth>
//                                 {openOriginal}
//                             </Button>
//                         </Grid>
//                     )}

//                     {this.props.webMediaUrl && (
//                         <Grid item xs={12} sm="auto">
//                             <Button variant="contained"
//  onClick={this.openWebFileInNewWindow} color="primary" fullWidth>
//                                 {openWeb}
//                             </Button>
//                         </Grid>
//                     )}

//                     <Grid item xs={12} sm="auto">
//                         <Button variant="contained" onClick={this.props.onClose} fullWidth>
//                             {close}
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </div>
//         );
//     };

//     render() {
//         const { mediaUrl, previewMediaUrl, mimeType } = this.props;
//         const { videoTitle, imageTitle, videoLoadingMessage } = locale.viewRecord.sections.files.preview;
//         const isVideo = mimeType.indexOf('video') >= 0;
//         const isPreviewable = mimeType.indexOf('image') >= 0 || mimeType.indexOf('pdf') >= 0;
//         const title = isVideo ? videoTitle : imageTitle;
//         return (
//             <React.Fragment>
//                 <Grid container spacing={0} direction={'row'} style={{ marginTop: 32 }}>
//                     <span ref={this.mediaPreviewRef} />
//                     <Grid item xs>
//                         <Typography variant={'h6'} component={'h2'}>
//                             {title}
//                         </Typography>
//                     </Grid>
//                     <Hidden xsDown>
//                         <Grid item>
//                             <this.MediaPreviewButtons {...locale.viewRecord.sections.files.preview} />
//                         </Grid>
//                     </Hidden>
//                 </Grid>
//                 {isVideo && this.state.videoErrorMsg && this.state.videoErrorCode && (
//                     <div style={{ marginTop: 12, marginBottom: 12 }}>
//                         <Alert
//                             {...locale.viewRecord.videoFailedAlert}
//                             message={`${locale.viewRecord.videoFailedAlert.message}
// (${this.state.videoErrorMsg} - ${this.state.videoErrorCode})`}
//                         />
//                     </div>
//                 )}
//                 {isPreviewable && this.state.imageError && (
//                     <div style={{ marginTop: 12, marginBottom: 12 }}>
//                         <Alert
//                             {...locale.viewRecord.imageFailedAlert}
//                             message={locale.viewRecord.imageFailedAlert.message}
//                         />
//                     </div>
//                 )}
//                 {isVideo && !this.state.videoErrorMsg && (
//                     <ReactJWPlayer
//                         playerId="previewVideo"
//                         playerScript="https://cdn.jwplayer.com/libraries/VrkpYhtx.js"
//                         onVideoLoad={this.videoLoaded}
//                         onSetupError={this.videoFailed}
//                         onMediaError={this.videoFailed}
//                         isAutoPlay
//                         file={previewMediaUrl}
//                         // TODO : Was put in for cloudfront not liking 'range' in request headers
//                         // playlist={
//                         //     [{
//                         //         sources: [
//                         //             {
//                         //                 file: previewMediaUrl,
//                         //                 onXhrOpen: (xhr, url) => {
//                         //                     console.log(url);
//                         //                     xhr.setRequestHeader('Range', '');
//                         //                 },
//                         //             },
//                         //         ],
//                         //     }]
//                         // }
//                     />
//                 )}
//                 {isPreviewable && !this.state.imageError && (
//                     <Grid container spacing={4}>
//                         <Grid item xs />
//                         <Grid item xs={'auto'}>
//                             <img
//                                 src={previewMediaUrl}
//                                 alt={mediaUrl}
//                                 onLoad={this.scrollToPreview()}
//                                 style={{ border: '5px solid black',
// maxWidth: '100%', marginTop: 32, marginBottom: 32 }}
//                                 onError={this.imageFailed}
//                             />
//                         </Grid>
//                         <Grid item xs />
//                     </Grid>
//                 )}
//                 {isVideo && !this.state.imageError && this.state.videoLoading && (
//                     <div style={{ marginTop: 12, marginBottom: 12 }}>
//                         <InlineLoader message={videoLoadingMessage} />
//                     </div>
//                 )}
//                 <Hidden smUp>
//                     <this.MediaPreviewButtons {...locale.viewRecord.sections.files.preview} />
//                 </Hidden>
//             </React.Fragment>
//         );
//     }
// }
