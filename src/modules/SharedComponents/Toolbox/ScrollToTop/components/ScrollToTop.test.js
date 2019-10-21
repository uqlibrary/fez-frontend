import { ScrollToTop } from './ScrollToTop';
jest.mock('react-router-dom');

function setup(testProps, isShallow = true) {
    const props = {
        children: 'Children',
        location: {},
        ...testProps,
    };

    return getElement(ScrollToTop, props, isShallow);
}
describe('ScrollToTop component', () => {
    it('should render given children', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    // it('should scrollTo to if location is changed', () => {
    //     const testLocation = {}; // {} !== {}
    //     const scrollToFn = jest.fn();
    //     global.window.scrollTo = scrollToFn;
    //     const wrapper = setup({});
    //
    //     // test if changed
    //     wrapper.setProps({
    //         location: testLocation,
    //     });
    //     expect(scrollToFn).toHaveBeenCalledWith(0, 0);
    //
    //     // test else
    //     scrollToFn.mockClear();
    //     wrapper.setProps({
    //         location: testLocation,
    //     });
    //     expect(scrollToFn).not.toBeCalled();
    // });
});
