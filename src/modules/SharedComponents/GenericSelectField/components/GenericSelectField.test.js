import {GenericSelectFieldClass} from './GenericSelectField';
import GenericSelectField from './GenericSelectField';

function setup(testProps, isShallow = true){
    const props = {
        classes: {},
        theme:{},
        ...testProps
    };
    return getElement(GenericSelectFieldClass, props, isShallow);
}

describe('GenericSelectField ', () => {
    describe('should render ', () => {
        describe('snapshots for ', () => {
            it('no items', () => {
                const wrapper = setup({});
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('one item', () => {
                const wrapper = setup({itemsList: ['Item 1']});
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('loading items', () => {
                const wrapper = setup({itemsList: ['Item 1', 'Item 2', 'Item 3'], itemsLoading: true});
                expect(toJson(wrapper)).toMatchSnapshot();
            });

            it('loading items', () => {
                const wrapper = setup({itemsList: ['Item 1', 'Item 2', 'Item 3'], itemsLoading: false, hideLabel: true});
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });
    });

    describe('should call life cycle method ', () => {
        describe('componentDidMount and ', () => {

            it('loads items list for parent ID 1234', () => {
                const testLoadItemListFn = jest.fn();
                setup({loadItemsList: testLoadItemListFn, parentItemsId: 1234});
                expect(testLoadItemListFn).toHaveBeenCalledWith(1234);
            });

            it('onChange', () => {
                const testOnChangeFn = jest.fn();
                const wrapper = setup({itemsList: ['Item 1', 'Item 2', 'Item 3'], selectedValue: 'Item 2', onChange: testOnChangeFn});
                wrapper.instance()._itemSelected({target: {value: 'Item 2'}});
                expect(testOnChangeFn).toHaveBeenCalled();
            });

            it('componentWillReceiveProps should call method', () => {
                const wrapper = setup({itemsList: ['Item 1', 'Item 2', 'Item 3'], selectedValue: 'Item 2', parentItemsId: 1234, loadItemsList: jest.fn()});
                const newprops = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
                wrapper.setProps({parentItemsId: 4567});
                wrapper.update();
                expect(newprops).toHaveBeenCalled();
            });

            it('componentWillReceiveProps should not call method', () => {
                const wrapper = setup({itemsList: ['Item 1', 'Item 2', 'Item 3'], selectedValue: 'Item 2', parentItemsId: 1234, loadItemsList: jest.fn()});
                const newprops = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
                wrapper.setProps({parentItemsId: 1234});
                wrapper.update();
                expect(newprops).toHaveBeenCalled();
            });

        });

    });

    describe('Methods ', () => {
        it('_itemSelected with valid event value', () => {
            const testFn = jest.fn();
            const event = {target: {value: ['one', 'two', 'three']}};
            const wrapper = setup({onChange: testFn});
            wrapper.instance()._itemSelected(event);
            expect(testFn).toBeCalledWith(["one", "two", "three"]);
        });

        it('_itemSelected with a single neg value', () => {
            const testFn = jest.fn();
            const event = {target: {value: [-1]}};
            const wrapper = setup({onChange: testFn});
            wrapper.instance()._itemSelected(event);
            expect(testFn).toBeCalledWith('');
        });

        it('_itemSelected should shift the neg value', () => {
            const testFn = jest.fn();
            const event = {target: {value: [-1, 'two', 'three']}};
            const wrapper = setup({onChange: testFn});
            wrapper.instance()._itemSelected(event);
            expect(testFn).toBeCalledWith(["two", "three"]);
        });

        it('getMenuItemProps as a multiple selection', () => {
            const testFn = jest.fn();
            const item = {value: 1, text: 'test'};
            const selectedValue = [1];
            const wrapper = setup({});
            expect(wrapper.instance().getMenuItemProps(item, selectedValue, true)).toEqual({"selected": true, "value": 1});

        });

        it('getMenuItemProps as a multiple selection with single itemlist object', () => {
            const testFn = jest.fn();
            const item = 1;
            const selectedValue = [1];
            const wrapper = setup({});
            expect(wrapper.instance().getMenuItemProps(item, selectedValue, true)).toEqual({"selected": true, "value": 1});

        });

        it('getMenuItemProps as a single selection with single itemlist object', () => {
            const testFn = jest.fn();
            const item = 1;
            const selectedValue = [1];
            const wrapper = setup({});
            expect(wrapper.instance().getMenuItemProps(item, selectedValue, false)).toEqual({"value": 1});

        });

        it('getMenuItemProps as a single selection from single', () => {
            const testFn = jest.fn();
            const item = {value: 1, text: 'test'};
            const selectedValue = 1;
            const wrapper = setup({});
            expect(wrapper.instance().getMenuItemProps(item, selectedValue, false)).toEqual({"value": 1});

        });

        it('newValue (multiple: true, hideLabel, true)', () => {
            const wrapper = setup({multiple: true, hideLabel: true, selectedValue: [1,2,3]});
            expect(wrapper.instance().newValue()).toEqual([1,2,3]);
        });

        it('newValue (multiple: true, hideLabel, false)', () => {
            const wrapper = setup({multiple: true, hideLabel: false, selectedValue: [1,2,3]});
            expect(wrapper.instance().newValue()).toEqual([1,2,3]);
        });

        it('newValue (multiple: false, hideLabel, false)', () => {
            const wrapper = setup({multiple: false, hideLabel: false, selectedValue: [1,2,3]});
            expect(wrapper.instance().newValue()).toEqual([1,2,3]);
        });

        it('newValue (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({multiple: false, hideLabel: true, selectedValue: [1,2,3]});
            expect(wrapper.instance().newValue()).toEqual([1,2,3]);
        });

        it('newValue null value (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({multiple: false, hideLabel: true, selectedValue: null});
            expect(wrapper.instance().newValue()).toEqual('-1');
        });

        it('newValue null value (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({multiple: true, hideLabel: true, selectedValue: null});
            expect(wrapper.instance().newValue()).toEqual([-1]);
        });

        it('newValue null value (multiple: false, hideLabel, true)', () => {
            const wrapper = setup({multiple: true, hideLabel: false, selectedValue: null});
            expect(wrapper.instance().newValue()).toEqual([]);
        });

        it('loadingIndicationText', () => {
            const wrapper = setup({itemsLoading: true, loadingHint: 'Loading', hintText: 'Hint'});
            expect(wrapper.instance().loadingIndicationText()).toEqual('Loading');
        });

        it('loadingIndicationText', () => {
            const wrapper = setup({itemsLoading: false, loadingHint: 'Loading', hintText: 'Hint'});
            expect(wrapper.instance().loadingIndicationText()).toEqual('Hint');
        });


        it('renderMenuItems (hideLabel: false)', () => {
            const wrapper = setup({
                hideLabel: false,
                itemsList: [{value: 1, text: 'One'}, {value: 2, text: 'Two'}, {value: 3, text: 'Three'}]
            });
            expect(JSON.stringify(wrapper.instance().renderMenuItems())).toEqual("[false,{\"key\":\"1\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":1,\"disabled\":false,\"aria-label\":\"One\",\"children\":\"One\"},\"_owner\":null,\"_store\":{}},{\"key\":\"2\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":2,\"disabled\":false,\"aria-label\":\"Two\",\"children\":\"Two\"},\"_owner\":null,\"_store\":{}},{\"key\":\"3\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":3,\"disabled\":false,\"aria-label\":\"Three\",\"children\":\"Three\"},\"_owner\":null,\"_store\":{}}]")
        });

        it('renderMenuItems (hideLabel: true)', () => {
            const wrapper = setup({
                hideLabel: true,
                itemsList: [{value: 1, text: 'One'}, {value: 2, text: 'Two'}, {value: 3, text: 'Three'}]
            });
            expect(JSON.stringify(wrapper.instance().renderMenuItems())).toEqual("[{\"key\":\"0\",\"ref\":null,\"props\":{\"value\":-1,\"style\":{\"display\":\"block\"},\"disabled\":true,\"children\":null},\"_owner\":null,\"_store\":{}},{\"key\":\"1\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":1,\"disabled\":false,\"aria-label\":\"One\",\"children\":\"One\"},\"_owner\":null,\"_store\":{}},{\"key\":\"2\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":2,\"disabled\":false,\"aria-label\":\"Two\",\"children\":\"Two\"},\"_owner\":null,\"_store\":{}},{\"key\":\"3\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":3,\"disabled\":false,\"aria-label\":\"Three\",\"children\":\"Three\"},\"_owner\":null,\"_store\":{}}]")
        });

       it('renderMenuItems (hideLabel: false)', () => {
            const wrapper = setup({
                hideLabel: false,
                itemsList: [1,2,3]
            });
            expect(JSON.stringify(wrapper.instance().renderMenuItems())).toEqual("[false,{\"key\":\"1\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":1,\"disabled\":true,\"aria-label\":1,\"children\":1},\"_owner\":null,\"_store\":{}},{\"key\":\"2\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":2,\"disabled\":true,\"aria-label\":2,\"children\":2},\"_owner\":null,\"_store\":{}},{\"key\":\"3\",\"ref\":null,\"props\":{\"classes\":{},\"style\":{\"display\":\"block\"},\"value\":3,\"disabled\":true,\"aria-label\":3,\"children\":3},\"_owner\":null,\"_store\":{}}]")
        });

        it('Shows an error', () => {
            const wrapper = setup({
                hideLabel: false,
                itemsList: [1,2,3],
                error: 'This is an error'
            });
            expect(toJson(wrapper)).toMatchSnapshot();

        });

    });

    describe('Full mount ', () => {
        it('should render', () => {
            const wrapper = getElement(GenericSelectField, {loadItemsList: jest.fn(), parentItemsId: 1234}, false);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

    });

});
