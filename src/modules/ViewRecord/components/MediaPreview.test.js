import MediaPreview from './MediaPreview';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        mediaUrl: testProps.mediaUrl || 'https://test.com/test.jpg',
        previewMediaUrl: testProps.previewMediaUrl || 'https://test.com/preview_test.jpg',
        mimeType: testProps.mimeType || 'text/plain',
        onClose: testProps.closeAction || jest.fn(),
    };
    return getElement(MediaPreview, props, isShallow);
}

describe('Media Preview Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with image', () => {
        const wrapper = setup({ mimeType: 'image/jpeg' }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Button').length).toEqual(2);
    });

    it('should render component with video', () => {
        const wrapper = setup({ mimeType: 'video/mp4' }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Button').length).toEqual(2);
    });

    it('should call open new window on touch tap', () => {
        const open = jest.fn();
        global.open = open;
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('Button')
            .first()
            .find('button')
            .simulate('click');
        expect(open).toHaveBeenCalledTimes(1);
    });

    it('should show the preview onload', () => {
        jest.useFakeTimers();

        const wrapper = setup({ mimeType: 'image/jpeg' });
        const scrollToMedia = jest.spyOn(wrapper.instance(), 'scrollToMedia');
        wrapper.instance().scrollToPreview();

        jest.advanceTimersByTime(100);

        expect(scrollToMedia).toHaveBeenCalled();
    });

    it("should call the ref's method for scrolling into view", () => {
        const wrapper = setup({});
        const testFn = jest.fn();

        wrapper.instance().mediaPreviewRef = undefined;
        wrapper.instance().scrollToMedia();

        wrapper.instance().mediaPreviewRef = {
            current: {
                scrollIntoView: testFn,
            },
        };
        wrapper.instance().scrollToMedia();
        expect(testFn).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'start',
            inline: 'center',
        });
    });

    it('should update state on change of URL', () => {
        const wrapper = setup({ previewMediaUrl: 'http://www.test.com/test.mov', mimeType: 'video/mp4' });
        const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        wrapper.setState({ videoErrorMsg: 'test', videoErrorCode: 1 });
        const firstState = wrapper.state();
        wrapper.setProps({ previewMediaUrl: 'http://www.test.com/test2.mov', mimeType: 'video/mp4' });
        const secondState = wrapper.state();
        expect(componentWillReceiveProps).toBeCalled();
        expect(firstState).not.toEqual(secondState);
    });

    it('shouldnt update state on change of mimeType', () => {
        const wrapper = setup({ previewMediaUrl: 'http://www.test.com/test.mov', mimeType: 'video/mp4' });
        const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        wrapper.setState({ videoErrorMsg: 'test', videoErrorCode: 1 });
        const firstState = wrapper.state();
        wrapper.setProps({ previewMediaUrl: 'http://www.test.com/test.mov', mimeType: 'video/mp3' });
        const secondState = wrapper.state();
        expect(componentWillReceiveProps).toBeCalled();
        expect(firstState).toEqual(secondState);
    });

    it('should render when scrolled to a loaded video', () => {
        const wrapper = setup({ mimeType: 'video/mp4' });
        wrapper.instance().videoLoaded();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render when video fails', () => {
        const wrapper = setup({ mimeType: 'video/mp4' });
        const scrollToPreview = jest.spyOn(wrapper.instance(), 'scrollToPreview');
        wrapper.instance().videoFailed({ message: 'test failure', code: 12345 });
        expect(scrollToPreview).toBeCalled();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render when video fails with no error codes', () => {
        const wrapper = setup({ mimeType: 'video/mp4' });
        const scrollToPreview = jest.spyOn(wrapper.instance(), 'scrollToPreview');
        wrapper.instance().videoFailed({});
        expect(scrollToPreview).not.toBeCalled();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
