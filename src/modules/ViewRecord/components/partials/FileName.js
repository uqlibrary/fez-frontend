import React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GetAppIcon from '@mui/icons-material/GetApp';

import AudioPlayer from './AudioPlayer';
import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { pathConfig } from 'config/pathConfig';
import componentsLocale from 'locale/components';
import Tooltip from '@mui/material/Tooltip';

const classes = {
    filenameParent: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
};
const StyledWithBody2 = styled('div')(({ theme }) => ({
    ...theme.typography.body2,
    cursor: 'pointer',
    placeSelf: 'center',
}));

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
    const theme = useTheme();
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
                        sx={{
                            ...theme.typography.body2,
                            cursor: 'pointer',
                            placeSelf: 'center',
                            ...classes.filenameParent,
                        }}
                        openInNewIcon
                        data-testid={getDownloadLinkTestId(id)}
                        id={getDownloadLinkTestId(id)}
                    >
                        {fileName}
                    </ExternalLink>
                )}
                {allowDownload && !downloadLicence && canShowPreview(mimeType) && (
                    <Typography variant="body2" sx={{ ...classes.filenameParent }}>
                        <StyledWithBody2
                            as={'a'}
                            onClick={showPreview}
                            onKeyPress={showPreview}
                            data-testid={getPreviewLinkTestId(id)}
                            id={getPreviewLinkTestId(id)}
                        >
                            {fileName}
                        </StyledWithBody2>
                    </Typography>
                )}
                {(!allowDownload || !!downloadLicence) && (
                    <Grid container>
                        <StyledWithBody2 as={Grid} item xs>
                            <Tooltip
                                title={!!tooltip ? tooltip : ''}
                                id={`${id}-tooltip`}
                                data-testid={`${id}-tooltip`}
                            >
                                <StyledWithBody2
                                    as={'p'}
                                    sx={{ ...(disabled ? { cursor: 'not-allowed' } : {}), ...classes.filenameParent }}
                                    className={disabled && 'disabled'}
                                >
                                    {fileName}
                                </StyledWithBody2>
                            </Tooltip>
                        </StyledWithBody2>
                        {!disabled && !!downloadLicence && (
                            <Grid item xs="auto" sx={{ textAlign: 'right' }}>
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
