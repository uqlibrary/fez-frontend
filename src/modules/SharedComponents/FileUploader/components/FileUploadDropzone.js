import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { locale } from 'config';

class FileUploadDropzone extends PureComponent {
    static propTypes = {
        onFileDropped: PropTypes.func.isRequired
    };

    _onFileDropped = (files) => {
        this.props.onFileDropped(files);
    };

    render() {
        const { filenameRestrictions } = locale.sharedComponents.files.fileInformation.fields;
        let dropzoneRef;

        return (
            <div className="columns" style={{ marginTop: '12px' }}>
                <div className="column"  tabIndex="0" onKeyPress={ () => dropzoneRef.open() }>
                    <Dropzone
                        ref={ (node) => {dropzoneRef = node;} }
                        onDrop={ this._onFileDropped }
                        style={{ padding: '10px' }}
                        disablePreview>
                        { filenameRestrictions }
                    </Dropzone>
                </div>
            </div>
        );
    }
}

export default FileUploadDropzone;

