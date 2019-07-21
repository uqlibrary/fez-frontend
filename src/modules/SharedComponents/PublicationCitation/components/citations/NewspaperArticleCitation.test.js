import NewspaperArticleCitation from './NewspaperArticleCitation';
import { newspaperArticle } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(NewspaperArticleCitation, props, args);
}

describe('NewspaperArticleCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: newspaperArticle });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty end page view', () => {
        const wrapper = setup({
            publication: {
                ...newspaperArticle,
                fez_record_search_key_end_page: { rek_end_page: null },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
