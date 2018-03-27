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

    audioPlayerPlay = () => {
        document.getElementById('audioPlayer').play();
    };

    audioPlayerPause = () => {
        document.getElementById('audioPlayer').pause();
    };

    renderAudioPlayer = (pid, fileName, mimeType) => {
        console.log(fileName);
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
            <div className="columns is-gapless is-mobile fileDetails">
                <div className="column is-narrow is-vertical-center fileIcon">
                    {this.renderFileIcon(pid, mimeType, thumbnailFileName)}
                </div>
                <div className="column fileInfo">
                    {
                        openAccess ?
                            <a href="#" onClick={this.handleFileNameClick} onKeyPress={this.handleFileNameClick} className={'fileName'}>
                                {fileName}
                            </a>
                            :
                            fileName
                    }
                </div>
                {
                    openAccess && this.isAudio() &&
                    <div className="column is-narrow audioWrapper is-hidden-mobile">
                        {this.renderAudioPlayer(pid, fileName, mimeType)}
                    </div>
                }
            </div>
        );
    }
}
