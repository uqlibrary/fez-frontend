import { FreeTextListEditor } from './FreeTextListEditor';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        listEditorId: 'free-text-list-editor',
        ...testProps,
    };
    return getElement(FreeTextListEditor, props, args);
}

describe('FreeTextListEditor component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
