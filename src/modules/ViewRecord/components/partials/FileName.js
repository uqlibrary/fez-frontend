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
import Tooltip from '@mui/material/Tooltip';

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
        disabled: {
            cursor: 'not-allowed',
        },
        fileDownloadIcon: {
            textAlign: 'right',
        },
    }),
    { withTheme: true },
);

export const getDownloadLinkTestId = id => `${id}-download`;
export const getPreviewLinkTestId = id => `${id}-preview`;

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
    tooltip,
    disabled,
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
            <Grid item xs sm={allowDownload && !downloadLicence && isAudio(mimeType) ? 8 : 12}>
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
                        data-testid={getDownloadLinkTestId(id)}
                        id={getDownloadLinkTestId(id)}
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
                            data-testid={getPreviewLinkTestId(id)}
                            id={getPreviewLinkTestId(id)}
                        >
                            {fileName}
                        </a>
                    </Typography>
                )}
                {(!allowDownload || !!downloadLicence) && (
                    <Grid container>
                        <Grid item xs className={classes.filename}>
                            <Tooltip
                                title={!!tooltip ? tooltip : ''}
                                id={`${id}-tooltip`}
                                data-testid={`${id}-tooltip`}
                            >
                                <Typography
                                    variant="body2"
                                    className={`${classes.filename} ${disabled ? classes.disabled : ''} ${
                                        classes.filenameParent
                                    }`}
                                >
                                    {fileName}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        {!disabled && !!downloadLicence && (
                            <Grid item xs="auto" className={classes.fileDownloadIcon}>
                                <IconButton
                                    aria-label={txt.downloadButtonLabel}
                                    onClick={showConfirmation}
                                    id={`${id}-download-button`}
                                    data-analyticsid={`${id}-download-button`}
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
                <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
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
    previewMediaUrl: PropTypes.string,
    onFileSelect: PropTypes.func.isRequired,
    allowDownload: PropTypes.bool,
    securityStatus: PropTypes.bool,
    checksums: PropTypes.object,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool,
};

FileName.propTypes = { ...FileNameProps };

export default FileName;
