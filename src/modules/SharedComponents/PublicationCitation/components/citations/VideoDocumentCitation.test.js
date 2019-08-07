import VideoDocumentCitation from './VideoDocumentCitation';
import { videoDocument } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        classes: {},
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(VideoDocumentCitation, props, args);
}

describe('VideoDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: videoDocument });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
