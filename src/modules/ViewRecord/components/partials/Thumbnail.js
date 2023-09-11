import React, { Component } from 'react';
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

export class Thumbnail extends Component {
    static propTypes = {
        mediaUrl: PropTypes.string,
        webMediaUrl: PropTypes.string,
        previewMediaUrl: PropTypes.string,
        thumbnailMediaUrl: PropTypes.string,
        thumbnailFileName: PropTypes.string,
        securityStatus: PropTypes.bool,
        fileName: PropTypes.string,
        mimeType: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        checksums: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            thumbnailError: false,
        };
    }

    showPreview = (fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl, securityStatus, checksums = {}) => e => {
        e.preventDefault();
        this.props.onClick({ fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl, securityStatus, checksums });
    };

    render() {
        const txt = locale.pages.viewRecord;
        const {
            mediaUrl,
            thumbnailMediaUrl,
            thumbnailFileName,
            previewMediaUrl,
            webMediaUrl,
            fileName,
            mimeType,
            securityStatus,
            checksums,
        } = this.props;
        if (
            (fileName && mimeType.indexOf('pdf') >= 0) ||
            (mimeType.indexOf('octet-stream') >= 0 && mediaUrl.indexOf('flv') >= 0)
        ) {
            return (
                <ExternalLink href={mediaUrl} title={fileName} openInNewIcon={false} id="thumbnail">
                    <StyledThumbnailImage
                        crossorigin="anonymous"
                        src={thumbnailMediaUrl}
                        alt={thumbnailFileName}
                        loader={<CircularProgress size={15} thickness={1} />}
                        unloader={<BrokenImage color={'secondary'} />}
                    />
                </ExternalLink>
            );
        }
        return (
            <a
                onClick={this.showPreview(
                    fileName,
                    mediaUrl,
                    previewMediaUrl,
                    mimeType,
                    webMediaUrl,
                    securityStatus,
                    checksums,
                )}
                onKeyPress={this.showPreview(
                    fileName,
                    mediaUrl,
                    previewMediaUrl,
                    mimeType,
                    webMediaUrl,
                    securityStatus,
                    checksums,
                )}
                title={mediaUrl && txt.thumbnailTitle.replace('[image]', mediaUrl)}
                id={getTestId(fileName)}
                data-testid={getTestId(fileName)}
            >
                {this.props.securityStatus ? (
                    <StyledThumbnailImage
                        src={thumbnailMediaUrl}
                        alt={thumbnailFileName}
                        loader={<CircularProgress size={15} thickness={1} />}
                        unloader={<BrokenImage color={'secondary'} />}
                    />
                ) : (
                    <Lock color={'secondary'} sx={{ opacity: 0.5 }} />
                )}
            </a>
        );
    }
}

export default Thumbnail;
