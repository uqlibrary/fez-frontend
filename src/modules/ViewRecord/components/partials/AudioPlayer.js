import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';
import locale from 'locale/global';

const AudioPlayer = ({ fileName }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioPlayerRef = useRef(null);

    const { controls } = locale.global.audioPlayer;

    const audioPlayerPlay = () => {
        const playPromise = !!audioPlayerRef.current && audioPlayerRef.current.play();
        if (!!playPromise) {
            playPromise.then(() => setIsPlaying(true));
            return playPromise;
        } else {
            setIsPlaying(true);
        }
        // for eslint
        return null;
    };

    const audioPlayerPause = () => {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
    };

    /* c8 ignore next */
    const onAudioStreamEnd = () => {
        setIsPlaying(false);
    };

    return (
        <div>
            <audio
                id="audioPlayer"
                data-testid="audio-player"
                ref={player => (audioPlayerRef.current = player)}
                onEnded={onAudioStreamEnd}
            >
                <source src={fileName} type="audio/mpeg" />
            </audio>
            <IconButton
                id={isPlaying ? 'pauseButton' : 'playButton'}
                style={{ marginTop: -10, marginBottom: -10 }}
                onClick={isPlaying ? audioPlayerPause : audioPlayerPlay}
                aria-label={(isPlaying ? controls.pauseAudio : controls.playAudio).replace('[fileName]', fileName)}
                size="large"
            >
                {isPlaying ? <Pause className="pause" /> : <PlayArrow className="play" />}
            </IconButton>
        </div>
    );
};
AudioPlayer.propTypes = {
    fileName: PropTypes.string.isRequired,
};
export default React.memo(AudioPlayer);
