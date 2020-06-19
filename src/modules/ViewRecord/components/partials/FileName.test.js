import { journalArticle } from 'mock/data/testing/records';
import { FileName } from './FileName';

function setup(testProps = {}, args = { isShallow: true }) {
    const { previewFileName, ...rest } = testProps;
    const props = {
        classes: {},
        pid: journalArticle.rek_pid,
        fileName: journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: 'application/pdf',
        mediaUrl:
            (!!testProps.fileName && `https://espace.library.uq.edu.au/view/UQ:676287/${testProps.fileName}`) || '',
        previewMediaUrl:
            (!!previewFileName && `https://espace.library.uq.edu.au/view/UQ:676287/${previewFileName}`) || '',
        onFileSelect: jest.fn(),
        allowDownload: false,
        ...rest,
    };
    return getElement(FileName, props, args);
}

describe('File Name Component ', () => {
    it('should render component and display file name only', () => {
        const wrapper = setup({}, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('FileName').length).toEqual(1);
        expect(wrapper.find('FileName a').length).toEqual(0);
        expect(wrapper.find('FileName audio').length).toEqual(0);
    });

    it('should display file name link', () => {
        const wrapper = setup(
            {
                allowDownload: true,
                fileName: 'test.jpg',
                previewFileName: 'preview_test.jpg',
                checksums: { media: '111' },
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('FileName').length).toEqual(1);
        expect(wrapper.find('FileName a').length).toEqual(1);
    });

    it('should render audio player', () => {
        const wrapper = setup(
            { allowDownload: true, mimeType: 'audio/mp3', fileName: 'test.mp3', checksums: { media: '111' } },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('FileName').length).toEqual(1);
    });

    it('should return canShowPreview as true for image/video files', () => {
        let wrapper = setup({ mimeType: 'image/jpeg', previewMediaUrl: 'test' });
        expect(wrapper.instance().canShowPreview('image/jpeg')).toEqual(true);
        // TODO revert once videos are transcoded to open format #158519502
        wrapper = setup({ mimeType: 'video/mp4', previewMediaUrl: 'test' });
        expect(wrapper.instance().canShowPreview('video/mp4')).toEqual(true);
        wrapper = setup({ mimeType: 'octet-stream', previewMediaUrl: 'test' });
        expect(wrapper.instance().canShowPreview('octet-stream')).toEqual(false);
        wrapper = setup({ mimeType: 'some/text', previewMediaUrl: 'test' });
        expect(wrapper.instance().canShowPreview('some/text')).toEqual(false);
    });

    it('should run onFileSelect function on click', () => {
        const onFileSelect = jest.fn();
        const wrapper = setup(
            {
                allowDownload: true,
                mimeType: 'image/jpeg',
                fileName: 'test.jpg',
                previewFileName: 'preview_test.jpg',
                onFileSelect: onFileSelect,
            },
            { isShallow: false },
        );
        const element = wrapper.find('FileName a');
        expect(toJson(wrapper)).toMatchSnapshot();
        element.simulate('click');
        expect(onFileSelect).toHaveBeenCalledTimes(1);
    });

    it('should run onFileSelect function on key press', () => {
        const onFileSelect = jest.fn();
        const wrapper = setup(
            {
                allowDownload: true,
                fileName: 'test.jpg',
                previewFileName: 'preview_test.jpg',
                mimeType: 'image/jpeg',
                onFileSelect: onFileSelect,
            },
            { isShallow: false },
        );
        const element = wrapper.find('FileName a');
        expect(toJson(wrapper)).toMatchSnapshot();
        element.simulate('keyPress');
        expect(onFileSelect).toHaveBeenCalledTimes(1);
    });

    it('should detect videos from mime type', () => {
        const wrapper = setup();
        const test1 = wrapper.instance().isVideo('video/mp4');
        expect(test1).toBe(true);
        const test2 = wrapper.instance().isVideo('audio/mp3');
        expect(test2).toBe(false);
    });
});
