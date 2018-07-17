import DatePicker from './DatePicker';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(DatePicker, props, isShallow);
}

describe('Component DatePicker', () => {

    it('should render as expected', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
