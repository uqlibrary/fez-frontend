import React from 'react';
import MediaPreview from './MediaPreview';
import * as MediaPreviewUtils from './MediaPreviewUtils';
import { act } from '@testing-library/react';

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
        scrollToPreview();
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

    it("should call the ref's method for scrolling into view", () => {
        const wrapper = setup({ mimeType: 'video/mp4' });

        act(() => {
            wrapper.find('ReactJWPlayer').simulate('videoLoad');
            wrapper.update();
        });
    });

    it('should render when scrolled to a loaded video', () => {
        const wrapper = setup({ mimeType: 'video/mp4' });

        act(() => {
            wrapper.find('ReactJWPlayer').simulate('videoLoad');
            wrapper.update();
        });
    });

    it('should render when video fails', () => {
        const wrapper = setup({ mimeType: 'video/mp4' });

        jest.useFakeTimers();
        act(() => {
            wrapper.find('ReactJWPlayer').simulate('setupError', { message: 'test failure', code: 12345 });
            wrapper.update();

            jest.advanceTimersByTime(100);
        });
    });

    it('should render when image fails 2', () => {
        const wrapper = setup({ mimeType: 'image/jpeg' });

        act(() => {
            wrapper.find('img').simulate('error');
            wrapper.update();
        });
    });

    it('should render when video fails with no error codes', () => {
        const wrapper = setup({ mimeType: 'video/mp4' });

        act(() => {
            wrapper.find('ReactJWPlayer').simulate('setupError', {});
            wrapper.update();
        });
    });
});
