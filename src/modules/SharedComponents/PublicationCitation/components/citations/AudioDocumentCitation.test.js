import AudioDocumentCitation from './AudioDocumentCitation';
import { audioDocument } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(AudioDocumentCitation, props, args);
}

describe('AudioDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: audioDocument });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty doi view ', () => {
        const wrapper = setup({ publication: { ...audioDocument, fez_record_search_key_doi: {} } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
