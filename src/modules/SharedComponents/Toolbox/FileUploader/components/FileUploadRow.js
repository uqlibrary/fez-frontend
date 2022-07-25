import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import withWidth from '@material-ui/core/withWidth';

import * as config from '../config';
import { ConfirmDialogBox } from '../../ConfirmDialogBox';

import FileUploadRowDefaultView from './FileUploadRowDefaultView';
import FileUploadRowMobileView from './FileUploadRowMobileView';

export class FileUploadRow extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool,
        fileUploadRowId: PropTypes.string,
        focusOnIndex: PropTypes.number,
        index: PropTypes.number.isRequired,
        locale: PropTypes.object,
        onDelete: PropTypes.func.isRequired,
        onAccessConditionChange: PropTypes.func,
        onEmbargoDateChange: PropTypes.func,
        onFileDescriptionChange: PropTypes.func,
        requireOpenAccessStatus: PropTypes.bool.isRequired,
        uploadedFile: PropTypes.object.isRequired,
        width: PropTypes.string,
        isAdmin: PropTypes.bool,
    };

    static defaultProps = {
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

    _showConfirmation = () => {
        if (this.confirmationBox) this.confirmationBox.showConfirmation();
    };

    _deleteFile = () => {
        !!this.props.onDelete && this.props.onDelete(this.props.uploadedFile, this.props.index);
    };

    calculateFilesizeToDisplay = size => {
        const exponent = Math.floor(Math.log(size) / Math.log(config.SIZE_BASE));
        return `${(size / Math.pow(config.SIZE_BASE, exponent)).toFixed(1)}${config.SIZE_UNITS[exponent]}`;
    };

    _updateAccessCondition = newValue => {
        this.props.onAccessConditionChange(this.props.uploadedFile, this.props.index, newValue);
    };

    _updateFileDescription = newValue => {
        this.props.onFileDescriptionChange(this.props.uploadedFile, this.props.index, newValue.target.value);
    };

    _updateEmbargoDate = newValue => {
        this.props.onEmbargoDateChange(this.props.uploadedFile, this.props.index, newValue);
    };

    render() {
        const { deleteRecordConfirmation } = this.props.locale;
        const { requireOpenAccessStatus, disabled, uploadedFile, index, focusOnIndex } = this.props;

        const accessConditionId = uploadedFile[config.FILE_META_KEY_ACCESS_CONDITION];
        const embargoDate = uploadedFile[config.FILE_META_KEY_EMBARGO_DATE];

        const FileUploadRowView = this.props.width === 'xs' ? FileUploadRowMobileView : FileUploadRowDefaultView;
        const fileUploadRowLocale =
            this.props.width === 'xs' ? this.props.locale.mobileView : this.props.locale.defaultView;

        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._deleteFile}
                    locale={deleteRecordConfirmation}
                    confirmDialogBoxId="dsi-dsid-delete"
                />
                <FileUploadRowView
                    index={index}
                    name={uploadedFile.name}
                    size={this.calculateFilesizeToDisplay(uploadedFile.size)}
                    accessConditionId={accessConditionId}
                    embargoDate={embargoDate}
                    requireOpenAccessStatus={requireOpenAccessStatus}
                    disabled={disabled}
                    onDelete={this._showConfirmation}
                    onAccessConditionChange={this._updateAccessCondition}
                    onFileDescriptionChange={this._updateFileDescription}
                    onEmbargoDateChange={this._updateEmbargoDate}
                    focusOnIndex={focusOnIndex}
                    locale={fileUploadRowLocale}
                    accessConditionLocale={this.props.locale.fileUploadRowAccessSelector}
                    fileUploadRowViewId={this.props.fileUploadRowId}
                    isAdmin={this.props.isAdmin}
                />
            </Fragment>
        );
    }
}

export default withWidth()(FileUploadRow);
