import ImageDocumentCitation from './ImageDocumentCitation';
import { imageDocument } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(ImageDocumentCitation, props, args);
}

describe('ImageDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: imageDocument });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
