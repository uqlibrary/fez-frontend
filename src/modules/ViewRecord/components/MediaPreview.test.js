import React from 'react';
import MediaPreview from './MediaPreview';
import { rtlRender, fireEvent, createMatchMedia } from 'test-utils';
import * as MediaPreviewUtils from './MediaPreviewUtils';

jest.mock('./MediaPreviewUtils');
jest.mock('react-player', () => () => <div>Mock React Player</div>);
function setup(testProps = {}) {
    const props = {
        fileName: testProps.fileName || 'https://test.com/test.jpg',
        mediaUrl: testProps.mediaUrl || 'https://test.com/test.jpg',
        webMediaUrl: testProps.mediaUrl || 'https://test.com/web_test.jpg',
        previewMediaUrl: testProps.previewMediaUrl || 'https://test.com/preview_test.jpg',
        mimeType: testProps.mimeType || 'text/plain',
        onClose: testProps.closeAction || jest.fn(),
        ...testProps,
    };
    return rtlRender(<MediaPreview {...props} />);
}

describe('Media Preview Component ', () => {
    let scrollToPreview;

    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
        window.open = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        scrollToPreview = jest.spyOn(MediaPreviewUtils, 'scrollToPreview');
    });

    it('should render component', () => {
        const { getByTestId, getByText, getByRole } = setup();

        expect(getByText('Image preview')).toBeInTheDocument();
        expect(getByTestId('media-preview-buttons-larger-screen')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('should render component and media preview buttons for smaller screensize', () => {
        window.matchMedia = createMatchMedia(512);
        const { getByTestId, getByText, getByRole } = setup();

        expect(getByText('Image preview')).toBeInTheDocument();
        expect(getByTestId('media-preview-buttons-smaller-screen')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('should render component with image', () => {
        const { getByTestId, getByText, getByRole } = setup({ mimeType: 'image/jpeg' });
        expect(getByTestId('image-preview')).toBeInTheDocument();
        expect(getByText('Image preview')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('should render component with video', () => {
        const { getByTestId, getByRole, getByText } = setup({ mimeType: 'video/mp4' });
        expect(getByText('Mock React Player')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('should call open new window on touch tap', () => {
        const open = jest.fn();
        global.open = open;
        const { getByTestId, getByRole } = setup({ webMediaUrl: 'web_test_t.jpg', mediaUrl: 'test.jpg' });

        fireEvent.click(getByTestId('open-original-file'));
        fireEvent.click(getByTestId('open-web-file'));
        fireEvent.click(getByRole('button', { name: 'Close' }));

        expect(open).toHaveBeenCalledTimes(2);
    });

    it('should render when scrolled to a loaded video', () => {
        const { getByText } = setup({ mimeType: 'video/mp4', imageError: false, videoLoading: true });
        expect(getByText('Loading')).toBeInTheDocument();
    });

    it('should render when video fails', () => {
        setup({ mimeType: 'video/mp4', videoErrorMsg: 'test failure', videoErrorCode: 12345 });
        expect(scrollToPreview).toBeCalled();
    });

    it('should render when image fails', () => {
        setup({ mimeType: 'image/jpeg', imageError: true });
        expect(scrollToPreview).toBeCalled();
    });

    /**
     * Copied from MediaPreview.shallow.test.js
     * TODO: the mock function doesnt seem to be checked
     */
    it('should show the preview onload', () => {
        jest.useFakeTimers();
        const onLoadFn = jest.fn();
        global.window.Image.onLoad = onLoadFn;

        setup({ mimeType: 'image/jpeg' });

        jest.advanceTimersByTime(100);
        expect(scrollToPreview).toBeCalled();
    });

    /**
     * Copied from MediaPreview.shallow.test.js
     * TODO: the mock doesnt seem to be working
     */
    it('should render when image fails', () => {
        Object.defineProperty(global.Image.prototype, 'src', {
            set() {
                setTimeout(() => this.onerror(new Error('mocked error')), 100);
            },
        });

        setup();
        expect(scrollToPreview).toHaveBeenCalled();
    });
});
