import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MicIcon from '@material-ui/icons/Mic';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';

export const VoiceToText = ({ sendHandler }) => {
    const elementId = 'journal-search-keywords';
    const { transcript, resetTranscript, listening } = useSpeechRecognition({
        clearTranscriptOnListen: true,
    });
    const sendTranscript = event => {
        event && event.preventDefault();
        SpeechRecognition.stopListening();
        console.log('transcript', transcript);
        if (transcript && transcript.length > 3) {
            sendHandler(transcript);
        }
        resetTranscript;
    };
    React.useEffect(() => {
        sendHandler(transcript);
    }, [transcript, sendHandler]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
    return (
        <Grid container spacing={0} style={{ marginRight: -10 }}>
            {!listening && (
                <Grid item xs={'auto'}>
                    <Tooltip
                        title={'Use your microphone to search'}
                        id={`${elementId}-voice-record`}
                        data-testid={`${elementId}-voice-record`}
                    >
                        <IconButton onClick={SpeechRecognition.startListening} size={'small'}>
                            <MicIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
            {listening && (
                <Grid item xs={'auto'}>
                    <Tooltip
                        title={'Stop recording'}
                        id={`${elementId}-voice-stop`}
                        data-testid={`${elementId}-voice-stop`}
                    >
                        <IconButton onClick={sendTranscript} size={'small'}>
                            <MicIcon style={{ color: '#167b00' }} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
        </Grid>
    );
};

VoiceToText.propTypes = {
    clearSuggestions: PropTypes.func,
    sendHandler: PropTypes.func,
};

VoiceToText.defaultProps = {};

export default React.memo(VoiceToText);
