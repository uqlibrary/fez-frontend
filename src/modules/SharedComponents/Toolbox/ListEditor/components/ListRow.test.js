import { ListRow } from './ListRow';
import ListRowWithStyles from './ListRow';

function setup(testProps = {}, args = {}) {
    const props = {
        index: 0,
        item: 'one',
        canMoveUp: false,
        canMoveDown: false,
        onMoveUp: jest.fn(),
        onMoveDown: jest.fn(),
        onDelete: jest.fn(),
        disabled: false,
        classes: { center: 'center', right: 'right' },
        ...testProps,
    };
    return getElement(ListRow, props, args);
}

describe('ListRow renders ', () => {
    it('should render default view with styles', () => {
        const wrapper = getElement(ListRowWithStyles, { index: 0, item: 'one' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and item and delete button', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and item set, renders reorder buttons, and delete button', () => {
        const wrapper = setup({ canMoveUp: true, canMoveDown: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and item set calls move up function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ canMoveUp: true, onMoveUp: testFunction }, { isShallow: false });
        const button = wrapper.find('pure(KeyboardArrowUpIcon)');
        expect(button.length).toBe(1);

        const buttonDown = wrapper.find('pure(KeyboardArrowDownIcon)');
        expect(buttonDown.length).toBe(0);
    });

    it('a row with index and item set calls move down function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ index: 0, canMoveDown: true, onMoveDown: testFunction }, { isShallow: false });

        const button = wrapper.find('pure(KeyboardArrowDownIcon)');
        expect(button.length).toBe(1);

        const buttonUp = wrapper.find('pure(KeyboardArrowUpIcon)');
        expect(buttonUp.length).toBe(0);
    });

    it('a row with index and item set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ index: 0, onDelete: testFunction }, { isShallow: false });

        const button = wrapper.find('pure(DeleteIcon)');
        expect(button.length).toBe(1);
    });

    it('should call show confirmation on deleting row', () => {
        const showConfirmationFn = jest.fn();
        const wrapper = setup({
            hideReorder: true,
        });
        wrapper.instance().confirmationBox = {
            showConfirmation: showConfirmationFn,
        };

        wrapper
            .find('WithStyles(IconButton)')
            .props()
            .onClick();
        expect(showConfirmationFn).toHaveBeenCalled();
    });

    it('should delete row on confirmation', () => {
        const onDeleteFn = jest.fn();
        const wrapper = setup({
            hideReorder: true,
            onDelete: onDeleteFn,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('WithStyles(ConfirmDialogBox)')
            .props()
            .onAction();
        expect(onDeleteFn).toHaveBeenCalled();
    });

    it('should move row up', () => {
        const onMoveUpFn = jest.fn();
        const wrapper = setup({
            onMoveUp: onMoveUpFn,
            canMoveUp: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('WithStyles(IconButton)')
            .get(0)
            .props.onClick();
        expect(onMoveUpFn).toHaveBeenCalled();
    });

    it('should move row down', () => {
        const onMoveDownFn = jest.fn();
        const wrapper = setup({
            onMoveDown: onMoveDownFn,
            canMoveDown: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper
            .find('WithStyles(IconButton)')
            .get(0)
            .props.onClick();
        expect(onMoveDownFn).toHaveBeenCalled();
    });

    it('should not call handlers if row is disabled', () => {
        const wrapper = setup({
            disabled: true,
        });
        wrapper.instance().deleteRecord();
        expect(wrapper.instance().props.onDelete).not.toBeCalled();
        wrapper.instance().onMoveUp();
        expect(wrapper.instance().props.onMoveUp).not.toBeCalled();
        wrapper.instance().onMoveDown();
        expect(wrapper.instance().props.onMoveDown).not.toBeCalled();
    });

    it('should handle edit', () => {
        const onEditFn = jest.fn();
        const wrapper = setup({ onEdit: onEditFn, index: 1 });
        wrapper.instance()._handleEdit();
        expect(onEditFn).toHaveBeenCalledWith(1);
    });

    it('should render edit button', () => {
        const wrapper = setup({ canEdit: true });
        expect(wrapper).toMatchSnapshot();
    });
});
