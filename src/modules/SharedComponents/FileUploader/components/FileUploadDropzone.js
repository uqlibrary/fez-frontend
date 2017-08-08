import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
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
        this.accepted = [];
    }

    componentWillReceiveProps(nextProps) {
        this.accepted = nextProps.uploadedFiles;
    }

    _onDropAccepted = (accepted) => {
        /**
         * Filter folders
         */
        const invalid = accepted.filter((file) => {
            return file.type === '' ||                          // no type means folder
                file.name.length > 45 ||                        // check for filename length
                _.split(file.name, '.').length > 2;             // check for more than one period
        });

        if (invalid.length > 0) {
            console.log('Error');
        }

        const filtered = _.difference(accepted, invalid);

        this.accepted.push(...filtered);

        /**
         * Filter duplicates
         */
        const unique = _.uniqBy(this.accepted, 'name');

        this.props.onDropped(unique);
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

