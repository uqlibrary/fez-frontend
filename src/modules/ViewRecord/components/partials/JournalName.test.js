import JournalName from './JournalName';
import { journalArticle } from 'mock/data/testing/records';
import { sanitiseData } from 'actions/records';

let testJournalArticle = sanitiseData(journalArticle);

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || testJournalArticle,
    };

    return renderComponent(JournalName, props, args);
}

describe('Journal Name Component test ', () => {
    beforeEach(() => {
        // Clone from original mock data before each test
        testJournalArticle = sanitiseData(journalArticle);
    });

    it('should render with journal article', () => {
        const wrapper = setup();
        expect(wrapper.root.findByProps({ className: 'eraYearListed' }).children.join('')).toEqual(
            ' (ERA 2010 Journal(s) Listed)',
        );
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render with empty props', () => {
        const wrapper = setup({ publication: {} });
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render without era journal listed', () => {
        delete testJournalArticle.fez_matched_journals.fez_journal;
        const wrapper = setup();
        expect(wrapper.root.findAllByProps({ className: 'eraYearListed' }).length).toEqual(0);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render with deduped era years', () => {
        testJournalArticle.fez_matched_journals.fez_journal = {
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
        };
        const wrapper = setup();
        expect(wrapper.root.findByProps({ className: 'eraYearListed' }).children.join('')).toEqual(
            ' (ERA 2001 Journal(s) Listed)',
        );
    });

    it('should render with multiple era years', () => {
        testJournalArticle.fez_matched_journals.fez_journal = {
            fez_journal_era: [
                {
                    jni_id: 13071,
                    jnl_era_source_year: 2001,
                },
                {
                    jni_id: 13072,
                    jnl_era_source_year: 2002,
                },
            ],
        };
        const wrapper = setup();
        expect(wrapper.root.findByProps({ className: 'eraYearListed' }).children.join('')).toEqual(
            ' (ERA 2001, 2002 Journal(s) Listed)',
        );
    });

    it('should render without matched journals', () => {
        testJournalArticle.fez_matched_journals.fez_journal = [];
        const wrapper = setup();
        expect(wrapper.root.findAllByProps({ className: 'eraYearListed' }).length).toEqual(0);
    });

    it('should render without sherpa romeo', () => {
        delete testJournalArticle.fez_record_search_key_issn[0].rek_issn_lookup;
        delete testJournalArticle.fez_record_search_key_issn[0].fez_sherpa_romeo;

        const wrapper = setup();
        expect(wrapper.toJSON()).toMatchSnapshot();
    });
});
