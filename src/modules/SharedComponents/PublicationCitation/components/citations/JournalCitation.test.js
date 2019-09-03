import JournalCitation from './JournalCitation';
import { journal } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(JournalCitation, props, args);
}

describe('JournalCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: journal });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
