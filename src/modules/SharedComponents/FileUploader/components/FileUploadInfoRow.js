import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';

import {getByteConversion, getIcon} from './fileHelper';
import './FileUploadInfoRow.scss';

export default class FileUploadInfoRow extends PureComponent {

    static propTypes = {
        file: PropTypes.object.isRequired,
        showProgress: PropTypes.bool,
        uploadProgress: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {file, showProgress, uploadProgress} = this.props;
        return (
            <div className="fileSummary">
                <FontIcon
                    className="material-icons">{getIcon(file.type)}</FontIcon> {file.name} <span>({getByteConversion(file.size)})</span>
                {showProgress && (
                    <span className="uploadProgress">{uploadProgress}</span>
                )}
            </div>
        );
    }
}
