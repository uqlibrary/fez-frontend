import { ScaleOfSignificanceTemplate } from './ScaleOfSignificanceTemplate';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: { value: {} },
        ...testProps,
    };
    return getElement(ScaleOfSignificanceTemplate, props, args);
}

describe('ScaleOfSignificanceTemplate component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
