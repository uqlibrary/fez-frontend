import PatentCitation from './PatentCitation';
import { patent } from 'mock/data/testing/records';

function setup(testProps, isShallow = false) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(PatentCitation, props, isShallow);
}

describe('PatentCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: patent });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
