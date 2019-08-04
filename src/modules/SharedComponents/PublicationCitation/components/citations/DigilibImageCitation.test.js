import DigilibImageCitation from './DigilibImageCitation';
import { digilibImage } from 'mock/data/testing/records';

function setup(testProps, isShallow = false) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(DigilibImageCitation, props, isShallow);
}

describe('DigilibImageCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: digilibImage });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
