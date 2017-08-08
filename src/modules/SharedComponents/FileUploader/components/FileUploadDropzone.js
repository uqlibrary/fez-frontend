import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import FileUploadDropzoneStaticContent from './FileUploadDropzoneStaticContent';

class FileUploadDropzone extends PureComponent {
    static propTypes = {
        onDropped: PropTypes.func.isRequired,
        maxSize: PropTypes.number.isRequired,
        uploadedFiles: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.dropzoneRef = null;
        this.accepted = new Set();
    }

    componentWillReceiveProps(nextProps) {
        this.accepted = new Set([...nextProps.uploadedFiles]);
    }

    _difference = (accepted, rejected) => {
        return new Set([...accepted].filter(file => !rejected.has(file)));
    };

    _union = (accepted, filtered) => {
        return new Set([...accepted, ...filtered]);
    };

    _onDropAccepted = (accepted) => {
        /**
         * Filter folders
         */
        const rejected = accepted.filter((file) => {
            return file.type === '' ||                          // no type means folder
                file.name.length > 45 ||                        // check for filename length
                file.name.split('.').length > 2;                // check for more than one period
        });

        if (rejected.length > 0) {
            console.log('Error');
        }

        /**
         * Remove rejected files
         */
        const filtered = this._difference(new Set(accepted), new Set(rejected));

        /**
         * Duplicates will be removed as a result of default Set behavior
         */
        this.accepted = this._union(this.accepted, filtered);

        this.props.onDropped([...this.accepted]);
    };

    render() {
        return (
            <div className="columns" style={{ marginTop: '12px' }}>
                <div className="column"  tabIndex="0" onKeyPress={ () => this.dropzoneRef.open() }>
                    <Dropzone
                        ref={ (node) => { this.dropzoneRef = node; }}
                        maxSize={ this.props.maxSize }
                        onDropAccepted={ this._onDropAccepted.bind(this) }
                        style={{ padding: '10px' }}
                        disablePreview>
                        <FileUploadDropzoneStaticContent />
                    </Dropzone>
                </div>
            </div>
        );
    }
}

export default FileUploadDropzone;

