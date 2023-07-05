import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GetAppIcon from '@mui/icons-material/GetApp';
import { makeStyles } from '@mui/styles';

import AudioPlayer from './AudioPlayer';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { pathConfig } from 'config/pathConfig';
import componentsLocale from 'locale/components';

export const useStyles = makeStyles(
    theme => ({
        filenameParent: {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        },
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
        return previewMediaUrl && (isImage(mimeType) || isVideo(mimeType));
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

    const [isOpen, setOpenState] = React.useState(false);
    const showConfirmation = () => setOpenState(true);
    const hideConfirmation = () => setOpenState(false);

    const openDownloadUrl = () => {
        window.open(downloadUrl, '_blank');
    };

    const txt = componentsLocale.components.attachedFiles;

    return (
        <Grid container alignItems="center" wrap="nowrap" data-testid={id} id={id}>
            <Grid item xs sm={allowDownload && !downloadLicence && isAudio(mimeType) ? 10 : 12}>
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
                        className={`${classes.filename} ${classes.filenameParent}`}
                        openInNewIcon
                        id={`${id}-download`}
                    >
                        {fileName}
                    </ExternalLink>
                )}
                {allowDownload && !downloadLicence && canShowPreview(mimeType) && (
                    <Typography variant="body2" className={classes.filenameParent}>
                        <a
                            onClick={showPreview}
                            onKeyPress={showPreview}
                            className={classes.filename}
                            id={`${id}-preview`}
                            data-testid={`${id}-preview`}
                        >
                            {fileName}
                        </a>
                    </Typography>
                )}
                {(!allowDownload || !!downloadLicence) && (
                    <Grid container>
                        <Grid item xs className={classes.filename}>
                            <Typography variant="body2" className={`${classes.filename} ${classes.filenameParent}`}>
                                {fileName}
                            </Typography>
                        </Grid>
                        {!!downloadLicence && (
                            <Grid item xs="auto" className={classes.fileDownloadIcon}>
                                <IconButton
                                    aria-label={txt.downloadButtonLabel}
                                    onClick={showConfirmation}
                                    id={`${id}-download-button`}
                                    data-testid={`${id}-download-button`}
                                    size="large"
                                >
                                    <GetAppIcon />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>
            {allowDownload && !downloadLicence && isAudio(mimeType) && (
                <Grid item sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <AudioPlayer
                        pid={pid}
                        fileName={previewMediaUrl || pathConfig.file.url(pid, fileName, checksums && checksums.preview)}
                        mimeType={mimeType}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export const FileNameProps = {
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

FileName.propTypes = { ...FileNameProps };

export default FileName;
