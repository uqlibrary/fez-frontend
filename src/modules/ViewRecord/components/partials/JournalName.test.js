import JournalName from './JournalName';
import {journalArticle} from 'mock/data/testing/records';

function setup(testProps, isShallow = false) {
    const props = {
        ...testProps,
        publication: testProps.publication || journalArticle
    };
    return getElement(JournalName, props, isShallow);
}

describe('Journal Name Component test ', () => {
    it('should render with journal article', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.sherpaRomeoGreen').length).toEqual(1);
        expect(wrapper.find('.eraYearListed').text()).toEqual('(ERA 2010 Journal(s) Listed)');
    });

    it('should render with empty props', () => {
        const wrapper = setup({publication: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render without era journal listed', () => {
        delete journalArticle['fez_record_search_key_issn'][0]['fez_journal_issns'];
        const wrapper = setup({publication: journalArticle});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.eraYearListed').length).toEqual(0);
    });

    it('should render without sherpa romeo', () => {
        delete journalArticle['fez_record_search_key_issn'][0]['rek_issn_lookup'];
        delete journalArticle['fez_record_search_key_issn'][0]['fez_sherpa_romeo'];

        const wrapper = setup({publication: journalArticle});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.sherpaRomeoGreen').length).toEqual(0);
    });
});
