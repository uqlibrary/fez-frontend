import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { clearFileUpload } from '../actions';
import FileUploadDropzone from './FileUploadDropzone';
import FileUploadRowHeader from './FileUploadRowHeader';
import FileUploadRow from './FileUploadRow';
import FileUploadTermsAndConditions from './FileUploadTermsAndConditions';
import { Alert } from '../../Alert';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as config from '../config';

import locale from '../locale';
import { isDateSameOrAfter, isValidDate } from '../../../../../config/validation';

const moment = require('moment');

/**
 * Process errors into a message
 *
 */
export const getErrorMessage = (errors, locale, fileRestrictionsConfig) => {
    const { validation } = locale;
    const errorMessages = [];

    Object.keys(errors).map(errorCode => {
        const fileNames = errors[errorCode];
        if (fileNames && fileNames.length > 0 && validation[errorCode]) {
            errorMessages.push(
                validation[errorCode]
                    .replace('[numberOfFiles]', fileNames.length)
                    .replace('[fileNames]', fileNames.join(', '))
                    .replace('[maxNumberOfFiles]', `${fileRestrictionsConfig.fileUploadLimit}`),
            );
        }
    });

    return errorMessages.length > 0 ? errorMessages.join('; ') : '';
};

export const FileUploader = ({
    onChange,
    locale,
    fileRestrictionsConfig,
    requireOpenAccessStatus,
    disabled,
    defaultQuickTemplateId,
    isNtro,
    isAdmin,
}) => {
    const dispatch = useDispatch();
    const [state, _setState] = React.useState({
        filesInQueue: [],
        isTermsAndConditionsAccepted: false,
        errorMessage: '',
    });

    /**
     * Check if any file is open access
     *
     * @param files
     * @returns {boolean}
     */
    const isAnyOpenAccess = files => {
        return (
            files.filter(
                file =>
                    file.hasOwnProperty(config.FILE_META_KEY_ACCESS_CONDITION) &&
                    file[config.FILE_META_KEY_ACCESS_CONDITION] === config.FILE_ACCESS_CONDITION_OPEN,
            ).length > 0
        );
    };

    /**
     * Calculate max file size allowed by dropzone
     *
     * @returns {number}
     */
    const calculateMaxFileSize = () => {
        const { maxFileSize, fileSizeUnit } = fileRestrictionsConfig;
        const exponent = config.SIZE_UNITS.indexOf(fileSizeUnit);
        return maxFileSize * Math.pow(config.SIZE_BASE, exponent >= 0 ? exponent : /* istanbul ignore next */ 0);
    };

    /**
     * Check if any file has public security policy (admin only)
     *
     * @param files
     * @returns {boolean}
     */
    const isAnySecurityPolicyPublic = files => {
        return (
            files.filter(
                file =>
                    file.hasOwnProperty(config.FILE_META_KEY_SECURITY_POLICY) &&
                    file[config.FILE_META_KEY_SECURITY_POLICY] === config.FILE_SECURITY_POLICY_PUBLIC,
            ).length > 0
        );
    };

    /**
     * @param filesInQueue
     * @return {boolean}
     */
    const isAnyEmbargoDateInvalid = filesInQueue => {
        const today = moment();
        const openAccess = filesInQueue.filter(
            file => file[config.FILE_META_KEY_ACCESS_CONDITION] === config.FILE_ACCESS_CONDITION_OPEN,
        );
        const validEmbargoDates = openAccess.filter(
            file =>
                isValidDate(file[config.FILE_META_KEY_EMBARGO_DATE]) &&
                isDateSameOrAfter(file[config.FILE_META_KEY_EMBARGO_DATE], today),
        );
        return openAccess.length !== validEmbargoDates.length;
    };

    /**
     * Check if entire file uploader is valid including access conditions and t&c
     *
     * @param filesInQueue
     * @param isTermsAndConditionsAccepted
     * @returns {boolean}
     */
    const isFileUploadValid = ({ filesInQueue, isTermsAndConditionsAccepted }) => {
        return (
            !requireOpenAccessStatus ||
            (filesInQueue.filter(file => file.hasOwnProperty(config.FILE_META_KEY_ACCESS_CONDITION)).length ===
                filesInQueue.length &&
                ((isAnyOpenAccess(filesInQueue) &&
                    !isAnyEmbargoDateInvalid(filesInQueue) &&
                    isTermsAndConditionsAccepted) ||
                    !isAnyOpenAccess(filesInQueue))) ||
            (filesInQueue.filter(file => file.hasOwnProperty(config.FILE_META_KEY_SECURITY_POLICY)).length ===
                filesInQueue.length &&
                ((isAnySecurityPolicyPublic(filesInQueue) && isTermsAndConditionsAccepted) ||
                    !isAnySecurityPolicyPublic(filesInQueue)))
        );
    };

    const setState = newState => {
        const _newState = { ...state, ...newState };
        _setState(_newState);
        onChange?.({
            queue: _newState.filesInQueue,
            isValid: isFileUploadValid(_newState),
        });
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearFileUpload());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*
     * File uploader's internal functions
     */

    /**
     * Replace file on a given index
     *
     * @param file
     * @param index
     * @private
     */
    const replaceFile = (file, index) => {
        const filesInQueue = [...state.filesInQueue.slice(0, index), file, ...state.filesInQueue.slice(index + 1)];

        setState({
            filesInQueue: filesInQueue,
            errorMessage: '',
            isTermsAndConditionsAccepted: state.isTermsAndConditionsAccepted && isAnyOpenAccess(filesInQueue),
        });
    };

    /**
     * Delete file on a given index
     *
     * @param file
     * @param index
     * @private
     */
    const _deleteFile = (file, index) => {
        const filesInQueue = [...state.filesInQueue.slice(0, index), ...state.filesInQueue.slice(index + 1)];

        setState({
            filesInQueue: filesInQueue,
            errorMessage: '',
            isTermsAndConditionsAccepted: state.isTermsAndConditionsAccepted && isAnyOpenAccess(filesInQueue),
        });
    };

    /**
     * Delete all files
     *
     * @private
     */
    const _deleteAllFiles = () => {
        setState({
            filesInQueue: [],
            errorMessage: '',
            isTermsAndConditionsAccepted: false,
        });
    };

    /**
     * Update file's access condition and/or embargo date based on selected value
     *
     * @param fileToUpdate
     * @param index
     * @param newValue
     * @private
     */
    const _updateFileAccessCondition = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };

        file[config.FILE_META_KEY_ACCESS_CONDITION] = newValue;

        if (newValue === config.FILE_SECURITY_POLICY_PUBLIC) {
            file[config.FILE_META_KEY_EMBARGO_DATE] = moment().format();
        } else {
            file[config.FILE_META_KEY_EMBARGO_DATE] = null;
        }

        replaceFile(file, index);
    };

    const _updateFileSecurityPolicy = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };

        file[config.FILE_META_KEY_SECURITY_POLICY] = newValue;

        if (newValue === config.FILE_SECURITY_POLICY_PUBLIC) {
            file[config.FILE_META_KEY_EMBARGO_DATE] = moment().format();
        } else {
            file[config.FILE_META_KEY_EMBARGO_DATE] = null;
        }

        replaceFile(file, index);
    };

    /**
     * Update file's embargo date
     *
     * @param fileToUpdate
     * @param index
     * @param newValue
     * @private
     */
    const _updateFileEmbargoDate = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };

        file[config.FILE_META_KEY_EMBARGO_DATE] = moment(newValue).format();

        replaceFile(file, index);
    };

    const shuffleFileOrder = (arr, from, to) => {
        return arr.reduce((prev, current, idx, self) => {
            /* istanbul ignore if */
            if (from === to) {
                prev.push(current);
            }
            if (idx === from) {
                return prev;
            }
            if (from < to) {
                prev.push(current);
            }
            /* istanbul ignore else */
            if (idx === to) {
                prev.push(self[from]);
            }
            if (from > to) {
                prev.push(current);
            }
            return prev;
        }, []);
    };

    const _updateOrderUp = index => {
        // Below needs to be moved into a seperate function
        const filesToOrder = [...state.filesInQueue];
        /* istanbul ignore else */
        if (index > 0) {
            const newOrder = shuffleFileOrder(filesToOrder, index, index - 1);
            setState({
                filesInQueue: [...newOrder],
            });
        }
    };
    const _updateOrderDown = index => {
        const filesToOrder = [...state.filesInQueue];
        /* istanbul ignore else */
        if (index < filesToOrder.length - 1) {
            const newOrder = shuffleFileOrder(filesToOrder, index, index + 1);
            setState({
                filesInQueue: [...newOrder],
            });
        }
    };

    /**
     * Update file's description
     *
     * @param fileToUpdate
     * @param index
     * @param newValue
     * @private
     */
    const _updateFileDescription = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };
        file[config.FILE_META_KEY_DESCRIPTION] = newValue;

        replaceFile(file, index);
    };

    /**
     * Accept terms and conditions
     *
     * @param event
     * @param value
     * @private
     */
    const _acceptTermsAndConditions = value => {
        setState({ isTermsAndConditionsAccepted: value });
    };

    /**
     * Handle accepted, rejected and dropped folders and display proper alerts
     *
     * @param uniqueFilesToQueue
     * @param errorsFromDropzone
     */
    const _handleDroppedFiles = (uniqueFilesToQueue, errorsFromDropzone) => {
        const { filesInQueue } = state;

        // Combine unique files and files queued already
        const totalFiles = [...filesInQueue, ...uniqueFilesToQueue];

        // Set files to queue
        setState({
            filesInQueue: defaultQuickTemplateId
                ? totalFiles.map(file => ({ ...file, [config.FILE_META_KEY_ACCESS_CONDITION]: defaultQuickTemplateId }))
                : totalFiles,
            focusOnIndex: filesInQueue.length,
            errorMessage: getErrorMessage(errorsFromDropzone, locale, fileRestrictionsConfig),
        });
    };

    const {
        instructions,
        accessTermsAndConditions,
        ntroSpecificInstructions,
        errorTitle,
        successTitle,
        successMessage,
        delayNotice,
        delayMessage,
    } = locale;
    const {
        maxFileSize,
        fileSizeUnit,
        fileUploadLimit,
        fileNameRestrictions,
        mimeTypeWhitelist,
    } = fileRestrictionsConfig;

    const instructionsDisplay = instructions
        .replace('[fileUploadLimit]', fileUploadLimit)
        .replace('[maxFileSize]', `${maxFileSize}`)
        .replace('[fileSizeUnit]', fileSizeUnit === config.SIZE_UNIT_B ? config.SIZE_UNIT_B : `${fileSizeUnit}B`);

    const filesInQueueRow = state.filesInQueue.map((file, index) => {
        return (
            <FileUploadRow
                key={file.name}
                fileUploadRowId={`fez-datastream-info-list-row-${index}`}
                rowCount={state.filesInQueue.length}
                index={index}
                uploadedFile={file}
                fileSizeUnit={fileSizeUnit}
                onDelete={_deleteFile}
                onAccessConditionChange={_updateFileAccessCondition}
                onEmbargoDateChange={_updateFileEmbargoDate}
                onOrderUpClick={_updateOrderUp}
                onOrderDownClick={_updateOrderDown}
                onFileDescriptionChange={_updateFileDescription}
                onSecurityPolicyChange={_updateFileSecurityPolicy}
                defaultAccessCondition={defaultQuickTemplateId}
                requireOpenAccessStatus={requireOpenAccessStatus && !defaultQuickTemplateId}
                disabled={disabled}
                focusOnIndex={state.focusOnIndex}
                locale={locale.fileUploadRow}
                isAdmin={isAdmin}
            />
        );
    });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                    {instructionsDisplay}
                </Typography>
                {isNtro && (
                    <Typography variant="body2" gutterBottom>
                        {ntroSpecificInstructions}
                    </Typography>
                )}
                <FileUploadDropzone
                    locale={locale}
                    maxSize={calculateMaxFileSize()}
                    disabled={disabled}
                    filesInQueue={state.filesInQueue.map(file => file.name)}
                    fileNameRestrictions={fileNameRestrictions}
                    mimeTypeWhitelist={mimeTypeWhitelist}
                    fileUploadLimit={fileUploadLimit}
                    onDrop={_handleDroppedFiles}
                />
            </Grid>
            {state.filesInQueue.length > 0 && (
                <Fragment>
                    <Grid item xs={12}>
                        <Alert
                            title={successTitle}
                            message={successMessage.replace('[numberOfFiles]', state.filesInQueue.length)}
                            type="done"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Alert title={delayNotice} message={delayMessage} type="warning" />
                    </Grid>
                </Fragment>
            )}
            {state.errorMessage.length > 0 && (
                <Grid item xs={12}>
                    <Alert title={errorTitle} message={state.errorMessage} type="error" />
                </Grid>
            )}
            {state.filesInQueue.length > 0 && (
                <Fragment>
                    <Grid item xs={12}>
                        <FileUploadRowHeader
                            onDeleteAll={_deleteAllFiles}
                            requireOpenAccessStatus={requireOpenAccessStatus && !defaultQuickTemplateId}
                            disabled={disabled}
                            isAdmin={isAdmin}
                        />
                    </Grid>
                    <Grid item xs={12} data-testid="fez-datastream-info-list">
                        {filesInQueueRow}
                    </Grid>
                    {requireOpenAccessStatus &&
                        (isAnyOpenAccess(state.filesInQueue) || isAnySecurityPolicyPublic(state.filesInQueue)) && (
                            <Grid item xs={12}>
                                <FileUploadTermsAndConditions
                                    onAcceptTermsAndConditions={_acceptTermsAndConditions}
                                    accessTermsAndConditions={accessTermsAndConditions}
                                    isTermsAndConditionsAccepted={state.isTermsAndConditionsAccepted}
                                    disabled={disabled}
                                />
                            </Grid>
                        )}
                </Fragment>
            )}
        </Grid>
    );
};

FileUploader.propTypes = {
    onChange: PropTypes.func,
    locale: PropTypes.object,
    fileRestrictionsConfig: PropTypes.object,
    requireOpenAccessStatus: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultQuickTemplateId: PropTypes.number,
    isNtro: PropTypes.bool,
    isAdmin: PropTypes.bool,
};

FileUploader.defaultProps = {
    locale: { ...locale },
    fileRestrictionsConfig: {
        fileUploadLimit: config.DEFAULT_FILE_UPLOAD_LIMIT,
        maxFileSize: config.DEFAULT_MAX_FILE_SIZE,
        fileSizeUnit: config.SIZE_UNIT_G,
        fileNameRestrictions: config.FILE_NAME_RESTRICTION,
        mimeTypeWhitelist: config.MIME_TYPE_WHITELIST,
    },
    requireOpenAccessStatus: false,
    isNtro: false,
    isAdmin: false,
};

export default React.memo(FileUploader);
