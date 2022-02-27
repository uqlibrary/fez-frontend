import React from 'react';
import { fireEvent, render } from 'test-utils';
import { id, VoiceToText } from './voiceToText';

const setup = state => {
    return render(
        <VoiceToText
            {...{
                sendHandler: () => {},
                ...state,
            }}
        />,
    );
};

const initialMockState = {
    browserSupportsSpeechRecognition: true,
    listening: false,
    transcript: [],
    resetTranscript: jest.fn(),
    stopListening: jest.fn(),
};
let mock = {};
jest.mock('react-speech-recognition', () => ({
    stopListening: () => mock.stopListening(),
    browserSupportsSpeechRecognition: jest.fn(() => mock.browserSupportsSpeechRecognition),
    useSpeechRecognition: () => ({
        transcript: mock.transcript,
        resetTranscript: mock.resetTranscript,
        listening: mock.listening,
    }),
}));

describe('VoiceToText', () => {
    beforeEach(() => {
        mock = { ...initialMockState, resetTranscript: jest.fn(), stopListening: jest.fn() };
    });
    it('should render empty when voice to text is not supported', () => {
        mock.browserSupportsSpeechRecognition = false;
        const { queryByTestId } = setup();
        expect(queryByTestId(id)).not.toBeInTheDocument();
        expect(queryByTestId(`${id}-start-button`)).not.toBeInTheDocument();
        expect(queryByTestId(`${id}-stop-button`)).not.toBeInTheDocument();
    });

    it('should render when voice to text is supported', () => {
        const { queryByTestId } = setup();
        expect(queryByTestId(id)).toBeInTheDocument();
        expect(queryByTestId(`${id}-start-button`)).toBeInTheDocument();
        expect(queryByTestId(`${id}-stop-button`)).not.toBeInTheDocument();
    });

    it('should render when is listening', () => {
        mock.listening = true;
        const { queryByTestId } = setup();
        expect(queryByTestId(id)).toBeInTheDocument();
        expect(queryByTestId(`${id}-start-button`)).not.toBeInTheDocument();
        expect(queryByTestId(`${id}-stop-button`)).toBeInTheDocument();
    });

    it('should not send  short transcript when stop button is clicked', () => {
        const sendHandler = jest.fn();
        mock.listening = true;
        mock.transcript = ['a', 'b', 'c'];
        const { getByTestId } = setup({
            sendHandler: sendHandler,
        });
        fireEvent.click(getByTestId(`${id}-stop-button`));
        expect(sendHandler).toHaveBeenCalledTimes(1);
        expect(mock.stopListening).toHaveBeenCalledTimes(1);
        expect(mock.resetTranscript).toHaveBeenCalledTimes(1);
    });

    it('should send transcript when stop button is clicked', () => {
        const sendHandler = jest.fn();
        mock.listening = true;
        mock.transcript = ['a', 'b', 'c', 'd'];
        const { getByTestId } = setup({
            sendHandler: sendHandler,
        });
        fireEvent.click(getByTestId(`${id}-stop-button`));
        expect(sendHandler).toHaveBeenCalledTimes(2);
        expect(mock.stopListening).toHaveBeenCalledTimes(1);
        expect(mock.resetTranscript).toHaveBeenCalledTimes(1);
    });
});
