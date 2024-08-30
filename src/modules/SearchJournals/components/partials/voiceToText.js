import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MicIcon from '@mui/icons-material/Mic';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { PropTypes } from 'prop-types';
import Grid from '@mui/material/Grid';

export const id = 'journal-search-keywords-voice-record';
export const VoiceToText = ({ sendHandler }) => {
    const { transcript, resetTranscript, listening } = useSpeechRecognition({
        clearTranscriptOnListen: true,
    });
    const sendTranscript = event => {
        event && event.preventDefault();
        SpeechRecognition.stopListening();
        if (transcript && transcript.length > 3) {
            sendHandler(transcript);
        }
        resetTranscript();
    };
    React.useEffect(() => {
        sendHandler(transcript);
    }, [transcript, sendHandler]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
    return (
        <Grid container spacing={0} style={{ marginRight: -10 }} id={id} data-testid={id}>
            {!listening && (
                <Grid item xs={'auto'}>
                    <Tooltip title={'Use your microphone to search'} id={`${id}-tooltip`} data-testid={`${id}-tooltip`}>
                        <IconButton
                            onClick={SpeechRecognition.startListening}
                            size={'small'}
                            id={`${id}-start-button`}
                            data-analyticsid={`${id}-start-button`}
                            data-testid={`${id}-start-button`}
                        >
                            <MicIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
            {listening && (
                <Grid item xs={'auto'}>
                    <Tooltip title={'Stop recording'} id={`${id}-voice-stop`} data-testid={`${id}-voice-stop`}>
                        <IconButton
                            onClick={sendTranscript}
                            size={'small'}
                            id={`${id}-stop-button`}
                            data-analyticsid={`${id}-stop-button`}
                            data-testid={`${id}-stop-button`}
                        >
                            <MicIcon style={{ color: '#167b00' }} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
        </Grid>
    );
};

VoiceToText.propTypes = {
    sendHandler: PropTypes.func.isRequired,
};

export default React.memo(VoiceToText);
