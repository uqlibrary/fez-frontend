import {journalArticle} from 'mock/data/testing/records';
import FileName from "./FileName";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        pid: testProps.pid || journalArticle.rek_pid,
        fileName: testProps.fileName || journalArticle.fez_record_search_key_file_attachment_name[0].rek_file_attachment_name,
        mimeType: testProps.mimeType || 'text/plain',
        handleFileNameClick: testProps.handleFileNameClick || (()=>{})
    };
    return getElement(FileName, props, isShallow);
}

describe('File Name Component ', () => {
    it('should render component', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
