import GenericDocumentCitation from './GenericDocumentCitation';
import { generic } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(GenericDocumentCitation, props, args);
}

describe('GenericDocumentCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: generic });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty publisher and title', () => {
        const wrapper = setup({
            publication: {
                ...generic,
                fez_record_search_key_publisher: { rek_publisher: null },
                rek_title: null,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component when no title', () => {
        delete generic.rek_title;
        const wrapper = setup({
            publication: generic,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
