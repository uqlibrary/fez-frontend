import { Page } from './StandardPage';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = { ...testProps, classes: {} };
    return getElement(Page, props, args);
}

describe('StandardPage', () => {
    it('should display status if passed in', () => {
        const status = 'Testing';
        const wrapper = setup({ status });
        expect(wrapper.find('WithStyles(ForwardRef(Chip))').props().label).toEqual(status);
    });
});
