import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

export default class FileUploadInfoRow extends Component {

    static propTypes = {
        showProgress: PropTypes.bool,
        file: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    formatBytes = (bytes, decimals) => {
        if(bytes === 0) return '0 Bytes';

        const kb = 1000;
        const dm = decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const result = Math.floor(Math.log(bytes) / Math.log(kb));

        return parseFloat((bytes / Math.pow(kb, result)).toFixed(dm)) + ' ' + sizes[result];
    };

    getIcon = (mimeType) => {
        switch(mimeType) {
            case 'application/pdf':
                return 'movie';
            case 'image/jpeg':
            case 'image/pjpeg':
            case 'image/x-png':
            case 'image/png':
            case 'image/gif':
                return 'photo';
            default:
                return 'insert_drive_file';
        }
    };

    render() {
        const {file, showProgress} = this.props;
        return (
            <div>
                <FontIcon
                    className="material-icons">{this.getIcon(file.type)}</FontIcon> {file.name} <span>({this.formatBytes(file.size)})</span>
                {showProgress && (
                    <span className="uploadProgress">{file.progress}</span>
                )}
            </div>
        );
    }
}
