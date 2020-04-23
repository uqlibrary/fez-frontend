import React from 'react';
import MediaPreview from './MediaPreview';
import * as MediaPreviewUtils from './MediaPreviewUtils';

jest.mock('react-jw-player');

function setup(testProps = {}) {
    const props = {
        mediaUrl: 'http://test.com',
        fileName: 'test.jpg',
        webMediaUrl: 'http://test.web.com',
        onClose: jest.fn(),
        mimeType: 'image/jpeg',
        ...testProps,
    };

    return getElement(MediaPreview, props);
}
describe('MediaPreview shallow test', () => {
    let useRef;
    let scrollToPreview;
    const scrollIntoViewFn = jest.fn();

    const mockUseRef = () => {
        useRef.mockImplementation(() => ({
            current: {
                scrollIntoView: scrollIntoViewFn,
            },
        }));
    };

    beforeEach(() => {
        useRef = jest.spyOn(React, 'useRef');

        scrollToPreview = jest.spyOn(MediaPreviewUtils, 'scrollToPreview');

        mockUseRef();
        mockUseRef();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show the preview onload', () => {
        jest.useFakeTimers();
        const onLoadFn = jest.fn();
        global.window.Image.onLoad = onLoadFn;

        setup({ mimeType: 'image/jpeg' });

        jest.advanceTimersByTime(100);
        expect(scrollToPreview).toBeCalled();
    });

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
