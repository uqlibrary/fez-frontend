import React, { useState } from 'react';
import PropTypes from 'prop-types';
import viewRecordLocale from 'locale/viewRecord';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { makeStyles } from '@material-ui/styles';
import { useRecordContext } from 'context';
import { useIsAdmin } from 'hooks';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';

import moment from 'moment';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import Image from '@material-ui/icons/Image';
import Videocam from '@material-ui/icons/Videocam';
import { openAccessConfig, viewRecordsConfig, routes } from 'config';
import { isFileValid } from 'config/validation';
import MediaPreview from 'modules/ViewRecord/components/MediaPreview';
import FileName from 'modules/ViewRecord/components/partials/FileName';
import Thumbnail from 'modules/ViewRecord/components/partials/Thumbnail';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';

const useStyles = makeStyles(
    theme => ({
        header: {
            borderBottom: `1px solid ${theme.palette.secondary.light}`,
        },
        dataWrapper: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        fileIcon: {
            opacity: 0.5,
        },
    }),
    { withTheme: true },
);

const initialPreviewState = {
    mediaUrl: null,
    previewMediaUrl: null,
    mimeType: null,
};

export const usePreview = initialPreviewState => {
    const [preview, setPreview] = useState(initialPreviewState);

    const showPreview = (mediaUrl, previewMediaUrl, mimeType) => {
        setPreview({
            mediaUrl: mediaUrl,
            previewMediaUrl: previewMediaUrl,
            mimeType: mimeType,
        });
    };

    const hidePreview = () => {
        setPreview({
            mediaUrl: null,
            previewMediaUrl: null,
            mimeType: null,
        });
    };

    return [preview, showPreview, hidePreview];
};

const getUrl = (pid, fileName) => fileName && routes.pathConfig.file.url(pid, fileName);

const searchByKey = (list, key, value) => {
    return list && list.filter(item => item[key] === value)[0];
};

const formatBytes = bytes => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const decimals = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, index)).toFixed(decimals)) + ' ' + sizes[index];
};

const getFileOpenAccessStatus = (publication, embargoDate) => {
    const openAccessStatusId =
        (!!publication.fez_record_search_key_oa_status && publication.fez_record_search_key_oa_status.rek_oa_status) ||
        null;
    if (openAccessConfig.openAccessFiles.indexOf(openAccessStatusId) < 0) {
        return { isOpenAccess: false, embargoDate: null, openAccessStatusId: openAccessStatusId };
    } else if (embargoDate && moment(embargoDate).isAfter(moment(), 'day')) {
        return {
            isOpenAccess: false,
            embargoDate: moment(embargoDate).format('Do MMMM YYYY'),
            openAccessStatusId: openAccessStatusId,
        };
    }
    return { isOpenAccess: true, embargoDate: null, openAccessStatusId: openAccessStatusId };
};

const FileIcon = ({
    pid,
    mimeType,
    fileName,
    thumbnailFileName,
    previewFileName,
    allowDownload,
    downloadableFileName,
    showPreview,
}) => {
    const classes = useStyles();
    if (allowDownload && thumbnailFileName) {
        const thumbnailProps = {
            mimeType,
            mediaUrl: getUrl(pid, downloadableFileName || fileName),
            previewMediaUrl: getUrl(pid, previewFileName || fileName),
            thumbnailMediaUrl: getUrl(pid, thumbnailFileName),
            fileName: downloadableFileName || fileName,
            thumbnailFileName,
            onClick: showPreview,
        };
        return <Thumbnail {...thumbnailProps} />;
    } else if (mimeType.indexOf('audio') >= 0) {
        return <VolumeUp className={classes.fileIcon} color="secondary" />;
    } else if (mimeType.indexOf('pdf') >= 0) {
        return <PictureAsPdf className={classes.fileIcon} color="secondary" />;
    } else if (mimeType.indexOf('image') >= 0) {
        return <Image className={classes.fileIcon} color="secondary" />;
    } else if (mimeType.indexOf('video') >= 0) {
        return <Videocam className={classes.fileIcon} color="secondary" />;
    } else {
        return <InsertDriveFile className={classes.fileIcon} color="secondary" />;
    }
};

const getFileData = (publication, dataStreams, isAdmin) => {
    const { files } = viewRecordsConfig;

    return !!dataStreams && dataStreams.length > 0
        ? dataStreams.filter(isFileValid(viewRecordsConfig, isAdmin)).map(dataStream => {
            const pid = dataStream.dsi_pid;
            const fileName = dataStream.dsi_dsid;
            const thumbnailDataStream = searchByKey(dataStreams, 'dsi_dsid', files.thumbnailFileName(fileName));
            const previewDataStream = searchByKey(dataStreams, 'dsi_dsid', files.previewFileName(fileName));
            const downloadableDataStream = searchByKey(dataStreams, 'dsi_dsid', files.webFileName(fileName));
            const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
            const thumbnailFileName = !!thumbnailDataStream && thumbnailDataStream.dsi_dsid;
            const previewFileName = !!previewDataStream && previewDataStream.dsi_dsid;
            const downloadableFileName = !!downloadableDataStream && downloadableDataStream.dsi_dsid;
            const openAccessStatus = getFileOpenAccessStatus(publication, dataStream.dsi_embargo_date);

            return {
                pid,
                fileName,
                description: dataStream.dsi_label,
                mimeType,
                thumbnailFileName,
                calculatedSize: formatBytes(dataStream.dsi_size),
                allowDownload: openAccessStatus.isOpenAccess || !openAccessStatus.embargoDate,
                iconProps: {
                    pid,
                    mimeType,
                    fileName,
                    thumbnailFileName,
                    previewFileName,
                    allowDownload: openAccessStatus.isOpenAccess,
                    downloadableFileName,
                },
                openAccessStatus,
                previewMediaUrl: getUrl(pid, previewFileName || fileName),
                mediaUrl: getUrl(pid, downloadableFileName || fileName),
            };
        })
        : [];
};

export const AttachedFiles = ({
    dataStreams,
    hideCulturalSensitivityStatement,
    setHideCulturalSensitivityStatement,
    disabled,
    deleteHint,
    onDelete,
    locale,
}) => {
    const classes = useStyles();
    const [preview, showPreview, hidePreview] = usePreview(initialPreviewState);
    const { record } = useRecordContext();
    const isAdmin = useIsAdmin();

    const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const fileData = getFileData(record, dataStreams, isAdmin);
    if (fileData.length === 0) return null;
    let hasVideo = false;
    fileData.map(item => {
        if (item.mimeType.indexOf('video') > -1) {
            hasVideo = true;
        }
    });
    const onFileDelete = index => () => onDelete(index);

    return (
        <Grid item xs={12}>
            <StandardCard title={locale.title}>
                {!!record.fez_record_search_key_advisory_statement && !hideCulturalSensitivityStatement && (
                    <Alert
                        allowDismiss
                        type={'info'}
                        message={
                            record.fez_record_search_key_advisory_statement.rek_advisory_statement ||
                            locale.culturalSensitivityStatement
                        }
                        dismissAction={setHideCulturalSensitivityStatement}
                    />
                )}
                {isFireFox && hasVideo && (
                    <Alert
                        allowDismiss
                        type={viewRecordLocale.viewRecord.fireFoxAlert.type}
                        title={viewRecordLocale.viewRecord.fireFoxAlert.title}
                        message={viewRecordLocale.viewRecord.fireFoxAlert.message}
                    />
                )}
                <div style={{ padding: 8 }}>
                    <Grid container direction="row" alignItems="center" spacing={16} className={classes.header}>
                        <Grid item xs={1}>
                            &nbsp;
                        </Grid>
                        <Grid item sm={4}>
                            <Typography variant="caption" gutterBottom>
                                {locale.fileName}
                            </Typography>
                        </Grid>
                        <Hidden xsDown>
                            <Grid item sm={4}>
                                <Typography variant="caption" gutterBottom>
                                    {locale.description}
                                </Typography>
                            </Grid>
                        </Hidden>
                        <Hidden smDown>
                            <Grid item md={2}>
                                <Typography variant="caption" gutterBottom>
                                    {locale.size}
                                </Typography>
                            </Grid>
                        </Hidden>
                        <Hidden xsDown>
                            <Grid item sm />
                        </Hidden>
                    </Grid>
                </div>
                {fileData.map((item, index) => (
                    <div style={{ padding: 8 }} key={index}>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            key={`file-${index}`}
                            spacing={16}
                            wrap={'nowrap'}
                            className={classes.header}
                        >
                            <Grid item xs={1}>
                                <FileIcon {...item.iconProps} showPreview={showPreview} />
                            </Grid>
                            <Grid item sm={4} className={classes.dataWrapper}>
                                <FileName {...item} onFileSelect={showPreview} />
                            </Grid>
                            <Hidden xsDown>
                                <Grid item sm={4} className={classes.dataWrapper}>
                                    <Typography variant="body2" noWrap>
                                        {item.description}
                                    </Typography>
                                </Grid>
                            </Hidden>
                            <Hidden smDown>
                                <Grid item sm={2} className={classes.dataWrapper}>
                                    <Typography variant="body2" noWrap>
                                        {item.calculatedSize}
                                    </Typography>
                                </Grid>
                            </Hidden>
                            <Hidden xsDown>
                                <Grid item sm style={{ textAlign: 'right' }}>
                                    <OpenAccessIcon {...item.openAccessStatus} />
                                </Grid>
                            </Hidden>
                            {isAdmin && (
                                <Grid item xs style={{ textAlign: 'right' }}>
                                    <Tooltip title={deleteHint}>
                                        <IconButton onClick={onFileDelete(index)} disabled={disabled}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                ))}
                {preview.mediaUrl && preview.mimeType && <MediaPreview {...preview} onClose={hidePreview} />}
            </StandardCard>
        </Grid>
    );
};

AttachedFiles.propTypes = {
    dataStreams: PropTypes.array.isRequired,
    hideCulturalSensitivityStatement: PropTypes.bool,
    setHideCulturalSensitivityStatement: PropTypes.func,
    disabled: PropTypes.bool,
    deleteHint: PropTypes.string,
    onDelete: PropTypes.func,
    locale: PropTypes.object,
};

AttachedFiles.defaultProps = {
    deleteHint: 'Remove this file',
};
const Files = props => <AttachedFiles {...props} />;
export default Files;
