import Thumbnail from "./Thumbnail";

function setup(testProps, isShallow = true){
    const props = {
        mediaUrl: '/test/mediaUrl',
        previewMediaUrl: '/test/preview/mediaUrl',
        thumbnailMediaUrl: '/test/thumbnail/mediaUrl',
        thumbnailFileName: 'thumbnail.jpg',
        mimeType: 'image/jpeg',
        onClick: jest.fn(),
        ...testProps,
    };
    return getElement(Thumbnail, props, isShallow);
}

describe('Thumbnail Component ', () => {
    it('should render component and display thumbnail', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should run onClick function on click', () => {
        const onClick = jest.fn();
        const wrapper = setup({onClick: onClick}, false);
        const element = wrapper.find('Thumbnail a');
        expect(toJson(wrapper)).toMatchSnapshot();
        element.simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should run onFileSelect function on key press', () => {
        const onClick = jest.fn();
        const wrapper = setup({onClick: onClick}, false);
        const element = wrapper.find('Thumbnail a');
        expect(toJson(wrapper)).toMatchSnapshot();
        element.simulate('keyPress');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should show a broken thumbnail icon when the thumbnail wont load.', () => {
        const onClick = jest.fn();
        const wrapper = setup({});
        wrapper.instance().setState({thumbnailError: true});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
