import JournalArticleCitation from './JournalArticleCitation';
import { journalArticle } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(JournalArticleCitation, props, args);
}

describe('JournalArticleCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: journalArticle });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
