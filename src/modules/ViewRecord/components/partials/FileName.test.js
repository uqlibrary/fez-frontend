import {journalArticle} from 'mock/data/testing/records';
import FileName from "./FileName";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        pid: testProps.pid || journalArticle.rek_pid,
        fileName: testProps.fileName || journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: testProps.mimeType || 'application/pdf',
        thumbnailFileName: testProps.thumbnailFileName,
        handleFileNameClick: testProps.handleFileNameClick || (()=>{})
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
        const wrapper = setup({accessible: true, thumbnailFileName: 'test.jpg'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('fileName').length).toEqual(1);
        expect(wrapper.find('fileName img').length).toEqual(1);
        expect(wrapper.find('fileName a').length).toEqual(1);
    });

    it('should render audio player', () => {
        const wrapper = setup({accessible: true, mimeType: 'audio/mp3'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('fileName audio').length).toEqual(1);
    });

    it('should render default icon', () => {
        const wrapper = setup({mimeType: 'text/plain'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('fileName EditorInsertDriveFile').length).toEqual(1);
    });

    it('canShowPreview shall return true on image and video', () => {
        let wrapper = setup({mimeType: 'image/jpeg'});
        expect(wrapper.instance().canShowPreview()).toEqual(true);
        wrapper = setup({mimeType: 'video/mp4'});
        expect(wrapper.instance().canShowPreview()).toEqual(true);
    });
});
