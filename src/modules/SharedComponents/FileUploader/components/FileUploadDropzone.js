import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import FileUploadDropzoneStaticContent from './FileUploadDropzoneStaticContent';
import FileUploadErrorMessage from './FileUploadErrorMessage';

class FileUploadDropzone extends PureComponent {
    static propTypes = {
        onDropped: PropTypes.func.isRequired,
        maxSize: PropTypes.number.isRequired,
        maxFiles: PropTypes.number.isRequired,
        uploadedFiles: PropTypes.array,
        locale: PropTypes.object
    };

    static defaultProps = {
        locale: {
            validation: {
                single: {
                    ['folder']: 'Invalid file ([filename]) (Folder can not be uploaded)',
                    ['fileName']: 'Invalid file name ([filename])',
                    ['fileNameLength']: 'Filename ([filename]) is too long',
                    ['maxFileSize']: 'File ([filename]) is too big',
                    ['maxFiles']: 'Only [maxNumberOfFiles] files are allowed to be uploaded. File ([filename]) ignored'
                },
                multiple: {
                    ['folder']: 'Invalid files ([filenames]) (Folders can not be uploaded)',
                    ['fileName']: '[numberOfFiles] ([filenames]) have an invalid file name',
                    ['fileNameLength']: '[numberOfFiles] filenames ([filenames]) are too long',
                    ['maxFileSize']: '[numberOfFiles] files ([filenames]) are too big',
                    ['maxFiles']: 'Only [maxNumberOfFiles] files are allowed to be uploaded.  Files ([filenames]) ignored'
                }
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: []
        };
        this.dropzoneRef = null;
        this.accepted = new Set();
        this.errors = new Map();

        this.onDrop.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.accepted = new Set([...nextProps.uploadedFiles]);
    }

    /**
     * Diff of two sets
     *
     * @todo Move it to a better place to re-use
     * @param accepted
     * @param rejected
     * @returns {Set}
     * @private
     */
    _difference = (accepted, rejected) => {
        return new Set([...accepted].filter(file => !rejected.has(file)));
    };

    /**
     * Union of two sets
     *
     * @todo Move it to a better place to re-use
     * @param accepted
     * @param filtered
     * @returns {Set}
     * @private
     */
    _union = (accepted, filtered) => {
        return new Set([...accepted, ...filtered]);
    };

    /**
     * Validate file
     *
     * @param file
     * @returns {boolean}
     * @private
     */
    _validate = (file) => {
        const type = file.type === '';
        if (type) {
            this._setError('folder', file);
        }

        const length = file.name.length > 45;
        if (length) {
            this._setError('fileNameLength', file);
        }

        const period = file.name.split('.').length > 2;
        if (period) {
            this._setError('fileName', file);
        }

        return type || length || period;
    };

    /**
     * Set file/s error for given errorType
     *
     * @param errorType
     * @param file
     * @private
     */
    _setError = (errorType, file) => {
        let files;
        if (!(file instanceof Array)) {
            files = [file];
        } else {
            files = file;
        }
        files.map(file => this.errors.set(errorType, this.errors.get(errorType) ? [...this.errors.get(errorType), file] : [file]));
    };

    /**
     * Process errors
     *
     * @private
     */
    _processErrors = () => {
        const { single, multiple } = this.props.locale.validation;
        const errorMessages = [];
        let message;

        for (const [errorCode, files] of this.errors.entries()) {
            const fileNames = [];
            files.map((file) => {
                fileNames.push(file.name);
            });

            if (files.length > 1) {
                message = multiple[errorCode]
                    .replace('[numberOfFiles]', files.length)
                    .replace('[filenames]', fileNames.join(', '));
            } else if (files.length === 1) {
                message = single[errorCode].replace('[filename]', fileNames.join(', '));
            }

            if (errorCode === 'maxFiles') {
                errorMessages.push(message.replace('[maxNumberOfFiles]', this.props.maxFiles));
            } else {
                errorMessages.push(message);
            }
        }

        this.setState({
            errorMessage: errorMessages
        });

        this._resetErrors();
    };

    /**
     * Reset errors
     *
     * @private
     */
    _resetErrors = () => {
        this.errors = new Map();
    };

    /**
     * Handle accepted and rejected files on dropped in Dropzone
     *
     * @param accepted
     * @param rejected
     * @private
     */
    onDrop = (accepted, rejected) => {
        /*
         * Set error for rejected files (maxFileSize rule)
         */
        if (rejected.length > 0) {
            this._setError('maxFileSize', rejected);
        }

        /*
         * Validate accepted files and get list of invalid files (check fileName, fileNameLength, folder)
         */
        const invalid = accepted.filter((file) => {
            return this._validate(file);
        });

        /*
         * Remove invalid files
         */
        const filtered = this._difference(new Set(accepted), new Set(invalid));

        /*
         * Duplicates will be removed by default behavior of ES6 Set
         */
        this.accepted = this._union(this.accepted, filtered);

        /*
         * If max files uploaded, get ignored files
         */
        let acceptedMaxFiles;
        if (this.accepted.size > this.props.maxFiles) {
            acceptedMaxFiles = [...this.accepted].slice(0, this.props.maxFiles);
            this._setError('maxFiles', [...this._difference(this.accepted, new Set(acceptedMaxFiles))]);
        } else {
            acceptedMaxFiles = [...this.accepted];
        }

        /*
         * Send max number of files to parent component
         */
        this.props.onDropped(acceptedMaxFiles);

        /*
         * Process any errors
         */
        this._processErrors();
    };

    render() {
        return (
            <div>
                <div className="columns" style={{ marginTop: '12px' }}>
                    <div className="column"  tabIndex="0" onKeyPress={ () => this.dropzoneRef.open() }>
                        <Dropzone
                            ref={ (node) => { this.dropzoneRef = node; }}
                            maxSize={ this.props.maxSize }
                            onDrop={ this.onDrop }
                            style={{ padding: '10px' }}
                            disablePreview>
                            <FileUploadDropzoneStaticContent />
                        </Dropzone>
                    </div>
                </div>

                {
                    this.state.errorMessage.length > 0 && (
                        <FileUploadErrorMessage error={ this.state.errorMessage } />
                    )
                }
            </div>
        );
    }
}

export default FileUploadDropzone;

