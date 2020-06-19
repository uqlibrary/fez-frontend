import { LinkInfoListEditor } from './LinkInfoListEditor';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        listEditorId: 'link-info-list-editor',
        ...testProps,
    };
    return getElement(LinkInfoListEditor, props, args);
}

describe('LinkInfoListEditor component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
