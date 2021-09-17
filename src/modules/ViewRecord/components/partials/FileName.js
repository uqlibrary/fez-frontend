import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles } from '@material-ui/styles';

import AudioPlayer from './AudioPlayer';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { pathConfig } from 'config/pathConfig';
import componentsLocale from 'locale/components';
// import { useConfirmationState } from 'hooks';

export const useStyles = makeStyles(
    theme => ({
        filename: {
            ...theme.typography.body2,
            cursor: 'pointer',
            placeSelf: 'center',
        },
        fileDownloadIcon: {
            textAlign: 'right',
        },
    }),
    { withTheme: true },
);

const FileName = ({
    downloadLicence,
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

    const downloadUrl = pathConfig.file.url(pid, fileName, checksums && checksums.media);

    // const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [isOpen, setOpenState] = React.useState(false);
    const showConfirmation = () => setOpenState(true);
    const hideConfirmation = () => setOpenState(false);

    const openDownloadUrl = () => {
        window.open(downloadUrl, '_blank');
    };

    const txt = componentsLocale.components.attachedFiles;

    return (
        <Grid container alignItems="center" wrap="nowrap" data-testid={id} id={id}>
            <Grid item xs>
                <ConfirmationBox
                    confirmationBoxId="file-download-accept-licence"
                    isOpen={isOpen}
                    onAction={openDownloadUrl}
                    onClose={hideConfirmation}
                    locale={txt.licenceConfirmation(downloadLicence)}
                />
                {allowDownload && !downloadLicence && !canShowPreview(mimeType) && (
                    <ExternalLink
                        href={downloadUrl}
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
                {(!allowDownload || (!!downloadLicence && !canShowPreview(mimeType))) && (
                    <Grid container>
                        <Grid item xs className={classes.filename}>
                            <Typography variant="body2">{fileName}</Typography>
                        </Grid>
                        {!!downloadLicence && (
                            <Grid item xs="auto" className={classes.fileDownloadIcon}>
                                <IconButton
                                    aria-label={txt.downloadButtonLabel}
                                    onClick={showConfirmation}
                                    id={`${id}-download-button`}
                                    data-testid={`${id}-download-button`}
                                >
                                    <GetAppIcon />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>
            <Hidden xsDown>
                {allowDownload && isAudio(mimeType) && (
                    <Grid item sm>
                        <AudioPlayer
                            pid={pid}
                            fileName={
                                previewMediaUrl || pathConfig.file.url(pid, fileName, checksums && checksums.preview)
                            }
                            mimeType={mimeType}
                        />
                    </Grid>
                )}
            </Hidden>
        </Grid>
    );
};

FileName.propTypes = {
    downloadLicence: PropTypes.object,
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
