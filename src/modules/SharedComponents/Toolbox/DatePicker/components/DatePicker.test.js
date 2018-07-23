import DatePicker from './DatePicker';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(DatePicker, props, isShallow);
}

describe('Component DatePicker', () => {

    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should render as expected', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
