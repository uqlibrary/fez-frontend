import {journalArticle} from 'mock/data/testing/records';
import files from "./Files";

const moment = require('moment');

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        publication: testProps.publication || journalArticle,
        onFileSelect: testProps.onFileSelect || jest.fn()
    };
    return getElement(files, props, isShallow);
}

describe('Files Component ', () => {
    it('should render component', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with no files', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_record_search_key_file_attachment_name;
        const wrapper = setup({publication:publication}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.fileName').length).toEqual(0);
    });

    // it('should display embargo date icon', () => {
    //    const publication = Object.assign({}, journalArticle);
    //    const tomorrow = moment().add(1, 'day');
    //    publication.fez_record_search_key_file_attachment_embargo_date[0].rek_file_attachment_embargo_date = tomorrow.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
    //    const wrapper = setup({publication:publication}, false);
    //    expect(wrapper.find('.fez-icon.openAccessEmbargoed').length).toEqual(1);
    //    expect(wrapper.find('.oaStatus span').text()).toEqual('Embargoed until ' + tomorrow.format('DD/MM/YYYY'));
    // });

    it('should render bytes correctly', () => {
        const wrapper = setup({});
        expect(wrapper.instance().formatBytes(0)).toEqual('0 Bytes');
        expect(wrapper.instance().formatBytes(1024)).toEqual('1 KB');
        expect(wrapper.instance().formatBytes(1048576)).toEqual('1 MB');
    });
});
