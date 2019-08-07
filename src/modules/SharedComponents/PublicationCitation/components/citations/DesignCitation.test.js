import DesignCitation from './DesignCitation';
import { design } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(DesignCitation, props, args);
}

describe('DesignCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: design });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty source', () => {
        const wrapper = setup({
            publication: {
                ...design,
                fez_record_search_key_source: { rek_source: null },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
