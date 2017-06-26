import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {Checkbox, SelectField} from 'uqlibrary-react-toolbox';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import {Field} from 'redux-form/immutable';

// custom components
import {locale} from 'config';
import './FileMetadata.scss';
import {validation} from 'config';

const fileUploadProgress = [];

export default class FileMetadata extends Component {

    static propTypes = {
        acceptedFiles: PropTypes.object.isRequired,
        deleteAllFiles: PropTypes.func,
        deleteFile: PropTypes.func,
        setCheckboxState: PropTypes.func,
        uploadError: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpenAccess: false,
            accessFields: [],
            completed: 0,
            deleteSingleFile: true,
            deleteFileIndex: -1,
            deleteDialogContent: '',
            deleteDialogOpen: false
        };
    }

    componentWillUpdate(nextProps) {
        const {uploadProgress} = nextProps;

        if (uploadProgress) {
            fileUploadProgress[uploadProgress.get('name')] = uploadProgress.get('progress');
        }
    }

    buildDatePicker = (id) => {
        const DateTimeFormat = global.Intl.DateTimeFormat;
        const currentDate = new Date();
        const currentDateStr = `${currentDate.getUTCDate()}/${currentDate.getUTCMonth() + 1}/${currentDate.getUTCFullYear()}`;
        const fileInformation = locale.sharedComponents.files;
        const datepickerFieldName = `${fileInformation.fields.datepickerAccess}${id}`;

        return (
        <DatePicker
            className="datepicker"
            DateTimeFormat={DateTimeFormat}
            firstDayOfWeek={0}
            hintText={currentDateStr}
            locale="en-AU"
            name={datepickerFieldName}
            menuItemStyle={{width: '90px'}}
        />);
    };

    buildSelectField = (id) => {
        const fileInformation = locale.sharedComponents.files;
        const fieldName = `${fileInformation.fields.fileAccess}${id}`;
        const accessIds = fileInformation.constants;
        const selectFieldValues = fileInformation.fields.selectField;

        return(
            <Field
                autoWidth
                component={SelectField}
                className="selectField"
                hintText={selectFieldValues.initialValue}
                key={fieldName}
                name={fieldName}
                onChange={this.updateLocalState(fieldName)}
                value={this.state.accessFields[fieldName] || null}
                validate={[validation.required]}
            >
                <MenuItem value={null} primaryText={selectFieldValues.initialValue} />
                <MenuItem value={accessIds.openAccessId} primaryText={selectFieldValues.openAccessValue} />
                <MenuItem value={accessIds.closedAccessId} primaryText={selectFieldValues.closedAccessValue} />
            </Field>
        );
    };

    buildInterface = () => {
        const {acceptedFiles, uploadError} = this.props;
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        return(
            acceptedFiles.map((file, index) => {
                const fieldName = `${file}${index}`;
                const selectFieldName = `${fileInformation.fields.fileAccess}${index}`;
                const accessIds = fileInformation.constants;

                return (
                    <Toolbar className="columns" key={fieldName}>
                        <ToolbarGroup className="column is-half-tablet filename">
                            <FontIcon className="material-icons mobile-icon">attachment</FontIcon>
                            <span className="filename-label">{file.name}</span>
                        </ToolbarGroup>
                        <ToolbarGroup className="column file-access">
                            <FontIcon className="material-icons mobile-icon">lock_outline</FontIcon>
                            <span className="label">File Access</span>
                            {this.buildSelectField(index)}
                        </ToolbarGroup>
                        <ToolbarGroup className="column embargo-date">
                            <FontIcon className="material-icons mobile-icon">date_range</FontIcon>
                            <span className="label">Embargo Date</span>

                            {this.state.accessFields[selectFieldName] === accessIds.openAccessId && (
                                this.buildDatePicker(index)
                            )}

                            {this.state.accessFields[selectFieldName] !== accessIds.openAccessId && (
                                <div>{messages.noDate}</div>
                            )}

                            {fileUploadProgress[file.name] && (
                                ((fileUploadProgress[file.name] < locale.sharedComponents.files.constants.completed) ||
                                fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed && uploadError.length > 0) &&
                                <CircularProgress
                                    className="upload-progress"
                                    mode="determinate"
                                    value={fileUploadProgress[file.name]}
                                    size={30}
                                    thickness={4}
                                />
                            )}

                            {fileUploadProgress[file.name] && (
                                (fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed) && uploadError.length === 0 &&
                                <FontIcon
                                className="material-icons green-tick">done</FontIcon>
                            )}
                        </ToolbarGroup>
                        <ToolbarGroup className="column is-narrow">
                            <IconButton
                                tooltip={messages.deleteFileToolTip}
                                tooltipPosition="bottom-left"
                                onClick={() => this.deleteFileConfirmation(index)}>
                                <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                );
            })
        );
    };

    deleteFileAction = () => {
        if (this.state.deleteSingleFile) {
            this.props.deleteFile(this.state.deleteFileIndex);
        } else {
            this.props.deleteAllFiles();
        }

        this.handleClose();
    };

    deleteAllFilesConfirmation = () => {
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        this.setState({
            deleteSingleFile: false,
            deleteFileIndex: -1,
            deleteDialogOpen: true,
            deleteDialogContent: messages.deleteAllFilesDialogContent
        });
    };

    deleteFileConfirmation = (index) => {
        const fileInformation = locale.sharedComponents.files;
        const messages = fileInformation.messages;

        this.setState({
            deleteSingleFile: true,
            deleteFileIndex: index,
            deleteDialogOpen: true,
            deleteDialogContent: messages.deleteFileDialogContent
        });
    };

    handleClose = () => {
        this.setState({
            deleteAction: '',
            deleteFileIndex: -1,
            deleteDialogOpen: false,
            deleteDialogContent: ''
        });
    };

    isOpenAccessSelected = () => {
        let found = false;
        Object.keys(this.state.accessFields).map(field => {
            if (this.state.accessFields[field] === locale.sharedComponents.files.constants.openAccessId) {
                found = true;
            }
        });

        return found;
    };

    updateLocalState = (fieldName) => (event, value) => {
        const data = this.state.accessFields;
        data[fieldName] = value;

        this.setState({accessFields: data});
        this.setState({isOpenAccess: this.isOpenAccessSelected()});
    };

    render() {
        const fileInformation = locale.sharedComponents.files;
        const buttonLabels = locale.global.labels.buttons;
        const messages = fileInformation.messages;

        const deleteActions = [
            <FlatButton
                label={buttonLabels.cancel}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label={buttonLabels.delete}
                secondary
                keyboardFocused
                style={{marginLeft: '12px'}}
                onTouchTap={this.deleteFileAction}
            />,
        ];

        return (
            <div className="metadata-container">
                <Dialog
                    actions={deleteActions}
                    modal={false}
                    open={this.state.deleteDialogOpen}
                    onRequestClose={this.handleClose}
                >
                    {this.state.deleteDialogContent}
                </Dialog>
                <Toolbar className="columns">
                    <ToolbarGroup className="column is-half-tablet filename header">
                        {fileInformation.list.filenameLabel}
                    </ToolbarGroup>
                    <ToolbarGroup className="column file-access header">
                        {fileInformation.list.fileAccessLabel}
                    </ToolbarGroup>
                    <ToolbarGroup className="column embargo-date header">
                        {fileInformation.list.embargoDateLabel}
                    </ToolbarGroup>
                    <ToolbarGroup className="column is-narrow">
                        <IconButton
                            tooltip={messages.deleteAlslFilesToolTip}
                            tooltipPosition="bottom-left"
                            onClick={this.deleteAllFilesConfirmation}>
                            <FontIcon className="material-icons deleteIcon">delete_sweep</FontIcon>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                {this.buildInterface()}

                {this.state.isOpenAccess && (
                    <Field
                        component={Checkbox}
                        name="acceptOpenAccess"
                        className="open-access-checkbox"
                        label={messages.openAccessConfirmation}
                        validate={[validation.required]}
                    />
                )}
            </div>
        );
    }
}
