import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {SelectField} from 'uqlibrary-react-toolbox';
import {Checkbox} from 'uqlibrary-react-toolbox';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import {Field} from 'redux-form/immutable';

// custom components
import {locale} from 'config';
import {validation} from 'config';

let fileUploadProgress = [];

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

        this.firstRowTarget = '';
        this.state = {
            isOpenAccess: false,
            accessFields: [],
            completed: 0,
            deleteSingleFile: true,
            deleteFileIndex: -1,
            deleteDialogContent: '',
            deleteDialogOpen: false
        };

        fileUploadProgress = [];

        this.isOpenAccess = false;
    }

    componentDidMount() {
        this.focusOnFirstRow();
    }

    componentWillUpdate(nextProps) {
        const {uploadProgress} = nextProps;

        if (uploadProgress) {
            fileUploadProgress[uploadProgress.get('name')] = parseInt(uploadProgress.get('progress'), 10);
        }
    }

    componentDidUpdate() {
        this.focusOnFirstRow();
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

        this.isOpenAccess = false;

        return(
            acceptedFiles.map((file, index) => {
                console.log(file);
                const fieldName = `${file}${index}`;
                const selectFieldName = `${fileInformation.fields.fileAccess}${file.name}`;
                const accessIds = fileInformation.constants;

                if (index === 0) {
                    this.firstRowTarget = `${fileInformation.formSectionPrefix}.${selectFieldName}`;
                }

                this.isOpenAccess = this.isOpenAccess || this.state.accessFields[selectFieldName] === accessIds.openAccessId;

                return (
                    <div className="columns is-gapless data metadata-container" key={fieldName}>
                        <div className="column is-6-desktop is-6-tablet is-12-mobile filename">
                            <FontIcon className="material-icons mobile-icon">attachment</FontIcon>
                            <span className="filename-label">{file.name}</span>
                            <span className="label">File name</span>
                        </div>
                        <div className="column is-3-desktop is-3-tablet is-8-mobile file-access">
                            <FontIcon className="material-icons mobile-icon">lock_outline</FontIcon>
                            {this.buildSelectField(file.name)}
                            <span className="label">File Access</span>
                        </div>
                        <div className="column is-2-desktop is-2-tablet is-8-mobile embargo-date">
                            <FontIcon className="material-icons mobile-icon">date_range</FontIcon>

                            {this.state.accessFields[selectFieldName] === accessIds.openAccessId && (
                                this.buildDatePicker(file.name)
                            )}

                            {this.state.accessFields[selectFieldName] !== accessIds.openAccessId && (
                                <div className="datepicker">{messages.noDate}</div>
                            )}

                            <span className="label">Embargo Date</span>

                            {fileUploadProgress[file.name] && (
                                ((fileUploadProgress[file.name] < locale.sharedComponents.files.constants.completed) ||
                                    fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed && uploadError.length > 0) &&
                                <div className="upload-progress-wrapper">
                                    <CircularProgress
                                        className="upload-progress"
                                        mode="determinate"
                                        value={fileUploadProgress[file.name]}
                                        size={30}
                                        thickness={4}
                                    />
                                </div>
                            )}
                            {fileUploadProgress[file.name] && (
                                (fileUploadProgress[file.name] === locale.sharedComponents.files.constants.completed) && uploadError.length === 0 &&
                                <FontIcon className="material-icons green-tick">done</FontIcon>
                            )}
                        </div>
                        <div className="column is-1-desktop is-1-tablet is-1-mobile delete-button">
                            <IconButton
                                tooltip={messages.deleteFileToolTip}
                                tooltipPosition="bottom-left"
                                onClick={() => this.deleteFileConfirmation(index)}>
                                <FontIcon className="material-icons deleteIcon">delete</FontIcon>
                            </IconButton>
                        </div>
                    </div>
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

    focusOnFirstRow = () => {
        const firstRow = document.getElementsByName(this.firstRowTarget)[0];
        firstRow.getElementsByTagName('button')[0].focus();
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
                <div className="columns is-gapless headers">
                    <div className="column is-6-desktop is-6-tablet is-12-mobile filename header" style={{textIndent: '12px'}}>
                        {fileInformation.list.filenameLabel}
                    </div>
                    <div className="column is-3-desktop is-3-tablet is-12-mobile file-access header">
                        {fileInformation.list.fileAccessLabel}
                    </div>
                    <div className="column is-2-desktop is-2-tablet is-12-mobile embargo-date header">
                        {fileInformation.list.embargoDateLabel}
                    </div>
                    <div className="column is-1-desktop is-1-tablet is-12-mobile delete-button header">
                        <IconButton
                            tooltip={messages.deleteAllFilesToolTip}
                            tooltipPosition="bottom-left"
                            onClick={this.deleteAllFilesConfirmation}>
                            <FontIcon className="material-icons deleteIcon">delete_forever</FontIcon>
                        </IconButton>
                    </div>
                </div>
                {this.buildInterface()}

                {this.isOpenAccess && (
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
