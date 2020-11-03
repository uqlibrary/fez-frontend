import React from 'react';
import PropTypes from 'prop-types';

import VolumeUp from '@material-ui/icons/VolumeUp';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import Image from '@material-ui/icons/Image';
import Videocam from '@material-ui/icons/Videocam';
import Thumbnail from 'modules/ViewRecord/components/partials/Thumbnail';

import { getUrl, useStyles } from './AttachedFiles';

export const FileIcon = ({
    pid,
    mimeType,
    fileName,
    thumbnailFileName,
    previewFileName,
    allowDownload,
    webFileName,
    securityStatus,
    showPreview,
}) => {
    const classes = useStyles();
    if (allowDownload && thumbnailFileName) {
        const thumbnailProps = {
            mimeType,
            mediaUrl: getUrl(pid, fileName || fileName),
            webMediaUrl: webFileName ? getUrl(pid, webFileName) : null,
            previewMediaUrl: getUrl(pid, previewFileName || fileName),
            thumbnailMediaUrl: getUrl(pid, thumbnailFileName),
            fileName: fileName,
            thumbnailFileName,
            onClick: showPreview,
            securityStatus: securityStatus,
        };
        return <Thumbnail {...thumbnailProps} />;
    } else if (mimeType.indexOf('audio') >= 0) {
        return <VolumeUp className={classes.fileIcon} color="secondary" />;
    } else if (mimeType.indexOf('pdf') >= 0) {
        return <PictureAsPdf className={classes.fileIcon} color="secondary" />;
    } else if (mimeType.indexOf('image') >= 0) {
        return <Image className={classes.fileIcon} color="secondary" />;
    } else if (mimeType.indexOf('video') >= 0 || mimeType === 'application/mxf') {
        return <Videocam className={classes.fileIcon} color="secondary" />;
    } else {
        return <InsertDriveFile className={classes.fileIcon} color="secondary" />;
    }
};

FileIcon.propTypes = {
    pid: PropTypes.string,
    mimeType: PropTypes.string,
    fileName: PropTypes.string,
    thumbnailFileName: PropTypes.string,
    previewFileName: PropTypes.string,
    allowDownload: PropTypes.bool,
    webFileName: PropTypes.string,
    securityStatus: PropTypes.string,
    showPreview: PropTypes.func,
};

export default FileIcon;
