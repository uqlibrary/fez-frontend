import React from 'react';
import MediaPreview from './MediaPreview';
import { rtlRender, fireEvent, act } from 'test-utils';
import mediaQuery from 'css-mediaquery';

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
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
        window.open = jest.fn();
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

    // it('should show the preview onload', () => {
    //     jest.useFakeTimers();
    //     const onLoadFn = jest.fn();
    //     window.Image.onLoad = onLoadFn;

    //     setup({ mimeType: 'image/jpeg' });

    //     jest.advanceTimersByTime(100);
    //     expect(onLoadFn).toBeCalled();
    // });

    // it("should call the ref's method for scrolling into view", () => {
    //     const wrapper = setup();
    //     const testFn = jest.fn();

    //     wrapper.instance().mediaPreviewRef = undefined;
    //     wrapper.instance().scrollToMedia();

    //     wrapper.instance().mediaPreviewRef = {
    //         current: {
    //             scrollIntoView: testFn,
    //         },
    //     };
    //     wrapper.instance().scrollToMedia();
    //     expect(testFn).toHaveBeenCalledWith({
    //         behavior: 'smooth',
    //         block: 'start',
    //         inline: 'center',
    //     });
    // });

    // it('should update state on change of URL', () => {
    //     const wrapper = setup({ previewMediaUrl: 'http://www.test.com/test.mov', mimeType: 'video/mp4' });
    //     const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
    //     wrapper.setState({ videoErrorMsg: 'test', videoErrorCode: 1 });
    //     const firstState = wrapper.state();
    //     wrapper.setProps({ previewMediaUrl: 'http://www.test.com/test2.mov', mimeType: 'video/mp4' });
    //     const secondState = wrapper.state();
    //     expect(componentWillReceiveProps).toBeCalled();
    //     expect(firstState).not.toEqual(secondState);
    // });

    // it('shouldnt update state on change of mimeType', () => {
    //     const wrapper = setup({ previewMediaUrl: 'http://www.test.com/test.mov', mimeType: 'video/mp4' });
    //     const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
    //     wrapper.setState({ videoErrorMsg: 'test', videoErrorCode: 1 });
    //     const firstState = wrapper.state();
    //     wrapper.setProps({ previewMediaUrl: 'http://www.test.com/test.mov', mimeType: 'video/mp3' });
    //     const secondState = wrapper.state();
    //     expect(componentWillReceiveProps).toBeCalled();
    //     expect(firstState).toEqual(secondState);
    // });

    // it('should render when scrolled to a loaded video', () => {
    //     const wrapper = setup({ mimeType: 'video/mp4' });
    //     wrapper.instance().videoLoaded();
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render when video fails', () => {
    //     const wrapper = setup({ mimeType: 'video/mp4' });
    //     const scrollToPreview = jest.spyOn(wrapper.instance(), 'scrollToPreview');
    //     wrapper.instance().videoFailed({ message: 'test failure', code: 12345 });
    //     expect(scrollToPreview).toBeCalled();
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render when video fails', () => {
    //     const wrapper = setup({ mimeType: 'image/jpeg' });
    //     const scrollToPreview = jest.spyOn(wrapper.instance(), 'scrollToPreview');
    //     wrapper.instance().imageFailed();
    //     expect(scrollToPreview).toBeCalled();
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render when video fails with no error codes', () => {
    //     const wrapper = setup({ mimeType: 'video/mp4' });
    //     const scrollToPreview = jest.spyOn(wrapper.instance(), 'scrollToPreview');
    //     wrapper.instance().videoFailed({});
    //     expect(scrollToPreview).not.toBeCalled();
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });
});
