import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {pathConfig} from 'config/routes';
import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import PictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';

export default class fileName extends PureComponent {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        thumbnailFileName: PropTypes.string,
        previewFileName: PropTypes.string,
        mimeType: PropTypes.string,
        openAccess: PropTypes.bool,
        handleFileNameClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    renderFileIcon = (pid, mimeType, thumbnailFileName) => {
        if (thumbnailFileName) {
            return <img src={this.getUrl(pid, thumbnailFileName)} />;
        }

        if (this.isAudio()) {
            return <AvVolumeUp />;
        }

        if (this.isPdf()) {
            return <PictureAsPdf />;
        }

        return <InsertDriveFile />;
    }

    renderAudioPlayer = (pid, fileName, mimeType) => {
        return (
            <span className={'filePlayer'}>
                <audio controls>
                    <source src={this.getUrl(pid, fileName)} type={mimeType} />
                </audio>
            </span>
        );
    }

    isAudio = () => {
        return this.props.mimeType.indexOf('audio') === 0;
    }

    isPdf = () => {
        return this.props.mimeType.indexOf('application/pdf') === 0;
    }

    isVideo = () => {
        return this.props.mimeType.indexOf('video') === 0;
    }

    isImage = () => {
        return this.props.mimeType.indexOf('image') === 0;
    }

    canShowPreview = () => {
        return (this.isImage() || this.isVideo());
    }

    getUrl = (pid, fileName) => {
        return pathConfig.file.url(pid, fileName);
    }

    handleFileNameClick = (e) => {
        e.preventDefault();
        const url = this.getUrl(this.props.pid, this.props.previewFileName || this.props.fileName);
        if (this.canShowPreview()) {
            this.props.handleFileNameClick(url, this.props.mimeType);
        } else {
            window.open(url);
        }
    }

    // show icons, thumbnail and audio player
    render = () => {
        const {pid, fileName, openAccess, mimeType, thumbnailFileName} = this.props;

        return (
            <span>
                <span className="fileIcon">
                    {this.renderFileIcon(pid, mimeType, thumbnailFileName)}
                </span>
                <span className="fileInfo">
                    {
                        openAccess ?
                            <a href="#" onClick={this.handleFileNameClick} onKeyPress={this.handleFileNameClick} className={'fileName'}>
                                {fileName}
                            </a>
                            :
                            fileName
                    }
                    {
                        openAccess && this.isAudio() &&
                        this.renderAudioPlayer(pid, fileName, mimeType)
                    }
                </span>
            </span>
        );
    }
}
