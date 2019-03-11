import MediaPreview from "./MediaPreview";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        mediaUrl: testProps.mediaUrl || 'https://test.com/test.jpg',
        previewMediaUrl: testProps.previewMediaUrl || 'https://test.com/preview_test.jpg',
        mimeType: testProps.mimeType || 'text/plain',
        onClose: testProps.closeAction || jest.fn()
    };
    return getElement(MediaPreview, props, isShallow);
}

describe('Media Preview Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with image', () => {
        const wrapper = setup({mimeType: 'image/jpeg'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Button').length).toEqual(2);
    });

    it('should render component with video', () => {
        const wrapper = setup({mimeType: 'video/mp4'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Button').length).toEqual(2);
    });

    it('should call open new window on touch tap', () => {
        const open = jest.fn();
        global.open = open;
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('Button').first().find('button').simulate('click');
        expect(open).toHaveBeenCalledTimes(1);
    });

    it('should show the preview onload',  () => {
        jest.useFakeTimers();

        const wrapper = setup({mimeType: 'image/jpeg'});
        const scrollToMedia = jest.spyOn(wrapper.instance(), 'scrollToMedia');
        wrapper.instance().scrollToPreview();

        jest.advanceTimersByTime(100);

        expect(scrollToMedia).toHaveBeenCalled();
    });

    // it('should scroll to the preview',  () => {
    //     // this isnt working; trying to reset the ref mediaPreviewRef so scrollIntoView exists
    //     const scrollIntoViewMock = jest.fn();
    //
    //     const wrapper = setup({mimeType: 'image/jpeg'});
    //     console.log(wrapper.instance().mediaPreviewRef.current);
    //     wrapper.instance().mediaPreviewRef.current = {
    //         scrollIntoView: scrollIntoViewMock
    //     };
    //     wrapper.update();
    //
    //     wrapper.scrollToMedia();
    //
    //     expect(scrollIntoViewMock).toHaveBeenCalled();
    // });
});
