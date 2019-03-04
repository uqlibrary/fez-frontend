import ListEditor from './ListEditor';

function setup(testProps) {
    const props = {
        className: 'testClass', // : PropTypes.string,
        searchKey: {value: 'value', order: 'order'}, // : PropTypes.object.isRequired,
        isValid: jest.fn(), // PropTypes.func,
        disabled: false, // PropTypes.bool,
        onChange: jest.fn(), // PropTypes.func,
        formComponent: jest.fn(),
        inputField: jest.fn(),
        hideReorder: false,
        distinctOnly: false,
        errorText: '',
        ...testProps
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
        wrapper.instance().moveUpList('one', 0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should move down an item', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: ['one', 'two', 'three']});
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('two');
        wrapper.instance().moveDownList('two', 1);
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('three');
        wrapper.instance().moveDownList('three', 2);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render items individually when comma separated not more than maxCount', () => {
        const wrapper = setup({ maxCount: 5 });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().addItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
        wrapper.instance().addItem('two,three,four');
        expect(wrapper.state().itemList.length).toEqual(4);
        wrapper.instance().addItem('two,three,four,,five,,');
        expect(wrapper.state().itemList.length).toEqual(5);
    });

    it('should render input value as itemList', () => {
        const wrapper = setup({
            input: {
                name: 'test',
                value: {
                    toJS: () => ([
                        {
                            rek_value: 'test 1'
                        },
                        {
                            rek_value: 'test 2'
                        }
                    ])
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should add item and set state', () => {
        const wrapper = setup({
            maxCount: 5,
            distinctOnly: true,
            locale: {
                row: {},
                form: {},
                header: {}
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().addItem({
            key: 'test',
            value: 'test'
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call default input normaliser function', () => {
        const wrapper = setup({
            formComponent: () => <div/>
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        const result = wrapper.find('formComponent').props().normalize('test');
        expect(result).toBe('test');
    });

    it('should not call transformOutput if onChange prop method is not defined', () => {
        const wrapper = setup({
            onChange: null
        });
        const test = jest.spyOn(wrapper.instance(), 'transformOutput');
        wrapper.instance().componentWillUpdate({}, {});
        expect(test).toHaveBeenCalledTimes(0);
    })
});
