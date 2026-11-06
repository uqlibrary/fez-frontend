import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import ExternalLink from 'modules/SharedComponents/ExternalLink/components/ExternalLink';
import BrokenImage from '@mui/icons-material/BrokenImage';
import Lock from '@mui/icons-material/Lock';
import locale from 'locale/pages';
import { Img } from 'react-image';
import CircularProgress from '@mui/material/CircularProgress';

export const getTestId = filename => `preview-link-${filename}`;

const StyledThumbnailImage = styled(Img)(() => ({
    width: '100%',
    '&:hover': {
        cursor: 'pointer',
    },
}));

const Thumbnail = ({
    mediaUrl,
    webMediaUrl,
    previewMediaUrl,
    thumbnailMediaUrl,
    securityStatus,
    fileName,
    mimeType,
    onClick,
    checksums,
}) => {
    const txt = locale.pages.viewRecord;
    const fileLabel = fileName || mediaUrl;

    if (
        (fileName && mimeType.indexOf('pdf') >= 0) ||
        (mimeType.indexOf('octet-stream') >= 0 && mediaUrl.indexOf('flv') >= 0)
    ) {
        return (
            <ExternalLink
                href={mediaUrl}
                title={fileName}
                aria-label={fileLabel && txt.thumbnailExternalLinkLabel.replace('[file]', fileLabel)}
                openInNewIcon={false}
                id="thumbnail"
            >
                <StyledThumbnailImage
                    crossorigin="anonymous"
                    src={thumbnailMediaUrl}
                    alt=""
                    loader={<CircularProgress size={15} thickness={1} />}
                    unloader={<BrokenImage color={'secondary'} data-testid={`${fileName}-error`} />}
                />
            </ExternalLink>
        );
    }
    const openPreview = () =>
        onClick({ fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl, securityStatus, checksums });

    return (
        <a
            role="button"
            tabIndex={0}
            onClick={e => {
                e.preventDefault?.();
                openPreview();
            }}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPreview();
                }
            }}
            title={fileLabel && txt.thumbnailTitle.replace('[image]', fileLabel)}
            aria-label={fileLabel && txt.thumbnailTitle.replace('[image]', fileLabel)}
            id={getTestId(fileName)}
            data-testid={getTestId(fileName)}
        >
            {securityStatus ? (
                <StyledThumbnailImage
                    src={thumbnailMediaUrl}
                    alt=""
                    loader={<CircularProgress size={15} thickness={1} />}
                    unloader={<BrokenImage color={'secondary'} />}
                />
            ) : (
                <Lock color={'secondary'} sx={{ opacity: 0.5 }} />
            )}
        </a>
    );
};
Thumbnail.propTypes = {
    mediaUrl: PropTypes.string,
    webMediaUrl: PropTypes.string,
    previewMediaUrl: PropTypes.string,
    thumbnailMediaUrl: PropTypes.string,
    securityStatus: PropTypes.bool,
    fileName: PropTypes.string,
    mimeType: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    checksums: PropTypes.object,
};

export default Thumbnail;
