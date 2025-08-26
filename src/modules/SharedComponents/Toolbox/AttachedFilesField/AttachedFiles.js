import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';

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

import { useRecordContext } from 'context';
import { userIsAdmin, userIsAuthor } from 'hooks';

import { isDateInBetween, isFileValid, isValidDate } from 'config/validation';
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
import { checkForPreview, checkForThumbnail, checkForWeb, formatBytes } from 'modules/ViewRecord/components/Files';

import { FileIcon } from './FileIcon';
import { getAdvisoryStatement, getSensitiveHandlingNote } from '../../../../helpers/datastreams';
import * as fileUploadLocale from '../FileUploader/locale';
import Box from '@mui/material/Box';
import { FileAvStateIcon } from '../FileAvStateIcon';
import { AV_CHECK_STATE_INFECTED } from '../../../../config/general';

const classes = {
    dataWrapper: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    upDownArrow: {
        padding: '0 8px 0',
        display: 'inline-block',
    },
};

const initialPreviewState = {
    fileName: null,
    mediaUrl: null,
    previewMediaUrl: null,
    mimeType: null,
    webMediaUrl: null,
};

const usePreview = initialPreviewState => {
    const [preview, setPreview] = useState(initialPreviewState);

    const showPreview = /* istanbul ignore next */ ({ fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl }) => {
        /* istanbul ignore next */
        setPreview({ fileName, mediaUrl, previewMediaUrl, mimeType, webMediaUrl });
    };

    const hidePreview = /* istanbul ignore next */ () => {
        /* istanbul ignore next */
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

                  /* istanbul ignore next */
                  if (b.dsi_order === null) {
                      return -1;
                  }

                  /* istanbul ignore next */
                  if (a.dsi_order === b.dsi_order) {
                      return 0;
                  }

                  return a.dsi_order < b.dsi_order ? -1 : 1;
              })
              .map((dataStream, key) => {
                  const id = dataStream.dsi_id;
                  const pid = dataStream.dsi_pid;
                  const fileName = dataStream.dsi_dsid;
                  const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : /* istanbul ignore next */ '';

                  const thumbnailFileName = checkForThumbnail(fileName, dataStreams);
                  const previewFileName = checkForPreview(fileName, dataStreams);
                  const webFileName = checkForWeb(fileName, dataStreams);

                  const openAccessStatus = getFileOpenAccessStatus(openAccessStatusId, dataStream);
                  const previewUrl = previewFileName
                      ? /* istanbul ignore next */ getUrl(pid, previewFileName)
                      : getUrl(pid, fileName);
                  const isInfected = dataStream.dsi_av_check_state === AV_CHECK_STATE_INFECTED;

                  return {
                      id,
                      key: id,
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
                      previewMediaUrl: isInfected ? /* istanbul ignore next */ null : previewUrl,
                      webMediaUrl: webFileName ? /* istanbul ignore next */ getUrl(pid, webFileName) : null,
                      mediaUrl: getUrl(pid, fileName),
                      securityStatus: true,
                      securityPolicyStatus: getSecurityPolicyFileEmbargoStatus(dataStream),
                      embargoDate: dataStream.dsi_embargo_date,
                      fileOrder: key + 1,
                      avCheck: {
                          state: dataStream.dsi_av_check_state,
                          date: dataStream.dsi_av_check_date,
                      },
                  };
              })
        : [];
};

export const checkFileNamesForDupes =
    (dataStreams, formValuesFromContext, setErrorMessage, excludeIndex) => newFilename => {
        const filesToCheck = [
            ...dataStreams.filter((_, index) => index !== excludeIndex),
            ...(formValuesFromContext?.files?.queue?.map(
                /* istanbul ignore next */ file => /* istanbul ignore next */ ({ dsi_dsid: file.name }),
            ) ?? []),
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

export const getFilenameId = id => `file-name-${id}`;

export const AttachedFiles = ({
    dataStreams,
    disabled,
    deleteHint = 'Remove this file',
    openAccessStatusId,
    onDelete,
    onDateChange,
    onDescriptionChange,
    onFilenameChange,
    onFilenameSave,
    onHandleFileIsValid,
    onOrderChange,
    onEmbargoClearPromptText = (
        <span>
            <b>Embargo date removed</b> - review security policy on Security tab
        </span>
    ),
    locale = {},
    canEdit = false,
    fileRestrictionsConfig = {
        fileUploadLimit: fileUploadConfig.DEFAULT_FILE_UPLOAD_LIMIT,
        fileNameRestrictions: fileUploadConfig.FILE_NAME_RESTRICTION,
    },
}) => {
    const [hasClearedEmbargoDate, markEmbargoDateAsCleared] = useState(Array(dataStreams.length).fill(false));
    const [fileNameErrorMessage, setFileNameErrorMessage] = useState('');
    const [embargoDateErrorMessage, setEmbargoDateErrorMessage] = useState('');

    const { errorTitle } = locale;
    const [preview, showPreview, hidePreview] = usePreview(initialPreviewState);
    const { record } = useRecordContext();
    const isAdmin = userIsAdmin();
    const isAuthor = userIsAuthor();
    const { getValues } = useFormContext();
    const formValues = getValues('filesSection');
    const isAdminEditing = isAdmin && canEdit;

    const isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const fileData = getFileData(openAccessStatusId, dataStreams, isAdmin, isAuthor, record);

    if (fileData.length === 0) return null;

    const isValidEmbargoDate = date =>
        isValidDate(date) && /* istanbul ignore next */ isDateInBetween(date, moment(), '2099');

    const onEmbargoDateKeyUp = e => {
        // bail if it's not backspace
        /* istanbul ignore else */
        if (e.key !== 'Backspace' || /* istanbul ignore next */ !embargoDateErrorMessage.length) {
            return;
        }
        /**
         * if the user hits the backspace key while the focus is in the date's text field, clear invalid any embargo
         * date related errors
         *
         * Note: ideally we should not need to do this, but unfortunately for the scenario described above the
         * onChange event might be triggered only once, upon the deletion of a single character and not the removal
         * of the whole date.
         */
        /* istanbul ignore next */
        setEmbargoDateErrorMessage('');
    };

    /* istanbul ignore next */
    const onEmbargoDateChange = id => value => {
        const indexToChange = dataStreams.findIndex(item => item.dsi_id === id);
        const isEmpty = value === null;
        const isValid = isValidEmbargoDate(value);

        setEmbargoDateErrorMessage('');
        if (!isEmpty && !isValid) {
            setEmbargoDateErrorMessage(
                fileUploadLocale.default.fileUploadRow.invalidEmbargoDateWarning(dataStreams[indexToChange].dsi_dsid),
            );
        }

        isEmpty &&
            markEmbargoDateAsCleared([
                ...hasClearedEmbargoDate.slice(0, indexToChange),
                true,
                ...hasClearedEmbargoDate.slice(indexToChange + 1),
            ]);

        onDateChange(
            'dsi_embargo_date',
            isValid ? moment(value).format(globalLocale.global.embargoDateFormat) : null,
            indexToChange,
        );
    };

    const hasVideo = fileData.some(item => item.mimeType.indexOf('video') > -1 || item.mimeType === 'application/mxf');
    const getDsIndex = id => dataStreams.findIndex(item => item.dsi_id === id);

    const onFileDelete = file => /* istanbul ignore next */ () => /* istanbul ignore next */ onDelete(file);
    const onFileDescriptionChange = id => /* istanbul ignore next */ event => {
        const indexToChange = /* istanbul ignore next */ getDsIndex(id);
        /* istanbul ignore next */
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
        const fileNameErrorMessage = getErrorMessage(
            processedFilenames,
            fileUploadLocale.default,
            fileRestrictionsConfig,
        );

        setFileNameErrorMessage(fileNameErrorMessage);
        return fileNameErrorMessage === '';
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
        const fileNameErrorMessage = getErrorMessage(
            processedFilenames,
            fileUploadLocale.default,
            fileRestrictionsConfig,
        );
        setFileNameErrorMessage(fileNameErrorMessage);
        return fileNameErrorMessage === '';
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
        <Grid xs={12}>
            <StandardCard title={locale.title} subCard>
                {!!record.fez_record_search_key_advisory_statement && (
                    /* istanbul ignore next */ <Alert
                        allowDismiss
                        type="info"
                        message={getAdvisoryStatement(record, locale.culturalSensitivityStatement)}
                    />
                )}
                {!!record.fez_record_search_key_sensitive_handling_note_id?.rek_sensitive_handling_note_id && (
                    /* istanbul ignore next */ <Alert
                        allowDismiss
                        type="info"
                        message={getSensitiveHandlingNote(record)}
                    />
                )}
                {isFireFox && /* istanbul ignore next */ hasVideo && (
                    /* istanbul ignore next */ <Alert allowDismiss {...viewRecordLocale.viewRecord.fireFoxAlert} />
                )}
                {isAdminEditing && <Alert type="warning" message={locale.renamingFilesInstructions.text} />}
                <Box sx={{ padding: 1 }}>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.light' }}
                    >
                        <Grid xs={1}>&nbsp;</Grid>
                        <Grid sm={3} xs={6}>
                            <Typography variant="caption" gutterBottom>
                                {locale.fileName}
                            </Typography>
                        </Grid>
                        <Grid
                            md={isAdminEditing ? 3 : 5}
                            sm={isAdminEditing ? 3 : 7}
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            <Typography variant="caption" gutterBottom>
                                {locale.description}
                            </Typography>
                        </Grid>
                        <Grid md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="caption" gutterBottom>
                                {locale.size}
                            </Typography>
                        </Grid>
                        {isAdminEditing && (
                            <Grid md={3} sm={4} sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" gutterBottom>
                                    {locale.embargoDateLabel || 'Embargo date'}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>
                {fileData
                    .sort((a, b) => a.fileOrder - b.fileOrder)
                    .map((item, index) => (
                        <React.Fragment key={item.id}>
                            <Box
                                data-testid={`fez-datastream-info-attached-list-row-${item.id}`}
                                sx={{ padding: 1, borderBottom: '1px solid', borderBottomColor: 'secondary.light' }}
                            >
                                <Grid container direction="row" alignItems="center" spacing={2}>
                                    <Grid xs={1} padding={0} wrap="nowrap" textAlign={'center'}>
                                        <IconButton
                                            disabled={index === 0}
                                            sx={{ ...classes.upDownArrow }}
                                            id={`order-up-file-${index}`}
                                            data-analyticsid={`order-up-file-${index}`}
                                            data-testid={`order-up-file-${index}`}
                                            onClick={() => onFileOrderChangeUp(item.id, index + 1)}
                                        >
                                            <ExpandLessIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center" spacing={2}>
                                    <Grid xs={1} sx={{ textAlign: 'center' }}>
                                        <FileIcon
                                            {...item.iconProps}
                                            showPreview={showPreview}
                                            id={`file-icon-${index}`}
                                        />
                                    </Grid>
                                    <Grid sm={3} xs={6} sx={{ ...classes.dataWrapper }}>
                                        {isAdminEditing ? (
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
                                                    formValues,
                                                    setFileNameErrorMessage,
                                                    getDsIndex(item.id),
                                                )}
                                                id={getFilenameId(item.id)}
                                                key={item.id}
                                            />
                                        ) : (
                                            <FileName
                                                {...item}
                                                onFileSelect={showPreview}
                                                id={getFilenameId(item.id)}
                                            />
                                        )}
                                    </Grid>
                                    <Grid
                                        md={isAdminEditing ? 3 : 5}
                                        sm={isAdminEditing ? 3 : 7}
                                        sx={{ display: { xs: 'none', sm: 'block' }, ...classes.dataWrapper }}
                                    >
                                        {isAdminEditing ? (
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
                                    <Grid md={2} sx={{ display: { xs: 'none', md: 'block' }, ...classes.dataWrapper }}>
                                        <Typography variant="body2" noWrap>
                                            {item.calculatedSize}
                                        </Typography>
                                    </Grid>
                                    {isAdminEditing && (
                                        <Grid md={3} sm={4}>
                                            <Grid container wrap="nowrap">
                                                <Grid xs={3}>
                                                    <Box
                                                        sx={{
                                                            display: { xs: 'none', md: 'block' },
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        <Box component={'span'} paddingRight={1}>
                                                            <FileAvStateIcon
                                                                state={item.avCheck?.state}
                                                                checkedAt={item.avCheck?.date}
                                                                id={item.id}
                                                            />
                                                        </Box>
                                                        <Box component={'span'} paddingRight={1}>
                                                            <OpenAccessIcon
                                                                {...item.openAccessStatus}
                                                                securityStatus={item.securityStatus}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid
                                                    xs={7}
                                                    id={`embargoDateButton-${item.fileName.replace(/\./g, '-')}`}
                                                    sx={{ marginLeft: 1, flexGrow: 1 }}
                                                >
                                                    {(openAccessConfig.openAccessFiles.includes(openAccessStatusId) ||
                                                        !!item.securityPolicyStatus.isEmbargoed) && (
                                                        <FileUploadEmbargoDate
                                                            value={
                                                                item.openAccessStatus.embargoDate ??
                                                                item.securityPolicyStatus.embargoDate
                                                            }
                                                            onChange={onEmbargoDateChange(item.id)}
                                                            onKeyUp={onEmbargoDateKeyUp}
                                                            disabled={disabled}
                                                            fileUploadEmbargoDateId={`dsi-embargo-date-${index}`}
                                                            minDate={moment().toDate()}
                                                        />
                                                    )}
                                                </Grid>
                                                <Grid xs={2} sx={{ marginTop: '-10px', textAlign: 'right' }}>
                                                    <Tooltip title={deleteHint}>
                                                        <span>
                                                            <IconButton
                                                                id={`delete-file-${index}`}
                                                                data-testid={`delete-file-${index}`}
                                                                data-analyticsid={`delete-file-${index}`}
                                                                onClick={onFileDelete(item.fileName)}
                                                                disabled={disabled}
                                                                sx={{ padding: '12px' }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                                    {!isAdminEditing && (
                                        <Grid md={3} sm={4} sx={{ textAlign: 'right' }}>
                                            <Box sx={{ whiteSpace: 'nowrap' }}>
                                                <Box component={'span'} paddingRight={1}>
                                                    <FileAvStateIcon
                                                        state={item.avCheck?.state}
                                                        checkedAt={item.avCheck?.date}
                                                        id={item.id}
                                                    />
                                                </Box>
                                                <Box component={'span'} paddingRight={1}>
                                                    <OpenAccessIcon
                                                        {...item.openAccessStatus}
                                                        securityStatus={item.securityStatus}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                                {!!hasClearedEmbargoDate[getDsIndex(item.id)] && (
                                    /* istanbul ignore next */
                                    <React.Fragment>
                                        <Grid
                                            container
                                            spacing={1}
                                            alignContent={'flex-end'}
                                            alignItems={'flex-end'}
                                            justifyContent={'flex-end'}
                                            sx={{ marginTop: '4px' }}
                                        >
                                            <Grid xs={6} />
                                            <Grid xs={6}>
                                                <Typography sx={{ color: mui1theme.palette.warning.main }}>
                                                    <WarningIcon
                                                        fontSize={'small'}
                                                        sx={{
                                                            color: mui1theme.palette.warning.main,
                                                            marginRight: '10px',
                                                            marginBottom: '-4px',
                                                        }}
                                                    />
                                                    {onEmbargoClearPromptText}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>
                                )}

                                <Grid container direction="row" alignItems="center" spacing={2}>
                                    <Grid xs={1} padding={0} wrap="nowrap" textAlign={'center'}>
                                        <IconButton
                                            sx={{ ...classes.upDownArrow }}
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
                            </Box>
                        </React.Fragment>
                    ))}
                {preview.mediaUrl && /* istanbul ignore next */ preview.mimeType && (
                    /* istanbul ignore next */ <MediaPreview {...preview} onClose={hidePreview} id="media-preview" />
                )}
                {
                    /* istanbul ignore next*/
                    (fileNameErrorMessage.length > 0 || embargoDateErrorMessage.length > 0) && (
                        <Grid xs={12}>
                            <Alert
                                alertId="alert-files"
                                title={errorTitle}
                                message={fileNameErrorMessage || embargoDateErrorMessage}
                                type={fileNameErrorMessage ? 'error' : 'warning'}
                            />
                        </Grid>
                    )
                }
            </StandardCard>
        </Grid>
    );
};

AttachedFiles.propTypes = {
    dataStreams: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    openAccessStatusId: PropTypes.number,
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

export default AttachedFiles;
