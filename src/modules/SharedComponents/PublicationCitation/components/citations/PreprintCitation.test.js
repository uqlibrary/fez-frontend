import PreprintCitation from './PreprintCitation';
import { preprint } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(PreprintCitation, props, args);
}

describe('PreprintCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: preprint });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
