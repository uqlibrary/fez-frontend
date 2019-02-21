import {ScrollToTop} from './ScrollToTop';
jest.mock('react-router-dom');

function setup(testProps, isShallow = true) {
    const props = {
        children: 'Childrens',
        location: {},
        ...testProps
    };

    return getElement(ScrollToTop, props, isShallow);
}
describe('ScrollToTop component', () => {
    it('should render given childrens', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should scrollTo to if location is changed', () => {
        const scrollToFn = jest.fn();
        global.window.scrollTo = scrollToFn;
        const wrapper = setup({});
        wrapper.setProps({
            location: 'test'
        });
        expect(scrollToFn).toHaveBeenCalledWith(0, 0);
    });
});
