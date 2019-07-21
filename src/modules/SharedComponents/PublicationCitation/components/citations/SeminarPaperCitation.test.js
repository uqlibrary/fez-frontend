import SeminarPaperCitation from './SeminarPaperCitation';
import { seminarPaper } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(SeminarPaperCitation, props, args);
}

describe('SeminarPaperCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: seminarPaper });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
