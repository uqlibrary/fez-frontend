import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {pathConfig} from 'config/routes';
import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import PictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import IconButton from 'material-ui/IconButton';

export default class fileName extends PureComponent {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        onFileSelect: PropTypes.func.isRequired,
        thumbnailFileName: PropTypes.string,
        previewFileName: PropTypes.string,
        allowDownload: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    renderFileIcon = (pid, mimeType, thumbnailFileName, allowDownload) => {
        if (allowDownload && thumbnailFileName) {
            return <img src={this.getUrl(pid, thumbnailFileName)} alt={thumbnailFileName}/>;
        }

        if (this.isAudio(mimeType)) {
            return <AvVolumeUp />;
        }

        if (this.isPdf(mimeType)) {
            return <PictureAsPdf />;
        }

        return <InsertDriveFile />;
    }

    audioPlayerPlay = () => {
        document.getElementById('audioPlayer').play();
    };

    audioPlayerPause = () => {
        document.getElementById('audioPlayer').pause();
    };

    renderAudioPlayer = (pid, fileName, mimeType) => {
        return (
            <div>
                <audio id="audioPlayer">
                    <source src={this.getUrl(pid, fileName)} type={mimeType} />
                </audio>
                <IconButton touch onTouchTap={this.audioPlayerPlay} className="audioButton play">
                    <PlayArrow />
                </IconButton>
                <IconButton touch onTouchTap={this.audioPlayerPause} className="audioButton pause">
                    <Pause />
                </IconButton>
            </div>
        );
    }

    isAudio = (mimeType) => {
        return mimeType.indexOf('audio') >= 0;
    }

    isPdf = (mimeType) => {
        return mimeType.indexOf('application/pdf') >= 0;
    }

    isVideo = (mimeType) => {
        return mimeType.indexOf('video') >= 0;
    }

    isImage = (mimeType) => {
        return mimeType.indexOf('image') === 0;
    }

    canShowPreview = (mimeType) => {
        return (this.isImage(mimeType) || this.isVideo(mimeType));
    }

    getUrl = (pid, fileName) => {
        return fileName && pathConfig.file.url(pid, fileName);
    }

    handleFileNameClick = (e) => {
        e.preventDefault();
        const mediaUrl = this.getUrl(this.props.pid, this.props.fileName);
        const previewMediaUrl = this.getUrl(this.props.pid, this.props.previewFileName || mediaUrl);

        if (this.canShowPreview(this.props.mimeType)) {
            this.props.onFileSelect(mediaUrl, previewMediaUrl, this.props.mimeType);
        } else {
            window.open(mediaUrl);
        }
    }

    render = () => {
        const {pid, fileName, allowDownload, mimeType, thumbnailFileName} = this.props;

        return (
            <div className="columns is-gapless is-mobile fileDetails">
                <div className="column is-narrow is-vertical-center fileIcon">
                    {this.renderFileIcon(pid, mimeType, thumbnailFileName, allowDownload)}
                </div>
                <div className="column fileInfo">
                    {
                        allowDownload &&
                        <a href="#" onClick={this.handleFileNameClick} onKeyPress={this.handleFileNameClick} className={'fileName'}>
                            {fileName}
                        </a>
                    }
                    {
                        !allowDownload &&
                        fileName
                    }
                </div>
                {
                    allowDownload && this.isAudio(this.props.mimeType) &&
                    <div className="column is-narrow audioWrapper is-hidden-mobile">
                        {this.renderAudioPlayer(pid, fileName, mimeType)}
                    </div>
                }
            </div>
        );
    }
}
