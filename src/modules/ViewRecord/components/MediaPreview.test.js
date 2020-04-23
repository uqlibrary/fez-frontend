import React from 'react';
import MediaPreview from './MediaPreview';
import { rtlRender, fireEvent, act } from 'test-utils';
import mediaQuery from 'css-mediaquery';
import * as MediaPreviewUtils from './MediaPreviewUtils';
jest.mock('./MediaPreviewUtils');

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

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
        const { getByTestId, getByText } = setup();

        expect(getByText('Image preview')).toBeInTheDocument();
        expect(getByTestId('media-preview-buttons-larger-screen')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByTestId('close-preview')).toHaveTextContent('Close');
    });

    it('should render component and media preview buttons for smaller screensize', () => {
        window.matchMedia = createMatchMedia(512);
        const { getByTestId, getByText } = setup();

        expect(getByText('Image preview')).toBeInTheDocument();
        expect(getByTestId('media-preview-buttons-smaller-screen')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByTestId('close-preview')).toHaveTextContent('Close');
    });

    it('should render component with image', () => {
        const { getByTestId, getByText } = setup({ mimeType: 'image/jpeg' });
        expect(getByTestId('image-preview')).toBeInTheDocument();
        expect(getByText('Image preview')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByTestId('close-preview')).toHaveTextContent('Close');
    });

    it('should render component with video', () => {
        const { getByTestId } = setup({ mimeType: 'video/mp4' });
        expect(getByTestId('previewVideo')).toBeInTheDocument();
        expect(getByTestId('open-original-file')).toHaveTextContent('Open original file in a new window');
        expect(getByTestId('open-web-file')).toHaveTextContent('Open web version file in a new window');
        expect(getByTestId('close-preview')).toHaveTextContent('Close');
    });

    it('should call open new window on touch tap', () => {
        const open = jest.fn();
        global.open = open;
        const { getByTestId } = setup({ webMediaUrl: 'web_test_t.jpg', mediaUrl: 'test.jpg' });

        act(() => {
            fireEvent.click(getByTestId('open-original-file'));
        });
        act(() => {
            fireEvent.click(getByTestId('open-web-file'));
        });
        act(() => {
            fireEvent.click(getByTestId('close-preview'));
        });

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
});
