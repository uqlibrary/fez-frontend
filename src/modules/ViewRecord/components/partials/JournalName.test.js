import JournalName from './JournalName';
import { journalArticle } from 'mock/data/testing/records';

let testJournalArticle = JSON.parse(JSON.stringify(journalArticle));

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || testJournalArticle,
    };
    return getElement(JournalName, props, args);
}

describe('Journal Name Component test ', () => {
    beforeEach(() => {
        // Clone from original mock data before each test
        testJournalArticle = JSON.parse(JSON.stringify(journalArticle));
    });

    it('should render with journal article', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.eraYearListed').text()).toEqual(' (ERA 2010 Journal(s) Listed)');
    });

    it('should render with empty props', () => {
        const wrapper = setup({ publication: {} });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render without era journal listed', () => {
        delete testJournalArticle.fez_record_search_key_issn[0].fez_journal;
        const wrapper = setup();
        expect(wrapper.find('.eraYearListed').length).toEqual(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render without sherpa romeo', () => {
        delete testJournalArticle.fez_record_search_key_issn[0].rek_issn_lookup;
        delete testJournalArticle.fez_record_search_key_issn[0].fez_sherpa_romeo;

        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have getERAYears return ERA years appropriately', () => {
        const wrapper = setup({}, { isShallow: true });

        // Using arguments - should return empty array
        expect(wrapper.instance().getERAYears()).toEqual([]);

        // Journal ISSN array is empty - should return empty array
        expect(wrapper.instance().getERAYears([{ fez_journal: [] }])).toEqual([]);

        // Multiple journals have same ERA year - should only return one entry
        const arrayWithDuplicates = [
            {
                fez_journal: {
                    fez_journal_era: [
                        {
                            jni_id: 13071,
                            jnl_era_source_year: 2001,
                        },
                        {
                            jni_id: 13072,
                            jnl_era_source_year: 2001,
                        },
                    ],
                },
            },
        ];
        expect(wrapper.instance().getERAYears(arrayWithDuplicates)).toEqual([2001]);
    });
});
