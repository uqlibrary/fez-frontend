import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {locale} from 'config';
import './FileUploadSummary.scss';
import FileUploadInfoRow from './FileUploadInfoRow';

const fileUploadProgress = [];

export default class FileUploadSummary extends Component {

    static propTypes = {
        acceptedFiles: PropTypes.array.isRequired,
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
            file.progress = fileUploadProgress[file.name];
            return (
                <FileUploadInfoRow key={file.name} file={file} showProgress={showProgress} />
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
