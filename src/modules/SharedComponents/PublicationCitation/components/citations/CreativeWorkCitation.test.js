import CreativeWorkCitation from './CreativeWorkCitation';
import { creativeWork } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(CreativeWorkCitation, props, args);
}

describe('CreativeWorkCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: creativeWork });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
