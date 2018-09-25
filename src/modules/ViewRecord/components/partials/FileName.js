import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import AudioPlayer from './AudioPlayer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

export default class FileName extends PureComponent {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        mediaUrl: PropTypes.string.isRequired,
        previewMediaUrl: PropTypes.string.isRequired,
        onFileSelect: PropTypes.func.isRequired,
        allowDownload: PropTypes.bool
    };

    isAudio = (mimeType) => {
        return mimeType.indexOf('audio') >= 0;
    }

    isVideo = (mimeType) => {
        return mimeType.indexOf('video') >= 0;
    }

    isImage = (mimeType) => {
        return mimeType.indexOf('image') === 0;
    }

    canShowPreview = (mimeType) => {
        return this.isImage(mimeType);
        // TODO revert once videos are transcoded to open format #158519502
        // return (this.isImage(mimeType) || this.isVideo(mimeType));
    }

    showPreview = (mediaUrl, previewMediaUrl, mimeType) => (e) => {
        e.preventDefault();
        this.props.onFileSelect(mediaUrl, previewMediaUrl, mimeType);
    }

    render() {
        const {pid, fileName, allowDownload, mimeType, mediaUrl, previewMediaUrl} = this.props;

        return (
            <Grid container alignItems="center" wrap="nowrap">
                <Grid item>
                    {
                        allowDownload && !this.canShowPreview(mimeType) &&
                        <Typography variant="body2">
                            <ExternalLink href={mediaUrl} title={fileName} className={'fileName'} openInNewIcon>
                                {fileName}
                            </ExternalLink>
                        </Typography>
                    }
                    {
                        allowDownload && this.canShowPreview(mimeType) &&
                        <Typography variant="body2">
                            <a
                                onClick={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                                onKeyPress={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                                className={'fileName'}>
                                {fileName}
                            </a>
                        </Typography>
                    }
                    {
                        !allowDownload &&
                        <Typography variant="body2">{fileName}</Typography>
                    }
                </Grid>
                <Hidden xsDown>
                    <Grid item sm>
                        {
                            allowDownload && this.isAudio(this.props.mimeType) &&
                            <AudioPlayer pid={pid} fileName={fileName} mimeType={mimeType} />
                        }
                    </Grid>
                </Hidden>
            </Grid>
        );
    }
}
