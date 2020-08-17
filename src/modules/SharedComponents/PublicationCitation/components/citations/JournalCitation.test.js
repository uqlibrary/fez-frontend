import JournalCitation from './JournalCitation';
import { journal } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(JournalCitation, props, args);
}

describe('JournalCitation', () => {
    it('renders with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper.find('[className="citationContent citationJournal"]'))).toMatchSnapshot();
    });

    it('renders with a mock espace record', () => {
        const wrapper = setup({
            publication: {
                ...journal,
                fez_record_search_key_doi: {
                    rek_doi: '10.14264/186337',
                },
            },
        });
        expect(toJson(wrapper.find('[className="citationContent citationJournal"]'))).toMatchSnapshot();
    });
});
