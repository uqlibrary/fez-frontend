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

describe('Thumbnail Component with Styles', () => {
    it('should render component and display thumbnail', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
