jest.dontMock('./ListEditor');

import ListEditor from './ListEditor';

function setup(testProps) {
    // props
    // formComponent: PropTypes.func.isRequired,
    // inputField: PropTypes.func, // eg connected auto complete fields
    // className: PropTypes.string,
    // searchKey: PropTypes.object.isRequired,
    // maxCount: PropTypes.number,
    // isValid: PropTypes.func,
    // disabled: PropTypes.bool,
    // onChange: PropTypes.func,
    // locale: PropTypes.object,
    // hideReorder: PropTypes.bool,
    // distinctOnly: PropTypes.bool,
    // errorText: PropTypes.string

    const props = {
        ...testProps,
        className: testProps.className || 'testClass', // : PropTypes.string,
        searchKey: testProps.searchKey || {value: 'value', order: 'order'}, // : PropTypes.object.isRequired,
        isValid: testProps.isValid || jest.fn(), // PropTypes.func,
        disabled: testProps.disabled || false, // PropTypes.bool,
        onChange: testProps.onChange || jest.fn(), // PropTypes.func,
        formComponent: testProps.formComponent || jest.fn(),
        inputField: testProps.inputField || jest.fn(),
        hideReorder: testProps.hideOrder || false,
        distinctOnly: testProps.distinctOnly || false,
        errorText: testProps.errorText || ''
    };

    return getElement(ListEditor, props);
}

describe('ListEditor tests ', () => {
    it('should render full component with a defined className', () => {
        const wrapper = setup({ className: 'requiredField' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render full component as disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render an item to the list', () => {
        const wrapper = setup({ });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().addItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should render items not more than maxCount', () => {
        const wrapper = setup({ maxCount: 1 });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().addItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
        wrapper.instance().addItem('two');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('should not add null item to the list', () => {
        const wrapper = setup({ });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().addItem(undefined);
        wrapper.instance().addItem(null);
        wrapper.instance().addItem('');
        expect(wrapper.state().itemList.length).toEqual(0);
    });

    it('should delete an item from the list', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: [ 'one', 'two', 'three' ]});
        expect(wrapper.state().itemList.length).toEqual(3);
        wrapper.instance().deleteItem('one', 0);
        expect(wrapper.state().itemList.length).toEqual(2);
    });

    it('should delete all items from a list', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper.state().itemList.length).toEqual(3);
        wrapper.instance().deleteAllItems();
        expect(wrapper.state().itemList.length).toEqual(0);
    });

    it('should move up an item', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: ['one', 'two', 'three']});
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('two');
        wrapper.instance().moveUpList('two', 1);
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('one');
    });

    it('should move down an item', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: ['one', 'two', 'three']});
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('two');
        wrapper.instance().moveDownList('two', 1);
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('three');
    });
});
