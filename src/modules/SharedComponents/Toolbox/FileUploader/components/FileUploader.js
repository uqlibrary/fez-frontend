import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearFileUpload } from '../actions';
import FileUploadDropzone from './FileUploadDropzone';
import FileUploadRowHeader from './FileUploadRowHeader';
import FileUploadRow from './FileUploadRow';
import FileUploadTermsAndConditions from './FileUploadTermsAndConditions';
import { Alert } from '../../Alert';
import Grid from '@mui/material/GridLegacy';
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

export class FileUploader extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        fileRestrictionsConfig: PropTypes.object,
        requireOpenAccessStatus: PropTypes.bool,
        clearFileUpload: PropTypes.func,
        disabled: PropTypes.bool,
        defaultQuickTemplateId: PropTypes.number,
        isNtro: PropTypes.bool,
        isAdmin: PropTypes.bool,
        fullyUploadedFiles: PropTypes.array,
    };

    static defaultProps = {
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
        fullyUploadedFiles: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            filesInQueue: [],
            isTermsAndConditionsAccepted: false,
            errorMessage: '',
        };
    }

    componentDidUpdate(prevProps, prevState) {
        // only call onChange if filesInQueue or isTermsAndConditionsAccepted has changed
        if (
            !!this.props.onChange &&
            (JSON.stringify(prevState.filesInQueue) !== JSON.stringify(this.state.filesInQueue) ||
                prevState.isTermsAndConditionsAccepted !== this.state.isTermsAndConditionsAccepted)
        ) {
            this.props.onChange({
                queue: this.state.filesInQueue,
                isValid: this.isFileUploadValid(this.state),
            });
        }
    }

    componentWillUnmount() {
        this.props.clearFileUpload();
    }

    /**
     * Delete file on a given index
     *
     * @param file
     * @param index
     * @private
     */
    _deleteFile = (file, index) => {
        const filesInQueue = [...this.state.filesInQueue.slice(0, index), ...this.state.filesInQueue.slice(index + 1)];

        this.setState({
            filesInQueue: filesInQueue,
            errorMessage: '',
            isTermsAndConditionsAccepted: this.state.isTermsAndConditionsAccepted && this.isAnyOpenAccess(filesInQueue),
        });
    };

    /**
     * Delete all files
     *
     * @private
     */
    _deleteAllFiles = () => {
        this.setState({
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
    _updateFileAccessCondition = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };

        file[config.FILE_META_KEY_ACCESS_CONDITION] = newValue;

        if (newValue === config.FILE_SECURITY_POLICY_PUBLIC) {
            file[config.FILE_META_KEY_EMBARGO_DATE] = moment().format();
        } else {
            file[config.FILE_META_KEY_EMBARGO_DATE] = null;
        }

        this.replaceFile(file, index);
    };

    _updateFileSecurityPolicy = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };

        file[config.FILE_META_KEY_SECURITY_POLICY] = newValue;

        if (newValue === config.FILE_SECURITY_POLICY_PUBLIC) {
            file[config.FILE_META_KEY_EMBARGO_DATE] = moment().format();
        } else {
            file[config.FILE_META_KEY_EMBARGO_DATE] = null;
        }

        this.replaceFile(file, index);
    };

    /**
     * Update file's embargo date
     *
     * @param fileToUpdate
     * @param index
     * @param newValue
     * @private
     */
    _updateFileEmbargoDate = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };

        file[config.FILE_META_KEY_EMBARGO_DATE] = moment(newValue).format();

        this.replaceFile(file, index);
    };

    /**
     * Update file's description
     *
     * @param fileToUpdate
     * @param index
     * @param newValue
     * @private
     */
    _updateFileDescription = (fileToUpdate, index, newValue) => {
        const file = { ...fileToUpdate };
        file[config.FILE_META_KEY_DESCRIPTION] = newValue;

        this.replaceFile(file, index);
    };

    /**
     * Accept terms and conditions
     *
     * @param event
     * @param value
     * @private
     */
    _acceptTermsAndConditions = value => {
        this.setState({ isTermsAndConditionsAccepted: value });
    };

    /**
     * Handle accepted, rejected and dropped folders and display proper alerts
     *
     * @param uniqueFilesToQueue
     * @param errorsFromDropzone
     */
    _handleDroppedFiles = (uniqueFilesToQueue, errorsFromDropzone) => {
        const { defaultQuickTemplateId } = this.props;
        const { filesInQueue } = this.state;

        // Combine unique files and files queued already
        const totalFiles = [...filesInQueue, ...uniqueFilesToQueue];

        // Set files to queue
        this.setState({
            filesInQueue: defaultQuickTemplateId
                ? totalFiles.map(file => ({ ...file, [config.FILE_META_KEY_ACCESS_CONDITION]: defaultQuickTemplateId }))
                : totalFiles,
            focusOnIndex: filesInQueue.length,
            errorMessage: getErrorMessage(errorsFromDropzone, this.props.locale, this.props.fileRestrictionsConfig),
        });
    };

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
    replaceFile = (file, index) => {
        const filesInQueue = [
            ...this.state.filesInQueue.slice(0, index),
            file,
            ...this.state.filesInQueue.slice(index + 1),
        ];

        this.setState({
            filesInQueue: filesInQueue,
            errorMessage: '',
            isTermsAndConditionsAccepted: this.state.isTermsAndConditionsAccepted && this.isAnyOpenAccess(filesInQueue),
        });
    };

    /**
     * Calculate max file size allowed by dropzone
     *
     * @returns {number}
     */
    calculateMaxFileSize = () => {
        const { maxFileSize, fileSizeUnit } = this.props.fileRestrictionsConfig;
        const exponent = config.SIZE_UNITS.indexOf(fileSizeUnit);
        return maxFileSize * Math.pow(config.SIZE_BASE, exponent >= 0 ? exponent : /* istanbul ignore next */ 0);
    };

    /**
     * Check if any file is open access
     *
     * @param files
     * @returns {boolean}
     */
    isAnyOpenAccess = files => {
        return (
            files.filter(
                file =>
                    file.hasOwnProperty(config.FILE_META_KEY_ACCESS_CONDITION) &&
                    file[config.FILE_META_KEY_ACCESS_CONDITION] === config.FILE_ACCESS_CONDITION_OPEN,
            ).length > 0
        );
    };

    /**
     * Check if any file has public security policy (admin only)
     *
     * @param files
     * @returns {boolean}
     */
    isAnySecurityPolicyPublic = files => {
        return (
            files.filter(
                file =>
                    file.hasOwnProperty(config.FILE_META_KEY_SECURITY_POLICY) &&
                    file[config.FILE_META_KEY_SECURITY_POLICY] === config.FILE_SECURITY_POLICY_PUBLIC,
            ).length > 0
        );
    };

    /**
     * Check if entire file uploader is valid including access conditions and t&c
     *
     * @param filesInQueue
     * @param isTermsAndConditionsAccepted
     * @returns {boolean}
     */
    isFileUploadValid = ({ filesInQueue, isTermsAndConditionsAccepted }) => {
        return (
            !this.props.requireOpenAccessStatus ||
            (filesInQueue.filter(file => file.hasOwnProperty(config.FILE_META_KEY_ACCESS_CONDITION)).length ===
                filesInQueue.length &&
                ((this.isAnyOpenAccess(filesInQueue) &&
                    !this.isAnyEmbargoDateInvalid(filesInQueue) &&
                    isTermsAndConditionsAccepted) ||
                    !this.isAnyOpenAccess(filesInQueue))) ||
            (filesInQueue.filter(file => file.hasOwnProperty(config.FILE_META_KEY_SECURITY_POLICY)).length ===
                filesInQueue.length &&
                ((this.isAnySecurityPolicyPublic(filesInQueue) && isTermsAndConditionsAccepted) ||
                    !this.isAnySecurityPolicyPublic(filesInQueue)))
        );
    };

    /**
     * @param filesInQueue
     * @return {boolean}
     */
    isAnyEmbargoDateInvalid = filesInQueue => {
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

    render() {
        const { instructions, accessTermsAndConditions, ntroSpecificInstructions } = this.props.locale;
        const { maxFileSize, fileSizeUnit, fileUploadLimit, fileNameRestrictions, mimeTypeWhitelist } =
            this.props.fileRestrictionsConfig;
        const { requireOpenAccessStatus, defaultQuickTemplateId, disabled } = this.props;
        const { filesInQueue, isTermsAndConditionsAccepted, errorMessage } = this.state;
        const { errorTitle, successTitle, successMessage, delayNotice, delayMessage } = this.props.locale;

        const instructionsDisplay = instructions
            .replace('[fileUploadLimit]', fileUploadLimit)
            .replace('[maxFileSize]', `${maxFileSize}`)
            .replace('[fileSizeUnit]', fileSizeUnit === config.SIZE_UNIT_B ? config.SIZE_UNIT_B : `${fileSizeUnit}B`);

        const filesInQueueRow = filesInQueue
            .sort((a, b) => {
                return a.name < b.name ? -1 : 1;
            })
            .map((file, index) => {
                return (
                    <FileUploadRow
                        key={file.name}
                        fileUploadRowId={`fez-datastream-info-list-row-${index}`}
                        rowCount={this.state.filesInQueue.length}
                        index={index}
                        uploadedFile={file}
                        fileSizeUnit={fileSizeUnit}
                        onDelete={this._deleteFile}
                        onAccessConditionChange={this._updateFileAccessCondition}
                        onEmbargoDateChange={this._updateFileEmbargoDate}
                        onFileDescriptionChange={this._updateFileDescription}
                        onSecurityPolicyChange={this._updateFileSecurityPolicy}
                        defaultAccessCondition={defaultQuickTemplateId}
                        requireOpenAccessStatus={requireOpenAccessStatus && !defaultQuickTemplateId}
                        disabled={disabled}
                        focusOnIndex={this.state.focusOnIndex}
                        locale={this.props.locale.fileUploadRow}
                        isAdmin={this.props.isAdmin}
                    />
                );
            });

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                        {instructionsDisplay}
                    </Typography>
                    {this.props.isNtro && (
                        <Typography variant="body2" gutterBottom>
                            {ntroSpecificInstructions}
                        </Typography>
                    )}
                    <FileUploadDropzone
                        locale={this.props.locale}
                        maxSize={this.calculateMaxFileSize()}
                        disabled={disabled}
                        filesInQueue={this.state.filesInQueue.map(file => file.name)}
                        fileNameRestrictions={fileNameRestrictions}
                        mimeTypeWhitelist={mimeTypeWhitelist}
                        fileUploadLimit={fileUploadLimit}
                        onDrop={this._handleDroppedFiles}
                    />
                </Grid>
                {filesInQueue.length > 0 && (
                    <Fragment>
                        <Grid item xs={12}>
                            <Alert
                                title={successTitle}
                                message={successMessage.replace('[numberOfFiles]', filesInQueue.length)}
                                type="done"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Alert title={delayNotice} message={delayMessage} type="warning" />
                        </Grid>
                    </Fragment>
                )}
                {errorMessage.length > 0 && (
                    <Grid item xs={12}>
                        <Alert title={errorTitle} message={errorMessage} type="error" />
                    </Grid>
                )}
                {filesInQueue.length > 0 && (
                    <Fragment>
                        <Grid item xs={12}>
                            <FileUploadRowHeader
                                onDeleteAll={this._deleteAllFiles}
                                requireOpenAccessStatus={requireOpenAccessStatus && !defaultQuickTemplateId}
                                disabled={disabled}
                                isAdmin={this.props.isAdmin}
                            />
                        </Grid>
                        <Grid item xs={12} data-testid="fez-datastream-info-list">
                            {filesInQueueRow}
                        </Grid>
                        {requireOpenAccessStatus &&
                            (this.isAnyOpenAccess(filesInQueue) || this.isAnySecurityPolicyPublic(filesInQueue)) && (
                                <Grid item xs={12}>
                                    <FileUploadTermsAndConditions
                                        onAcceptTermsAndConditions={this._acceptTermsAndConditions}
                                        accessTermsAndConditions={accessTermsAndConditions}
                                        isTermsAndConditionsAccepted={isTermsAndConditionsAccepted}
                                        disabled={disabled}
                                    />
                                </Grid>
                            )}
                    </Fragment>
                )}
            </Grid>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        clearFileUpload: () => dispatch(clearFileUpload()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileUploader);
