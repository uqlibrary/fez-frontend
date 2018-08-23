import {ListRowHeader} from './ListRowHeader';

function setup(testProps, isShallow = true) {
    const props = {
        onDeleteAll: jest.fn(),
        disabled: false,
        classes: {
            center: '',
            header: ''
        },
        ...testProps,
    };
    return getElement(ListRowHeader, props, isShallow);
}

describe('ListRowHeader renders ', () => {

    it('header for contributor editor control with name and delete all button only', () => {
        const wrapper = setup({ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
