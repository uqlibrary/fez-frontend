import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { makeStyles } from '@mui/styles';
import Delete from '@mui/icons-material/Delete';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
import EditableFileName, { getFilenamePart } from 'modules/ViewRecord/components/partials/EditableFileName';
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
        upDownArrowContainer: {
            padding: '0 !important',
            textAlign: 'center',
        },
        upDownArrow: {
            padding: '0 8px 0',
            display: 'inline-block',
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

export const getSecurityPolicyFileEmbargoStatus = dataStream => {
    const embargoDate = dataStream.dsi_embargo_date;
    if (
        dataStream.dsi_security_policy === fileUploadConfig.FILE_SECURITY_POLICY_ADMIN &&
        embargoDate &&
        moment(embargoDate).isAfter(moment(), 'day')
    ) {
        return {
            isEmbargoed: true,
            embargoDate,
        };
    }
    return { isEmbargoed: false };
};

export const getFileData = (openAccessStatusId, dataStreams, isAdmin, isAuthor, record) => {
    const attachments = record.fez_record_search_key_file_attachment_name;
    return !!dataStreams && dataStreams.length > 0
        ? dataStreams
              .filter(isFileValid(viewRecordsConfig, isAdmin))
              .map(item => {
                  if (
                      (item.dsi_order === null || item.dsi_order === undefined) &&
                      !!attachments &&
                      attachments.length > 0
                  ) {
                      const attachIndex = attachments.findIndex(
                          attachitem => item.dsi_dsid === attachitem.rek_file_attachment_name,
                      );
                      item.dsi_order =
                          attachIndex >= 0 ? attachments[attachIndex].rek_file_attachment_name_order : null;
                  }
                  return item;
              })
              .sort((a, b) => {
                  if (a.dsi_order === null) {
                      return 1;
                  }

                  if (b.dsi_order === null) {
                      return -1;
                  }

                  if (a.dsi_order === b.dsi_order) {
                      return 0;
                  }

                  return a.dsi_order < b.dsi_order ? -1 : 1;
              })
              .map((dataStream, key) => {
                  const pid = dataStream.dsi_pid;
                  const fileName = dataStream.dsi_dsid;
                  const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';

                  const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
                  const previewFileName = checkForPreview(fileName, dataStreams);
                  const webFileName = checkForWeb(fileName, dataStreams);

                  const openAccessStatus = getFileOpenAccessStatus(openAccessStatusId, dataStream);

                  return {
                      id: dataStream.dsi_id,
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
                      securityPolicyStatus: getSecurityPolicyFileEmbargoStatus(dataStream),
                      embargoDate: dataStream.dsi_embargo_date,
                      fileOrder: key + 1,
                      key: dataStream.dsi_id,
                  };
              })
        : [];
};

export const checkFileNamesForDupes = (
    dataStreams,
    formValuesFromContext,
    setErrorMessage,
    excludeIndex,
) => newFilename => {
    const filesToCheck = [
        ...dataStreams.filter((_, index) => index !== excludeIndex),
        ...(formValuesFromContext?.files?.queue?.map(file => ({ dsi_dsid: file.name })) ?? []),
    ];
    const newFilenamePart = getFilenamePart(newFilename);
    const hasDupe = filesToCheck.some(
        dataStream =>
            getFilenamePart(dataStream.dsi_dsid) === newFilenamePart ||
            (!!dataStream.dsi_dsid_new && getFilenamePart(dataStream.dsi_dsid_new) === newFilenamePart),
    );
    !!hasDupe &&
        setErrorMessage(
            fileUploadLocale.default.validation.sameFileNameWithDifferentExt.replace('[fileNames]', newFilename),
        );
    return !hasDupe;
};

export const AttachedFiles = ({
    dataStreams,
    disabled,
    deleteHint,
    onDelete,
    onDateChange,
    onDescriptionChange,
    onFilenameChange,
    onFilenameSave,
    onHandleFileIsValid,
    onOrderChange,
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
    const { formValues: formValuesFromContext } = useFormValuesContext();

    const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const fileData = getFileData(openAccessStatusId, dataStreams, isAdmin, isAuthor, record);

    if (fileData.length === 0) return null;

    // tested in cypress
    /* istanbul ignore next */
    const onEmbargoDateChange = id => value => {
        const indexToChange = dataStreams.findIndex(item => item.dsi_id === id);
        value === null &&
            markEmbargoDateAsCleared([
                ...hasClearedEmbargoDate.slice(0, indexToChange),
                true,
                ...hasClearedEmbargoDate.slice(indexToChange + 1),
            ]);

        onDateChange(
            'dsi_embargo_date',
            !!value ? moment(value).format(globalLocale.global.embargoDateFormat) : null,
            indexToChange,
        );
    };

    const hasVideo = fileData.some(item => item.mimeType.indexOf('video') > -1 || item.mimeType === 'application/mxf');
    const getDsIndex = id => dataStreams.findIndex(item => item.dsi_id === id);

    const onFileDelete = file => () => onDelete(file);
    const onFileDescriptionChange = id => event => {
        const indexToChange = getDsIndex(id);
        onDescriptionChange('dsi_label', event.target.value, indexToChange);
    };

    const onFileOrderChangeUp = (id, index) => onOrderChange(id, index, index - 1);
    const onFileOrderChangeDown = (id, index) => onOrderChange(id, index, index + 1);

    const checkFileNamesForErrors = () => {
        const mappedFilenames = fileData.map((file, index) => ({
            index,
            name: file.fileName,
        }));

        const processedFilenames = removeInvalidFileNames(mappedFilenames, fileRestrictionsConfig.fileNameRestrictions);
        const errormessage = getErrorMessage(processedFilenames, fileUploadLocale.default, fileRestrictionsConfig);

        setErrorMessage(errormessage);
        return errormessage === '';
    };

    const checkFileNameForErrors = id => fileName => {
        const index = getDsIndex(id);
        const mappedFilename = [
            {
                index,
                name: fileName,
            },
        ];

        const processedFilenames = removeInvalidFileNames(mappedFilename, fileRestrictionsConfig.fileNameRestrictions);
        const errormessage = getErrorMessage(processedFilenames, fileUploadLocale.default, fileRestrictionsConfig);
        setErrorMessage(errormessage);
        return errormessage === '';
    };

    /* istanbul ignore next */
    const onFileCancelEdit = () => {
        checkFileNamesForErrors();
    };

    const onFileNameChange = id => (originalFilename, previousFilename) => {
        const index = getDsIndex(id);
        onFilenameChange('dsi_dsid', originalFilename, index, previousFilename);
    };
    const onFileSaveFilename = id => (originalFilename, previousFilename, filename) => {
        // dsi_dsid_new key contains original filename. This is picked up when
        // the record is saved in the validator, and processed there.
        const index = getDsIndex(id);
        onFilenameSave(
            [
                { key: 'dsi_dsid_new', value: originalFilename },
                { key: 'dsi_dsid', value: filename },
            ],
            previousFilename,
            index,
        );
    };
    const handleFileIsValid = id => isValid => {
        const index = getDsIndex(id);
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
                {isAdmin && canEdit && <Alert type="warning" message={locale.renamingFilesInstructions.text} />}
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
                        <Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="caption" gutterBottom>
                                {locale.description}
                            </Typography>
                        </Grid>
                        <Grid item md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="caption" gutterBottom>
                                {locale.size}
                            </Typography>
                        </Grid>
                        <Grid item sm sx={{ display: { xs: 'none', sm: 'block' } }} />

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
                {fileData
                    .sort((a, b) => a.fileOrder - b.fileOrder)
                    .map((item, index) => (
                        <React.Fragment key={item.id}>
                            <div
                                style={{ padding: 8 }}
                                data-testid={`fez-datastream-info-attached-list-row-${item.id}`}
                            >
                                <Grid container className={classes.header} spacing={3}>
                                    <Grid item xs={12}>
                                        <Grid container direction="row" alignItems="center" spacing={2} wrap={'nowrap'}>
                                            <Grid item xs={1} className={classes.upDownArrowContainer}>
                                                <IconButton
                                                    disabled={index === 0}
                                                    className={classes.upDownArrow}
                                                    id={`order-up-file-${index}`}
                                                    data-analyticsid={`order-up-file-${index}`}
                                                    data-testid={`order-up-file-${index}`}
                                                    onClick={() => onFileOrderChangeUp(item.id, index + 1)}
                                                >
                                                    <ExpandLessIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
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
                                                        onFileNameChange={onFileNameChange(item.id)}
                                                        onFileSelect={showPreview}
                                                        onFileSaveFilename={onFileSaveFilename(item.id)}
                                                        onFileCancelEdit={onFileCancelEdit}
                                                        handleFileIsValid={handleFileIsValid(item.id)}
                                                        checkFileNameForErrors={checkFileNameForErrors(item.id)}
                                                        checkFileNamesForDupes={checkFileNamesForDupes(
                                                            dataStreams,
                                                            formValuesFromContext,
                                                            setErrorMessage,
                                                            getDsIndex(item.id),
                                                        )}
                                                        id={`file-name-${item.id}`}
                                                        key={item.id}
                                                    />
                                                ) : (
                                                    <FileName
                                                        {...item}
                                                        onFileSelect={showPreview}
                                                        id={`file-name-${item.id}`}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid
                                                item
                                                sm={3}
                                                className={classes.dataWrapper}
                                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                            >
                                                {isAdmin && canEdit ? (
                                                    <TextField
                                                        fullWidth
                                                        onChange={onFileDescriptionChange(item.id)}
                                                        name="fileDescription"
                                                        defaultValue={item.description}
                                                        id={`file-description-input-${index}`}
                                                        textFieldId={`dsi-label-${index}`}
                                                        inputProps={{
                                                            maxLength: 255,
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography variant="body2" noWrap>
                                                        {item.description}
                                                    </Typography>
                                                )}
                                            </Grid>
                                            <Grid
                                                item
                                                sm={2}
                                                className={classes.dataWrapper}
                                                sx={{ display: { xs: 'none', md: 'block' } }}
                                            >
                                                <Typography variant="body2" noWrap>
                                                    {item.calculatedSize}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                sm
                                                style={{ textAlign: 'right' }}
                                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                            >
                                                <OpenAccessIcon
                                                    {...item.openAccessStatus}
                                                    securityStatus={item.securityStatus}
                                                />
                                            </Grid>
                                            {isAdmin && canEdit && (
                                                <React.Fragment>
                                                    {/* cypress test does not like full stop in the id */}
                                                    <Grid
                                                        item
                                                        xs={2}
                                                        id={`embargoDateButton-${item.fileName.replace(/\./g, '-')}`}
                                                    >
                                                        {(openAccessConfig.openAccessFiles.includes(
                                                            openAccessStatusId,
                                                        ) ||
                                                            !!item.securityPolicyStatus.isEmbargoed) && (
                                                            <FileUploadEmbargoDate
                                                                value={
                                                                    item.openAccessStatus.embargoDate ??
                                                                    item.securityPolicyStatus.embargoDate
                                                                }
                                                                onChange={onEmbargoDateChange(item.id)}
                                                                disabled={disabled}
                                                                fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                                                                minDate={moment().toDate()}
                                                            />
                                                        )}
                                                    </Grid>
                                                    <Grid item xs style={{ textAlign: 'right' }}>
                                                        <Tooltip title={deleteHint}>
                                                            <span>
                                                                <IconButton
                                                                    id={`delete-file-${index}`}
                                                                    data-analyticsid={`delete-file-${index}`}
                                                                    data-testid={`delete-file-${index}`}
                                                                    onClick={onFileDelete(item.fileName)}
                                                                    disabled={disabled}
                                                                    size="large"
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </Grid>
                                                </React.Fragment>
                                            )}
                                        </Grid>
                                        {!!hasClearedEmbargoDate[getDsIndex(item.id)] && (
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

                                        <Grid container direction="row" alignItems="center" spacing={2} wrap={'nowrap'}>
                                            <Grid item xs={1} className={classes.upDownArrowContainer}>
                                                <IconButton
                                                    className={classes.upDownArrow}
                                                    disabled={index === fileData.length - 1}
                                                    id={`order-down-file-${index}`}
                                                    data-analyticsid={`order-down-file-${index}`}
                                                    data-testid={`order-down-file-${index}`}
                                                    onClick={() => onFileOrderChangeDown(item.id, index + 1)}
                                                >
                                                    <ExpandMoreIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </React.Fragment>
                    ))}
                {preview.mediaUrl && preview.mimeType && (
                    <MediaPreview {...preview} onClose={hidePreview} id="media-preview" />
                )}
                {/* istanbul ignore next*/
                errorMessage.length > 0 && (
                    <Grid item xs={12}>
                        <Alert alertId="alert-files" title={errorTitle} message={errorMessage} type="error" />
                    </Grid>
                )}
            </StandardCard>
        </Grid>
    );
};

AttachedFiles.propTypes = {
    dataStreams: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    deleteHint: PropTypes.string,
    onDelete: PropTypes.func,
    onDateChange: PropTypes.func,
    onOrderChange: PropTypes.func,
    onDescriptionChange: PropTypes.func,
    onFilenameChange: PropTypes.func,
    onFilenameSave: PropTypes.func,
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
