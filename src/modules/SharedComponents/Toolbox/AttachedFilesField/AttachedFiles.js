import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { makeStyles } from '@material-ui/styles';
import Delete from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import globalLocale from 'locale/global';
import viewRecordLocale from 'locale/viewRecord';

import { useRecordContext, useFormValuesContext } from 'context';
import { userIsAdmin, userIsAuthor } from 'hooks';

import { isFileValid } from 'config/validation';
import { mui1theme, openAccessConfig, pathConfig, viewRecordsConfig } from 'config';
import * as fileUploadConfig from '../FileUploader/config';

import { getErrorMessage } from '../FileUploader/components/FileUploader';
import { removeInvalidFileNames } from '../FileUploader/components/FileUploadDropzone';
import FileName from 'modules/ViewRecord/components/partials/FileName';
import EditableFileName from 'modules/ViewRecord/components/partials/EditableFileName';
import FileUploadEmbargoDate from '../FileUploader/components/FileUploadEmbargoDate';
import MediaPreview from 'modules/ViewRecord/components/MediaPreview';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { checkForThumbnail, checkForPreview, checkForWeb, formatBytes } from 'modules/ViewRecord/components/Files';

import { FileIcon } from './FileIcon';
import { getAdvisoryStatement, getSensitiveHandlingNote } from '../../../../helpers/datastreams';
import * as fileUploadLocale from '../FileUploader/locale';

export const useStyles = makeStyles(
    /* istanbul ignore next */
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
        thumbIconCentered: {
            textAlign: 'center',
        },
    }),
    { withTheme: true },
);

const initialPreviewState = {
    fileName: null,
    mediaUrl: null,
    previewMediaUrl: null,
    mimeType: null,
    webMediaUrl: null,
};

const usePreview = initialPreviewState => {
    const [preview, setPreview] = useState(initialPreviewState);

    const showPreview = ({ fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl }) => {
        setPreview({ fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl });
    };

    const hidePreview = () => {
        setPreview(initialPreviewState);
    };

    return [preview, showPreview, hidePreview];
};

export const getUrl = (pid, fileName) => fileName && pathConfig.file.url(pid, fileName);

export const getFileOpenAccessStatus = (openAccessStatusId, dataStream) => {
    const embargoDate = dataStream.dsi_embargo_date;
    if (openAccessConfig.openAccessFiles.indexOf(openAccessStatusId) < 0) {
        return { isOpenAccess: false, embargoDate: null, openAccessStatusId };
    }
    if (embargoDate && moment(embargoDate).isAfter(moment(), 'day')) {
        return {
            isOpenAccess: false,
            embargoDate,
            openAccessStatusId,
            securityStatus: true,
        };
    }
    return { isOpenAccess: true, embargoDate: null, openAccessStatusId: openAccessStatusId };
};

export const getFileData = (openAccessStatusId, dataStreams, viewRecordsConfig, isAdmin, isAuthor) => {
    return !!dataStreams && dataStreams.length > 0
        ? dataStreams.filter(isFileValid(viewRecordsConfig, isAdmin)).map(dataStream => {
              const pid = dataStream.dsi_pid;
              const fileName = dataStream.dsi_dsid;
              const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';

              const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
              const previewFileName = checkForPreview(fileName, dataStreams);
              const webFileName = checkForWeb(fileName, dataStreams);

              const openAccessStatus = getFileOpenAccessStatus(openAccessStatusId, dataStream);

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
                      allowDownload: openAccessStatus.isOpenAccess || isAuthor || isAdmin,
                      webFileName,
                      securityAccess: true,
                  },
                  openAccessStatus,
                  previewMediaUrl: previewFileName ? getUrl(pid, previewFileName) : getUrl(pid, fileName),
                  webMediaUrl: webFileName ? getUrl(pid, webFileName) : null,
                  mediaUrl: getUrl(pid, fileName),
                  securityStatus: true,
                  embargoDate: dataStream.dsi_embargo_date,
              };
          })
        : [];
};

export const AttachedFiles = ({
    dataStreams,
    disabled,
    deleteHint,
    onDelete,
    onDateChange,
    onDescriptionChange,
    onFilenameChange,
    onHandleFileIsValid,
    onEmbargoClearPromptText,
    locale,
    canEdit,
    fileRestrictionsConfig,
}) => {
    const [hasClearedEmbargoDate, markEmbargoDateAsCleared] = useState(Array(dataStreams.length).fill(false));
    const [errorMessage, setErrorMessage] = useState('');

    const { errorTitle } = locale;

    const classes = useStyles();
    const [preview, showPreview, hidePreview] = usePreview(initialPreviewState);
    const { record } = useRecordContext();
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();
    const { openAccessStatusId } = useFormValuesContext();

    const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const fileData = getFileData(openAccessStatusId, dataStreams, viewRecordsConfig, isAdmin, isAuthor);
    if (fileData.length === 0) return null;

    // tested in cypress
    /* istanbul ignore next */
    const onEmbargoDateChange = index => value => {
        value === null &&
            markEmbargoDateAsCleared([
                ...hasClearedEmbargoDate.slice(0, index),
                true,
                ...hasClearedEmbargoDate.slice(index + 1),
            ]);

        onDateChange(
            'dsi_embargo_date',
            !!value ? moment(value).format(globalLocale.global.embargoDateFormat) : null,
            index,
        );
    };

    const hasVideo = fileData.some(item => item.mimeType.indexOf('video') > -1 || item.mimeType === 'application/mxf');

    const onFileDelete = index => () => onDelete(index);
    const onFileDescriptionChange = index => event => onDescriptionChange('dsi_label', event.target.value, index);

    const checkFileNamesForErrors = () => {
        const mappedFilenames = fileData.map((file, index) => ({
            index,
            name: file.fileName,
        }));
        const processedFilenames = removeInvalidFileNames(mappedFilenames, fileRestrictionsConfig.fileNameRestrictions);
        const errormessage = getErrorMessage(processedFilenames, fileUploadLocale.default, fileRestrictionsConfig);
        setErrorMessage(errormessage);
    };

    const onFileCancelEdit = () => {
        checkFileNamesForErrors();
    };

    const onFileNameChange = index => (filename /* , reset*/) => {
        onFilenameChange('dsi_dsid', filename, index);
        // POSSIBLE METHOD TO INDICATE FILENAME CHANGE AT API
        // onFilenameChange('dsi_dsid_changed', !!reset ?? false, index);
    };
    const onFileSaveFilename = () => {
        checkFileNamesForErrors();
    };
    const handleFileIsValid = index => isValid => {
        onHandleFileIsValid?.('isValid', isValid, index);
    };

    return (
        <Grid item xs={12}>
            <StandardCard title={locale.title} subCard>
                {/* eslint-disable-next-line camelcase */}
                {!!record.fez_record_search_key_advisory_statement && (
                    <Alert
                        allowDismiss
                        type="info"
                        message={getAdvisoryStatement(record, locale.culturalSensitivityStatement)}
                    />
                )}
                {/* eslint-disable-next-line camelcase */}
                {!!record.fez_record_search_key_sensitive_handling_note_id?.rek_sensitive_handling_note_id && (
                    <Alert allowDismiss type="info" message={getSensitiveHandlingNote(record)} />
                )}
                {isFireFox && hasVideo && <Alert allowDismiss {...viewRecordLocale.viewRecord.fireFoxAlert} />}
                <div style={{ padding: 8 }}>
                    <Grid container direction="row" alignItems="center" spacing={2} className={classes.header}>
                        <Grid item xs={1}>
                            &nbsp;
                        </Grid>
                        <Grid item sm={3}>
                            <Typography variant="caption" gutterBottom>
                                {locale.fileName}
                            </Typography>
                        </Grid>
                        <Hidden xsDown>
                            <Grid item sm={3}>
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
                        {isAdmin && canEdit && (
                            <React.Fragment>
                                <Grid item xs={2}>
                                    <Typography variant="caption" gutterBottom>
                                        {locale.embargoDateLabel || 'Embargo date'}
                                    </Typography>
                                </Grid>
                                <Grid item xs />
                            </React.Fragment>
                        )}
                    </Grid>
                </div>
                {fileData.map((item, index) => (
                    <React.Fragment key={index}>
                        <div style={{ padding: 8 }} key={index}>
                            <Grid container className={classes.header} spacing={3} key={`file-${index}`}>
                                <Grid item xs={12}>
                                    <Grid container direction="row" alignItems="center" spacing={2} wrap={'nowrap'}>
                                        <Grid item xs={1} className={classes.thumbIconCentered}>
                                            <FileIcon
                                                {...item.iconProps}
                                                showPreview={showPreview}
                                                id={`file-icon-${index}`}
                                            />
                                        </Grid>
                                        <Grid item sm={3} className={classes.dataWrapper}>
                                            {isAdmin && canEdit ? (
                                                <EditableFileName
                                                    {...item}
                                                    onFileNameChange={onFileNameChange(index)}
                                                    onFileSelect={showPreview}
                                                    onFileSaveFilename={onFileSaveFilename}
                                                    onFileCancelEdit={onFileCancelEdit}
                                                    filenameRestrictions={fileRestrictionsConfig.fileNameRestrictions}
                                                    handleFileIsValid={handleFileIsValid(index)}
                                                    id={`file-name-${index}`}
                                                />
                                            ) : (
                                                <FileName
                                                    {...item}
                                                    onFileSelect={showPreview}
                                                    id={`file-name-${index}`}
                                                />
                                            )}
                                        </Grid>
                                        <Hidden xsDown>
                                            <Grid item sm={3} className={classes.dataWrapper}>
                                                {isAdmin && canEdit ? (
                                                    <TextField
                                                        fullWidth
                                                        onChange={onFileDescriptionChange(index)}
                                                        name="fileDescription"
                                                        defaultValue={item.description}
                                                        id={`file-description-input-${index}`}
                                                        textFieldId={`dsi-label-${index}`}
                                                        key={item.fileName}
                                                    />
                                                ) : (
                                                    <Typography variant="body2" noWrap>
                                                        {item.description}
                                                    </Typography>
                                                )}
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
                                                <OpenAccessIcon
                                                    {...item.openAccessStatus}
                                                    securityStatus={item.securityStatus}
                                                />
                                            </Grid>
                                        </Hidden>
                                        {isAdmin && canEdit && (
                                            <React.Fragment>
                                                {/* cypress test does not like period in the id */}
                                                <Grid
                                                    item
                                                    xs={2}
                                                    id={`embargoDateButton-${item.fileName.replace(/\./g, '-')}`}
                                                >
                                                    {openAccessConfig.openAccessFiles.includes(openAccessStatusId) && (
                                                        <FileUploadEmbargoDate
                                                            value={item.openAccessStatus.embargoDate}
                                                            onChange={onEmbargoDateChange(index)}
                                                            disabled={disabled}
                                                            fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                                                        />
                                                    )}
                                                </Grid>
                                                <Grid item xs style={{ textAlign: 'right' }}>
                                                    <Tooltip title={deleteHint}>
                                                        <span>
                                                            <IconButton
                                                                id={`delete-file-${index}`}
                                                                onClick={onFileDelete(index)}
                                                                disabled={disabled}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </Grid>
                                            </React.Fragment>
                                        )}
                                    </Grid>
                                    {!!hasClearedEmbargoDate[index] && (
                                        // tested in cypress admin-edit audio
                                        /* istanbul ignore next */
                                        <React.Fragment>
                                            <Grid
                                                container
                                                spacing={1}
                                                alignContent={'flex-end'}
                                                alignItems={'flex-end'}
                                                justifyContent={'flex-end'}
                                                style={{ marginTop: 4 }}
                                            >
                                                <Grid item xs={6} />
                                                <Grid item xs={6}>
                                                    <Typography style={{ color: mui1theme.palette.warning.main }}>
                                                        <WarningIcon
                                                            fontSize={'small'}
                                                            style={{
                                                                color: mui1theme.palette.warning.main,
                                                                marginRight: 10,
                                                                marginBottom: -4,
                                                            }}
                                                        />
                                                        {onEmbargoClearPromptText}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    </React.Fragment>
                ))}
                {preview.mediaUrl && preview.mimeType && (
                    <MediaPreview {...preview} onClose={hidePreview} id="media-preview" />
                )}
            </StandardCard>
            {/* istanbul ignore next*/
            errorMessage.length > 0 && (
                <Grid item xs={12}>
                    <Alert title={errorTitle} message={errorMessage} type="error" />
                </Grid>
            )}
        </Grid>
    );
};

AttachedFiles.propTypes = {
    dataStreams: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    deleteHint: PropTypes.string,
    onDelete: PropTypes.func,
    onDateChange: PropTypes.func,
    onDescriptionChange: PropTypes.func,
    onFilenameChange: PropTypes.func,
    onHandleFileIsValid: PropTypes.func,
    onEmbargoClearPromptText: PropTypes.any,
    locale: PropTypes.object,
    canEdit: PropTypes.bool,
    fileRestrictionsConfig: PropTypes.object,
};

AttachedFiles.defaultProps = {
    deleteHint: 'Remove this file',
    onEmbargoClearPromptText: (
        <span>
            <b>Embargo date removed</b> - review security policy on Security tab
        </span>
    ),
    canEdit: false,
    fileRestrictionsConfig: {
        fileUploadLimit: fileUploadConfig.DEFAULT_FILE_UPLOAD_LIMIT,
        fileNameRestrictions: fileUploadConfig.FILE_NAME_RESTRICTION,
    },
};

export default AttachedFiles;
