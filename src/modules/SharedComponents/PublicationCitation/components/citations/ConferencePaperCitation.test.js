import ConferencePaperCitation from './ConferencePaperCitation';
import {conferencePaper} from 'mock/data/testing/records';
import mui1theme from 'config';

function setup(testProps, isShallow = false) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(ConferencePaperCitation, props, isShallow);
}

describe('ConferencePaperCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({publication: conferencePaper});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
