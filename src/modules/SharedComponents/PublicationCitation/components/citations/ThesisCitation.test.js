import ThesisCitation from './ThesisCitation';
import { thesis } from 'mock/data/testing/records';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return getElement(ThesisCitation, props, args);
}

describe('ThesisCitation renders ', () => {
    it('component with empty publication', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const wrapper = setup({ publication: thesis });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with an empty doi view', () => {
        const wrapper = setup({
            publication: {
                ...thesis,
                fez_record_search_key_doi: { rek_doi: null },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
