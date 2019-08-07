import ConferencePaperCitation from './ConferencePaperCitation';
import { conferencePaper } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(ConferencePaperCitation, props, args);
}

describe('ConferencePaperCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: conferencePaper });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
