import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import AudioPlayer from './AudioPlayer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { pathConfig } from 'config/pathConfig';

export const styles = theme => ({
    filename: {
        ...theme.typography.body2,
        cursor: 'pointer',
    },
});

export class FileName extends PureComponent {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        mediaUrl: PropTypes.string.isRequired,
        webMediaUrl: PropTypes.string,
        previewMediaUrl: PropTypes.string.isRequired,
        onFileSelect: PropTypes.func.isRequired,
        allowDownload: PropTypes.bool,
        securityStatus: PropTypes.bool,
        classes: PropTypes.object,
        checksums: PropTypes.object,
    };

    isAudio = mimeType => {
        return mimeType.indexOf('audio') >= 0;
    };

    isVideo = mimeType => {
        return mimeType.indexOf('video') >= 0 || mimeType === 'application/mxf';
    };

    isImage = mimeType => {
        return mimeType.indexOf('image') >= 0;
    };

    canShowPreview = mimeType => {
        return (this.isImage(mimeType) || this.isVideo(mimeType)) && !!this.props.previewMediaUrl;
    };

    showPreview = e => {
        e.preventDefault();
        const { checksums, fileName, mediaUrl, mimeType, previewMediaUrl, securityStatus, webMediaUrl } = this.props;
        this.props.onFileSelect({
            checksums,
            fileName,
            mediaUrl,
            mimeType,
            previewMediaUrl,
            securityStatus,
            webMediaUrl,
        });
    };

    render() {
        const { pid, fileName, allowDownload, mimeType, previewMediaUrl, checksums } = this.props;
        return (
            <Grid container alignItems="center" wrap="nowrap">
                <Grid item xs>
                    {allowDownload && !this.canShowPreview(mimeType) && (
                        <ExternalLink
                            href={pathConfig.file.url(pid, fileName, checksums && checksums.media)}
                            title={fileName}
                            className={this.props.classes.filename}
                            openInNewIcon
                        >
                            {fileName}
                        </ExternalLink>
                    )}
                    {allowDownload && this.canShowPreview(mimeType) && (
                        <Typography variant="body2">
                            <a
                                onClick={this.showPreview}
                                onKeyPress={this.showPreview}
                                className={this.props.classes.filename}
                            >
                                {fileName}
                            </a>
                        </Typography>
                    )}
                    {!allowDownload && <Typography variant="body2">{fileName}</Typography>}
                </Grid>
                <Hidden xsDown>
                    <Grid item sm>
                        {allowDownload && this.isAudio(this.props.mimeType) && (
                            <AudioPlayer
                                pid={pid}
                                fileName={
                                    previewMediaUrl ||
                                    pathConfig.file.url(pid, fileName, checksums && checksums.preview)
                                }
                                mimeType={mimeType}
                            />
                        )}
                    </Grid>
                </Hidden>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(FileName);
