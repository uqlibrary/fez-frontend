import FileName from './FileName';
import {journalArticle} from 'mock/data/testing/records';

function setup(testProps, isShallow = true){
    const {previewFileName, ...rest} = testProps;
    const props = {
        classes: {},
        pid: journalArticle.rek_pid,
        fileName: journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: 'application/pdf',
        mediaUrl: !!testProps.fileName && `https://espace.library.uq.edu.au/view/UQ:676287/${testProps.fileName}` || '',
        previewMediaUrl: !!previewFileName && `https://espace.library.uq.edu.au/view/UQ:676287/${previewFileName}` || '',
        onFileSelect: jest.fn(),
        allowDownload: false,
        ...rest
    };
    return getElement(FileName, props, isShallow);
}

describe('FileName component', () => {
    it('should get styles for full render', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
