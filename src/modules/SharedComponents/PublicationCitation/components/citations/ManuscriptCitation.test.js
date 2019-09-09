import ManuscriptCitation from './ManuscriptCitation';
import { manuscript } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(ManuscriptCitation, props, args);
}

describe('ManuscriptCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: manuscript });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
