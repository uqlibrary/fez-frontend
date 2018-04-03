import {journalArticle} from 'mock/data/testing/records';
import FileName from "./FileName";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        pid: testProps.pid || journalArticle.rek_pid,
        fileName: testProps.fileName || journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: testProps.mimeType || 'application/pdf',
        thumbnailFileName: testProps.thumbnailFileName,
        onFileSelect: testProps.onFileSelect || jest.fn()
    };
    return getElement(FileName, props, isShallow);
}

describe('File Name Component ', () => {
    it('should render component and display file name only', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('fileName').length).toEqual(1);
        expect(wrapper.find('fileName a').length).toEqual(0);
        expect(wrapper.find('fileName img').length).toEqual(0);
        expect(wrapper.find('fileName audio').length).toEqual(0);
    });

    it('should display thumbnail and file name link', () => {
        const wrapper = setup({allowDownload: true, thumbnailFileName: 'test.jpg'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('fileName').length).toEqual(1);
        expect(wrapper.find('fileName img').length).toEqual(1);
        expect(wrapper.find('fileName a').length).toEqual(1);
    });

    it('should render audio player', () => {
        const wrapper = setup({allowDownload: true, mimeType: 'audio/mp3'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('fileName audio').length).toEqual(1);
    });

    it('should render default icon', () => {
        const wrapper = setup({mimeType: 'text/plain'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('fileName EditorInsertDriveFile').length).toEqual(1);
    });

    it('should return canShowPreview as true for image/video files', () => {
        let wrapper = setup({mimeType: 'image/jpeg'});
        expect(wrapper.instance().canShowPreview('image/jpeg')).toEqual(true);
        wrapper = setup({mimeType: 'video/mp4'});
        expect(wrapper.instance().canShowPreview('video/mp4')).toEqual(true);
        wrapper = setup({mimeType: 'some/text'});
        expect(wrapper.instance().canShowPreview('some/text')).toEqual(false);
    });
});
