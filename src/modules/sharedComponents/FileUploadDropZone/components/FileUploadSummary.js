import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

// custom components
import {locale} from 'config';
import './FileUploadSummary.scss';
import FileUploadInfoRow from './FileUploadInfoRow';

const fileUploadProgress = [];

export default class FileUploadSummary extends PureComponent {

    static propTypes = {
        acceptedFiles: PropTypes.array.isRequired,
        form: PropTypes.string.isRequired,
        showProgress: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    componentWillUpdate(nextProps) {
        fileUploadProgress[nextProps.uploadProgress.get('name')] = nextProps.uploadProgress.get('progress');
    }

    render() {
        const {
            showProgress,
            acceptedFiles
        } = this.props;

        const fileInformation = locale.sharedComponents.files;
        const filesToUpload = acceptedFiles.map(file => {
            return (
                <FileUploadInfoRow key={file.name} file={file} uploadProgress={fileUploadProgress[file.name]} showProgress={showProgress} />
            );
        });

        return (
            <div>
                <div className="columns">
                    <div className="column">
                        <h3>{fileInformation.fields.title}</h3>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        {filesToUpload}
                    </div>
                </div>
                {!showProgress && (
                <div className="columns">
                    <div className="column">
                        {fileInformation.dialog.disclaimer}
                    </div>
                </div>
                )}
            </div>
        );
    }
}
