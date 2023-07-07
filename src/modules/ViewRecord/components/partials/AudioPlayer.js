import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';
import locale from 'locale/global';

export default class AudioPlayer extends Component {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
        };
        this.audioPlayerRef = null;
    }

    audioPlayerPlay = () => {
        const playPromise = !!this.audioPlayerRef && this.audioPlayerRef.play();
        if (!!playPromise) {
            playPromise.then(() => this.setState({ isPlaying: true }));
            return playPromise;
        } else {
            this.setState({ isPlaying: true });
        }
        // for eslint
        return null;
    };

    audioPlayerPause = () => {
        this.audioPlayerRef.pause();
        this.setState({ isPlaying: false });
    };

    /* istanbul ignore next */
    onAudioStreamEnd = () => {
        this.setState({ isPlaying: false });
    };

    render() {
        const { fileName, mimeType } = this.props;
        const { controls } = locale.global.audioPlayer;
        const { isPlaying } = this.state;
        return (
            <div>
                <audio
                    id="audioPlayer"
                    data-testid="audio-player"
                    ref={player => (this.audioPlayerRef = player)}
                    onEnded={this.onAudioStreamEnd}
                >
                    <source src={fileName} type={mimeType} />
                </audio>
                <IconButton
                    id={isPlaying ? 'pauseButton' : 'playButton'}
                    style={{ marginTop: -10, marginBottom: -10 }}
                    onClick={isPlaying ? this.audioPlayerPause : this.audioPlayerPlay}
                    aria-label={(isPlaying ? controls.pauseAudio : controls.playAudio).replace('[fileName]', fileName)}
                    size="large"
                >
                    {isPlaying ? <Pause className="pause" /> : <PlayArrow className="play" />}
                </IconButton>
            </div>
        );
    }
}
