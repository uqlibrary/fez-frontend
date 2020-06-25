import { GenericSelectFieldClass } from './GenericSelectField';
import GenericSelectField from './GenericSelectField';

function setup(testProps = {}) {
    const props = {
        classes: {},
        theme: {},
        genericSelectFieldId: 'generic-test',
        ...testProps,
    };
    return getElement(GenericSelectFieldClass, props);
}

describe('GenericSelectField', () => {
    describe('should render snapshots for', () => {
        it('no items', () => {
            const wrapper = setup();
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('one item', () => {
            const wrapper = setup({
                itemsList: ['Item 1'],
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('loading items', () => {
            const wrapper = setup({
                itemsList: ['Item 1', 'Item 2', 'Item 3'],
                itemsLoading: true,
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('loading items', () => {
            const wrapper = setup({
                itemsList: ['Item 1', 'Item 2', 'Item 3'],
                itemsLoading: false,
                hideLabel: true,
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('Lifecycle methods', () => {
        it('UNSAFE_componentWillReceiveProps should call method', () => {
            const testFn = jest.fn();
            const wrapper = setup({
                itemsList: ['Item 1', 'Item 2', 'Item 3'],
                value: 'Item 2',
                parentItemsId: 1234,
                loadItemsList: testFn,
            });
            wrapper.setProps({
                parentItemsId: 4567,
            });
            expect(testFn).toHaveBeenCalled();
        });

        it('UNSAFE_componentWillReceiveProps should not call method', () => {
            const testFn = jest.fn();
            const wrapper = setup({
                itemsList: ['Item 1', 'Item 2', 'Item 3'],
                value: 'Item 2',
                parentItemsId: 1234,
                loadItemsList: testFn,
            });
            wrapper.setProps({
                parentItemsId: 1234,
            });
            expect(testFn).not.toHaveBeenCalled();
        });
    });

    describe('Methods', () => {
        it('loads items list for parent ID 1234', () => {
            const testLoadItemListFn = jest.fn();
            setup({
                loadItemsList: testLoadItemListFn,
                parentItemsId: 1234,
            });
            expect(testLoadItemListFn).toHaveBeenCalledWith(1234);
        });

        it('onChange', () => {
            const testOnChangeFn = jest.fn();
            const wrapper = setup({
                itemsList: ['Item 1', 'Item 2', 'Item 3'],
                value: 'Item 2',
                onChange: testOnChangeFn,
            });
            wrapper.instance()._itemSelected({
                target: {
                    value: 'Item 2',
                },
            });
            expect(testOnChangeFn).toHaveBeenCalled();
        });

        it('_itemSelected with valid event value', () => {
            const testFn = jest.fn();
            const event = {
                target: {
                    value: ['one', 'two', 'three'],
                },
            };
            const wrapper = setup({
                onChange: testFn,
            });
            wrapper.instance()._itemSelected(event);
            expect(testFn).toBeCalledWith(['one', 'two', 'three']);
        });

        it('_itemSelected with a single neg value', () => {
            const testFn = jest.fn();
            const event = {
                target: {
                    value: [-1],
                },
            };
            const wrapper = setup({
                onChange: testFn,
            });
            wrapper.instance()._itemSelected(event);
            expect(testFn).toBeCalledWith('');
        });

        it('_itemSelected should shift the neg value', () => {
            const testFn = jest.fn();
            const event = {
                target: {
                    value: [-1, 'two', 'three'],
                },
            };
            const wrapper = setup({
                onChange: testFn,
            });
            wrapper.instance()._itemSelected(event);
            expect(testFn).toBeCalledWith(['two', 'three']);
        });

        it('newValue (multiple: true, hideLabel, true)', () => {
            const wrapper = setup({
                multiple: true,
                hideLabel: true,
                value: [1, 2, 3],
            });
            expect(wrapper.instance().newValue()).toEqual([1, 2, 3]);
        });

        it('newValue (multiple: true, hideLabel, false)', () => {
            const wrapper = setup({
                multiple: true,
                hideLabel: false,
                value: [1, 2, 3],
            });
            expect(wrapper.instance().newValue()).toEqual([1, 2, 3]);
        });

        it('newValue (multiple: false, hideLabel, false)', () => {
            const wrapper = setup({
                multiple: false,
                hideLabel: false,
                value: [1, 2, 3],
            });
            expect(wrapper.instance().newValue()).toEqual([1, 2, 3]);
        });

        it('newValue (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({
                multiple: false,
                hideLabel: true,
                value: [1, 2, 3],
            });
            expect(wrapper.instance().newValue()).toEqual([1, 2, 3]);
        });

        it('newValue null value (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({
                multiple: false,
                hideLabel: true,
                value: null,
            });
            expect(wrapper.instance().newValue()).toEqual('-1');
        });

        it('newValue null value (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({
                multiple: true,
                hideLabel: true,
                value: null,
            });
            expect(wrapper.instance().newValue()).toEqual([-1]);
        });

        it('newValue null value (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({
                multiple: true,
                hideLabel: false,
                value: null,
            });
            expect(wrapper.instance().newValue()).toEqual([]);
        });

        it('loadingIndicationText', () => {
            const wrapper = setup({
                itemsLoading: true,
                loadingHint: 'Loading',
                hintText: 'Hint',
            });
            expect(wrapper.instance().loadingIndicationText()).toEqual('Loading');
        });

        it('loadingIndicationText', () => {
            const wrapper = setup({
                itemsLoading: false,
                loadingHint: 'Loading',
                hintText: 'Hint',
            });
            expect(wrapper.instance().loadingIndicationText()).toEqual('Hint');
        });

        it('renderMenuItems (hideLabel: false)', () => {
            const wrapper = setup({
                hideLabel: false,
                itemsList: [
                    { value: 1, text: 'One' },
                    { value: 2, text: 'Two' },
                    { value: 3, text: 'Three' },
                ],
            });
            expect(wrapper.instance().renderMenuItems()).toMatchSnapshot();
        });

        it('renderMenuItems (hideLabel: true)', () => {
            const wrapper = setup({
                hideLabel: true,
                itemsList: [
                    { value: 1, text: 'One' },
                    { value: 2, text: 'Two' },
                    { value: 3, text: 'Three' },
                ],
            });
            expect(wrapper.instance().renderMenuItems()).toMatchSnapshot();
        });

        it('renderMenuItems (hideLabel: false)', () => {
            const wrapper = setup({
                hideLabel: false,
                itemsList: [1, 2, 3],
            });
            expect(wrapper.instance().renderMenuItems()).toMatchSnapshot();
        });

        it('renderMenuItems (multiple: true)', () => {
            const wrapper = setup({
                multiple: true,
                itemsList: [1, 2, 3],
                value: [1],
            });
            expect(wrapper.instance().renderMenuItems()).toMatchSnapshot();
        });

        it('Shows an error', () => {
            const wrapper = setup({
                hideLabel: false,
                itemsList: [1, 2, 3],
                error: 'This is an error',
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('Full mount', () => {
        it('should render', () => {
            const wrapper = getElement(
                GenericSelectField,
                {
                    loadItemsList: jest.fn(),
                    parentItemsId: 1234,
                    genericSelectFieldId: 'generic-test',
                },
                { isShallow: false },
            );
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
