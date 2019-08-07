import BookCitation from './BookCitation';
import { book } from 'mock/data/testing/records';
import { editedBook } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(BookCitation, props, args);
}

describe('BookCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: book });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render citation for edited book record', () => {
        const wrapper = setup({ publication: editedBook });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty doi view ', () => {
        const wrapper = setup({ publication: { ...editedBook, fez_record_search_key_doi: { rek_doi: null } } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
