import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {pathConfig} from 'config/routes';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import IconButton from 'material-ui/IconButton';
import {locale} from 'locale';

export default class AudioPlayer extends Component {
    static propTypes = {
        pid: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false
        };
        this.audioPlayerRef = null;
    }

    audioPlayerPlay = () => {
        const playPromise = this.audioPlayerRef.play();

        if (!!playPromise) {
            playPromise.then(() => this.setState({isPlaying: true}));
        } else {
            this.setState({isPlaying: true});
        }
    };

    audioPlayerPause = () => {
        this.audioPlayerRef.pause();
        this.setState({isPlaying: false});
    };

    render() {
        const {pid, fileName, mimeType} = this.props;
        const {controls} = locale.global.audioPlayer;
        const {isPlaying} = this.state;

        return (
            <div>
                <audio ref={(player) => (this.audioPlayerRef = player)}>
                    <source src={pathConfig.file.url(pid, fileName)} type={mimeType} />
                </audio>
                <IconButton
                    touch
                    onTouchTap={isPlaying ? this.audioPlayerPause : this.audioPlayerPlay}
                    className={`audioButton ${isPlaying ? 'pause' : 'play'}`}
                    aria-label={(isPlaying ? controls.pauseAudio : controls.playAudio).replace('[fileName]', fileName)}
                >
                    {isPlaying ? <Pause/> : <PlayArrow/>}
                </IconButton>
            </div>
        );
    }
}
