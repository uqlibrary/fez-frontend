import { ScaleOfSignificanceListEditor } from './ScaleOfSignificanceListEditor';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        listEditorId: 'scale-of-significance-list-editor',
        ...testProps,
    };
    return getElement(ScaleOfSignificanceListEditor, props, args);
}

describe('ScaleOfSignificanceListEditor component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
