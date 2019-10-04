import { FileIcon } from './FileIcon';

jest.mock('@material-ui/styles', () => ({
    makeStyles: () => () => ({}),
}));

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        mimeType: '',
        ...testProps,
    };

    return getElement(FileIcon, props, args);
}

describe('FileIcon component', () => {
    it('should render the default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a thumbnail when applicable', () => {
        const wrapper = setup({
            pid: 'UQ:123456',
            allowDownload: true,
            thumbnailFileName: 'thumbnail_test.jpg',
            webFileName: 'web_test.jpg',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        const wrapper2 = setup({
            pid: 'UQ:123456',
            allowDownload: true,
            thumbnailFileName: 'thumbnail_test.jpg',
        });
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

    it('should render VolumeUp for audio', () => {
        const wrapper = setup({ mimeType: 'audio/wav' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render PictureAsPdf for PDF', () => {
        const wrapper = setup({ mimeType: 'application/pdf' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render Image for image', () => {
        const wrapper = setup({ mimeType: 'image/png' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render Videocam for video', () => {
        const wrapper = setup({ mimeType: 'video/mp4' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
