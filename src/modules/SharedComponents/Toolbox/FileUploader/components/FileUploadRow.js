import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import * as config from '../config';
import { ConfirmDialogBox } from '../../ConfirmDialogBox';

import FileUploadRowDefaultView from './FileUploadRowDefaultView';
import FileUploadRowMobileView from './FileUploadRowMobileView';
import { useWidth } from 'hooks';

export const FileUploadRow = ({
    disabled,
    rowCount,
    fileUploadRowId,
    focusOnIndex,
    index,
    locale,
    onDelete,
    onAccessConditionChange,
    onEmbargoDateChange,
    onOrderUpClick,
    onOrderDownClick,
    onFileDescriptionChange,
    onSecurityPolicyChange,
    requireOpenAccessStatus,
    uploadedFile,
    isAdmin,
}) => {
    const width = useWidth();
    const confirmationBox = React.useRef();

    const _showConfirmation = () => {
        /* istanbul ignore else */
        confirmationBox.current?.showConfirmation();
    };

    const _deleteFile = () => {
        !!onDelete && onDelete(uploadedFile, index);
    };

    const calculateFilesizeToDisplay = size => {
        const exponent = Math.floor(Math.log(size) / Math.log(config.SIZE_BASE));
        return `${(size / Math.pow(config.SIZE_BASE, exponent)).toFixed(1)}${config.SIZE_UNITS[exponent]}`;
    };

    const _updateAccessCondition = newValue => {
        onAccessConditionChange(uploadedFile, index, newValue);
    };

    const _updateFileDescription = newValue => {
        onFileDescriptionChange(uploadedFile, index, newValue.target.value);
    };
    const _updateSecurityPolicy = newValue => {
        onSecurityPolicyChange(uploadedFile, index, newValue);
    };

    const _updateEmbargoDate = newValue => {
        onEmbargoDateChange(uploadedFile, index, newValue);
    };
    const _onOrderUpClick = newIndex => {
        onOrderUpClick(index, newIndex);
    };
    const _onOrderDownClick = newIndex => {
        onOrderDownClick(index, newIndex);
    };

    const { deleteRecordConfirmation } = locale;

    const accessConditionId = uploadedFile[config.FILE_META_KEY_ACCESS_CONDITION];
    const embargoDate = uploadedFile[config.FILE_META_KEY_EMBARGO_DATE];
    const securityPolicy = uploadedFile[config.FILE_META_KEY_SECURITY_POLICY];

    const FileUploadRowView = width === 'xs' ? FileUploadRowMobileView : FileUploadRowDefaultView;
    const fileUploadRowLocale = width === 'xs' ? locale.mobileView : locale.defaultView;

    return (
        <Fragment>
            <ConfirmDialogBox
                onRef={ref => (confirmationBox.current = ref)}
                onAction={_deleteFile}
                locale={deleteRecordConfirmation}
                confirmDialogBoxId="dsi-dsid-delete"
            />
            <FileUploadRowView
                index={index}
                rowCount={rowCount}
                name={uploadedFile.name}
                size={calculateFilesizeToDisplay(uploadedFile.size)}
                accessConditionId={accessConditionId}
                embargoDate={embargoDate}
                securityPolicy={securityPolicy}
                requireOpenAccessStatus={requireOpenAccessStatus}
                disabled={disabled}
                onDelete={_showConfirmation}
                onAccessConditionChange={_updateAccessCondition}
                onOrderUpClick={_onOrderUpClick}
                onOrderDownClick={_onOrderDownClick}
                onFileDescriptionChange={_updateFileDescription}
                onEmbargoDateChange={_updateEmbargoDate}
                onSecurityPolicyChange={_updateSecurityPolicy}
                focusOnIndex={focusOnIndex}
                locale={fileUploadRowLocale}
                accessConditionLocale={locale.fileUploadRowAccessSelector}
                fileUploadRowViewId={fileUploadRowId}
                isAdmin={isAdmin}
            />
        </Fragment>
    );
};
FileUploadRow.propTypes = {
    disabled: PropTypes.bool,
    rowCount: PropTypes.number,
    fileUploadRowId: PropTypes.string,
    focusOnIndex: PropTypes.number,
    index: PropTypes.number.isRequired,
    locale: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
    onAccessConditionChange: PropTypes.func,
    onEmbargoDateChange: PropTypes.func,
    onOrderUpClick: PropTypes.func,
    onOrderDownClick: PropTypes.func,
    onFileDescriptionChange: PropTypes.func,
    onSecurityPolicyChange: PropTypes.func,
    requireOpenAccessStatus: PropTypes.bool.isRequired,
    uploadedFile: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool,
};

FileUploadRow.defaultProps = {
    locale: {
        deleteHint: 'Remove this file',
        deleteRecordConfirmation: {
            confirmationTitle: 'Delete file',
            confirmationMessage: 'Are you sure you want to remove this file from the uploaded queue?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
        filenameColumn: 'File name',
        fileAccessColumn: 'File access',
        embargoDateColumn: 'Embargo date',
        embargoDateClosedAccess: 'No date required',
        uploadInProgressText: 'Uploading...',
    },
};

export default React.memo(FileUploadRow);
