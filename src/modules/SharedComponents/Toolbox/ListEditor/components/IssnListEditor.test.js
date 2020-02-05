import { IssnListEditor } from './IssnListEditor';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };
    return getElement(IssnListEditor, props, args);
}

describe('IssnListEditor component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
