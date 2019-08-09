import { ListRowHeader } from './ListRowHeader';
import ListRowHeaderWithStyles from './ListRowHeader';

function setup(testProps, isShallow = true) {
    const props = {
        onDeleteAll: jest.fn(),
        disabled: false,
        classes: {
            center: '',
            header: '',
        },
        ...testProps,
    };
    return getElement(ListRowHeader, props, isShallow);
}

describe('ListRowHeader renders ', () => {
    it('header for contributor editor control with name and delete all button only', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show confirmation box', () => {
        const showConfirmationFn = jest.fn();
        const wrapper = setup({});
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmationFn,
        };

        wrapper
            .find('WithStyles(IconButton)')
            .props()
            .onClick();
        expect(showConfirmationFn).toHaveBeenCalled();
    });

    it('should render default view with styles', () => {
        const wrapper = getElement(ListRowHeaderWithStyles, { onDeleteAll: jest.fn() });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set confirmation ref', () => {
        const showConfirmationFn = jest.fn();
        const wrapper = setup({});
        wrapper.instance().setConfirmationRef({
            showConfirmation: showConfirmationFn,
        });
        wrapper.instance().showConfirmation();
        expect(showConfirmationFn).toHaveBeenCalled();
    });

    it('should render larger grid item', () => {
        const wrapper = setup({
            hideReorder: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
