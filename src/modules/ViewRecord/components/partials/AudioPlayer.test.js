import React from 'react';
import { rtlRender, fireEvent, waitFor } from 'test-utils';
import AudioPlayer from './AudioPlayer';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        fileName: testProps.fileName || 'test_t.mp3',
        mimeType: testProps.mimeType || 'audio/mp3',
    };
    return rtlRender(<AudioPlayer {...props} />);
}

describe('Audio Player Component ', () => {
    let playMock;
    let pauseMock;

    beforeEach(() => {
        jest.clearAllMocks();
        playMock = jest.spyOn(window.HTMLAudioElement.prototype, 'play').mockImplementation(() => {});
        pauseMock = jest.spyOn(window.HTMLAudioElement.prototype, 'pause').mockImplementation(() => {});
    });

    it('should render component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should play and pause via buttons clicks', () => {
        const { getByRole, queryByRole } = setup();

        const playBtnLabel = 'Click to play audio file test_t.mp3';
        const pauseBtnLabel = 'Click to pause audio file test_t.mp3';
        // play
        fireEvent.click(getByRole('button', { name: playBtnLabel }));
        expect(playMock).toHaveBeenCalledTimes(1);
        expect(queryByRole('button', { name: playBtnLabel })).not.toBeInTheDocument();
        expect(getByRole('button', { name: pauseBtnLabel })).toBeInTheDocument();
        // pause
        fireEvent.click(getByRole('button', { name: pauseBtnLabel }));
        expect(pauseMock).toHaveBeenCalledTimes(1);
        expect(getByRole('button', { name: playBtnLabel })).toBeInTheDocument();
        expect(queryByRole('button', { name: pauseBtnLabel })).not.toBeInTheDocument();
    });

    it('should handle promise on play', async () => {
        playMock = jest.spyOn(window.HTMLAudioElement.prototype, 'play').mockImplementation(() => Promise.resolve());
        const { getByRole, queryByRole } = setup();

        const playBtnLabel = 'Click to play audio file test_t.mp3';
        const pauseBtnLabel = 'Click to pause audio file test_t.mp3';

        await waitFor(() => fireEvent.click(getByRole('button', { name: playBtnLabel })));
        expect(playMock).toHaveBeenCalledTimes(1);
        expect(queryByRole('button', { name: playBtnLabel })).not.toBeInTheDocument();
        expect(getByRole('button', { name: pauseBtnLabel })).toBeInTheDocument();
    });
});
