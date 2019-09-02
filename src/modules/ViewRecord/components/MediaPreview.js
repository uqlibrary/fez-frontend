import React from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Alert from 'modules/SharedComponents/Toolbox/Alert/components/Alert';
import ReactJWPlayer from 'react-jw-player';

export default class MediaPreview extends React.Component {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        webMediaUrl: PropTypes.string,
        previewMediaUrl: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.mediaPreviewRef = React.createRef();
        this.state = {
            videoErrorMsg: null,
            videoErrorCode: null,
            imageError: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.previewMediaUrl !== nextProps.previewMediaUrl) {
            this.setState({
                videoErrorMsg: null,
                videoErrorCode: null,
                imageError: null,
            });
        }
    }

    openFileInNewWindow = () => {
        window.open(this.props.fileName);
    };

    openWebFileInNewWindow = () => {
        window.open(this.props.webMediaUrl);
    };

    scrollToPreview = () => {
        setTimeout(() => {
            this.scrollToMedia();
        }, 80);
    };

    scrollToMedia() {
        if (((this.mediaPreviewRef || {}).current || {}).scrollIntoView) {
            this.mediaPreviewRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center',
            });
        }
    }

    videoLoaded = () => {
        this.scrollToPreview();
    };

    videoFailed = event => {
        if (event.message && event.code) {
            this.setState(
                {
                    videoErrorMsg: event.message,
                    videoErrorCode: event.code,
                },
                () => {
                    this.scrollToPreview();
                },
            );
        }
    };

    imageFailed = () => {
        this.setState(
            {
                imageError: true,
            },
            () => {
                this.scrollToPreview();
            },
        );
        return null;
    };

    MediaPreviewButtons = ({ openOriginal, openWeb, close }) => {
        return (
            <div style={{ padding: 8 }}>
                <Grid container spacing={16} justify="flex-end" direction="row">
                    {this.props.mediaUrl && (
                        <Grid item xs={12} sm="auto">
                            <Button variant="contained" onClick={this.openFileInNewWindow} color="primary" fullWidth>
                                {openOriginal}
                            </Button>
                        </Grid>
                    )}

                    {this.props.webMediaUrl && (
                        <Grid item xs={12} sm="auto">
                            <Button variant="contained" onClick={this.openWebFileInNewWindow} color="primary" fullWidth>
                                {openWeb}
                            </Button>
                        </Grid>
                    )}

                    <Grid item xs={12} sm="auto">
                        <Button variant="contained" onClick={this.props.onClose} fullWidth>
                            {close}
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    };

    render() {
        const { mediaUrl, previewMediaUrl, mimeType } = this.props;
        const { videoTitle, imageTitle } = locale.viewRecord.sections.files.preview;
        const isVideo = mimeType.indexOf('video') >= 0;
        const isPreviewable = mimeType.indexOf('image') >= 0 || mimeType.indexOf('pdf') >= 0;
        const title = isVideo ? videoTitle : imageTitle;
        return (
            <React.Fragment>
                <Grid container spacing={0} direction={'row'} style={{ marginTop: 32 }}>
                    <span ref={this.mediaPreviewRef} />
                    <Grid item xs>
                        <Typography variant={'h6'} component={'h2'}>
                            {title}
                        </Typography>
                    </Grid>
                    <Hidden xsDown>
                        <Grid item>
                            <this.MediaPreviewButtons {...locale.viewRecord.sections.files.preview} />
                        </Grid>
                    </Hidden>
                </Grid>
                {isVideo && this.state.videoErrorMsg && this.state.videoErrorCode && (
                    <div style={{ marginTop: 12, marginBottom: 12 }}>
                        <Alert
                            {...locale.viewRecord.videoFailedAlert}
                            message={`${locale.viewRecord.videoFailedAlert.message} (${this.state.videoErrorMsg} - ${this.state.videoErrorCode})`}
                        />
                    </div>
                )}
                {isPreviewable && this.state.imageError && (
                    <div style={{ marginTop: 12, marginBottom: 12 }}>
                        <Alert
                            {...locale.viewRecord.imageFailedAlert}
                            message={locale.viewRecord.imageFailedAlert.message}
                        />
                    </div>
                )}
                {isVideo && !this.state.videoErrorMsg && (
                    <ReactJWPlayer
                        playerId="previewVideo"
                        playerScript="https://cdn.jwplayer.com/libraries/VrkpYhtx.js"
                        onVideoLoad={this.videoLoaded}
                        onSetupError={this.videoFailed}
                        onMediaError={this.videoFailed}
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
                {isPreviewable && !this.state.imageError && (
                    <Grid container spacing={32}>
                        <Grid item xs />
                        <Grid item xs={'auto'}>
                            <img
                                src={previewMediaUrl}
                                alt={mediaUrl}
                                onLoad={this.scrollToPreview()}
                                style={{ border: '5px solid black', maxWidth: '100%', marginTop: 32, marginBottom: 32 }}
                                onError={this.imageFailed}
                            />
                        </Grid>
                        <Grid item xs />
                    </Grid>
                )}
                <Hidden smUp>
                    <this.MediaPreviewButtons {...locale.viewRecord.sections.files.preview} />
                </Hidden>
            </React.Fragment>
        );
    }
}
