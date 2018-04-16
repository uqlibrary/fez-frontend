import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {pathConfig} from 'config/routes';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import IconButton from 'material-ui/IconButton';

export default class AudioPlayer extends Component {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired
    };

    audioPlayerPlay = () => {
        this.refs.audioPlayer.play();
    };

    audioPlayerPause = () => {
        this.refs.audioPlayer.pause();
    };

    render() {
        const {pid, fileName, mimeType} = this.props;

        return (
            <div>
                <audio ref="audioPlayer">
                    <source src={pathConfig.file.url(pid, fileName)} type={mimeType} />
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
}
