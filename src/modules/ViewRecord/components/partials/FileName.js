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
        handleFileNameClick: PropTypes.func.isRequired,
        thumbnailFileName: PropTypes.string,
        previewFileName: PropTypes.string,
        accessible: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    renderFileIcon = (pid, mimeType, thumbnailFileName, accessible) => {
        if (accessible && thumbnailFileName) {
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
        return fileName && pathConfig.file.url(pid, fileName);
    }

    handleFileNameClick = (e) => {
        e.preventDefault();
        const mediaUrl = this.getUrl(this.props.pid, this.props.fileName);
        const previewMediaUrl = this.getUrl(this.props.pid, this.props.previewFileName || mediaUrl);

        if (this.canShowPreview()) {
            this.props.handleFileNameClick(mediaUrl, previewMediaUrl, this.props.mimeType);
        } else {
            window.open(mediaUrl);
        }
    }

    // show icons, thumbnail and audio player
    render = () => {
        const {pid, fileName, accessible, mimeType, thumbnailFileName, handleFileNameClick} = this.props;

        return (
            <div className="columns is-gapless is-mobile fileDetails">
                <div className="column is-narrow is-vertical-center fileIcon">
                    {this.renderFileIcon(pid, mimeType, thumbnailFileName, accessible)}
                </div>
                <div className="column fileInfo">
                    {
                        accessible && handleFileNameClick ?
                            <a href="#" onClick={this.handleFileNameClick} onKeyPress={this.handleFileNameClick} className={'fileName'}>
                                {fileName}
                            </a>
                            :
                            fileName
                    }
                </div>
                {
                    accessible && this.isAudio() &&
                    <div className="column is-narrow audioWrapper is-hidden-mobile">
                        {this.renderAudioPlayer(pid, fileName, mimeType)}
                    </div>
                }
            </div>
        );
    }
}
