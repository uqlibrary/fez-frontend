import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import AudioPlayer from './AudioPlayer';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';

import { pathConfig } from 'config/pathConfig';

export const useStyles = makeStyles(
    theme => ({
        filename: {
            ...theme.typography.body2,
            cursor: 'pointer',
        },
    }),
    { withTheme: true },
);

const FileName = ({
    allowDownload,
    checksums,
    fileName,
    id,
    mediaUrl,
    mimeType,
    onFileSelect,
    pid,
    previewMediaUrl,
    securityStatus,
    webMediaUrl,
}) => {
    const classes = useStyles();

    const isAudio = mimeType => {
        return mimeType.indexOf('audio') >= 0;
    };

    const isVideo = mimeType => {
        return mimeType.indexOf('video') >= 0 || mimeType === 'application/mxf';
    };

    const isImage = mimeType => {
        return mimeType.indexOf('image') >= 0;
    };

    const canShowPreview = mimeType => {
        return (isImage(mimeType) || isVideo(mimeType)) && previewMediaUrl;
    };

    const showPreview = e => {
        e.preventDefault();
        onFileSelect({
            checksums,
            fileName,
            mediaUrl,
            mimeType,
            previewMediaUrl,
            securityStatus,
            webMediaUrl,
        });
    };

    return (
        <Grid container alignItems="center" wrap="nowrap" data-testid={id} id={id}>
            <Grid item xs>
                {allowDownload && !canShowPreview(mimeType) && (
                    <ExternalLink
                        href={pathConfig.file.url(pid, fileName, checksums && checksums.media)}
                        title={fileName}
                        className={classes.filename}
                        openInNewIcon
                        id={`${id}-download`}
                    >
                        {fileName}
                    </ExternalLink>
                )}
                {allowDownload && canShowPreview(mimeType) && (
                    <Typography variant="body2" id={`${id}-preview`}>
                        <a onClick={showPreview} onKeyPress={showPreview} className={classes.filename}>
                            {fileName}
                        </a>
                    </Typography>
                )}
                {!allowDownload && <Typography variant="body2">{fileName}</Typography>}
            </Grid>
            <Hidden xsDown>
                <Grid item sm>
                    {allowDownload && isAudio(mimeType) && (
                        <AudioPlayer
                            pid={pid}
                            fileName={
                                previewMediaUrl || pathConfig.file.url(pid, fileName, checksums && checksums.preview)
                            }
                            mimeType={mimeType}
                        />
                    )}
                </Grid>
            </Hidden>
        </Grid>
    );
};

FileName.propTypes = {
    id: PropTypes.string,
    pid: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    mimeType: PropTypes.string.isRequired,
    mediaUrl: PropTypes.string.isRequired,
    webMediaUrl: PropTypes.string,
    previewMediaUrl: PropTypes.string.isRequired,
    onFileSelect: PropTypes.func.isRequired,
    allowDownload: PropTypes.bool,
    securityStatus: PropTypes.bool,
    checksums: PropTypes.object,
};

export default FileName;
