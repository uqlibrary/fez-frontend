import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import FileUploadDropzone from './FileUploadDropzone';
import FileUploadRowHeader from './FileUploadRowHeader';
import FileUploadRow from './FileUploadRow';
import './FileUpload.scss';

export default class FileUploader extends PureComponent {

    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        defaultConfig: PropTypes.object
    };

    static defaultProps = {
        locale: {
            instructions: 'You may add up to [fileUploadLimit] files (max [maxFileSize][fileSizeUnit] each)',
            sizeExponent: {
                ['B']: 0,
                ['K']: 1,
                ['M']: 2,
                ['G']: 3
            },
            sizeUnitText: {
                ['B']: 'B',
                ['K']: 'KB',
                ['M']: 'MB',
                ['G']: 'GB'
            }
        },
        defaultConfig: {
            fileUploadLimit: 10,
            maxFileSize: 5,
            fileSizeUnit: 'G'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            uploadedFiles: [],
            clearErrors: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange)  this.props.onChange(nextState.uploadedFiles);
    }

    deleteFile = (file, index) => {
        this.setState({
            uploadedFiles: this.state.uploadedFiles.filter((_, i) => i !== index),
            clearErrors: true
        });
    };

    deleteAllFiles = () => {
        this.setState({ uploadedFiles: [], clearErrors: true });
    };

    setUploadedFiles = (files) => {
        this.setState({ uploadedFiles: [...files], clearErrors: false });
    };

    _calculateMaxFileSize = () => {
        const { sizeExponent } = this.props.locale;
        const { maxFileSize, fileSizeUnit } = this.props.defaultConfig;
        return maxFileSize * Math.pow(1000, sizeExponent[fileSizeUnit] || 0);
    };

    render() {
        const { instructions, sizeUnitText } = this.props.locale;
        const { maxFileSize, fileSizeUnit, fileUploadLimit } = this.props.defaultConfig;

        const instructionsDisplay = instructions
            .replace('[fileUploadLimit]', fileUploadLimit)
            .replace('[maxFileSize]', `${maxFileSize}`)
            .replace('[fileSizeUnit]', sizeUnitText[fileSizeUnit] || 'B');

        const uploadedFilesRow = this.state.uploadedFiles.map((file, index) => {
            return <FileUploadRow key={ index } index={ index } uploadedFile={ file } onDelete={ this.deleteFile } />;
        });

        return (
            <div>
                <h4 className="sub-title">{ instructionsDisplay }</h4>
                <FileUploadDropzone
                    maxSize={ this._calculateMaxFileSize() }
                    maxFiles={ fileUploadLimit }
                    onDropped={ this.setUploadedFiles }
                    uploadedFiles={ this.state.uploadedFiles }
                    clearErrors={ this.state.clearErrors } />

                {
                     this.state.uploadedFiles.length > 0 && (
                        <FileUploadRowHeader onDeleteAll={ this.deleteAllFiles } />
                     )
                }

                { uploadedFilesRow }
            </div>
        );
    }
}
