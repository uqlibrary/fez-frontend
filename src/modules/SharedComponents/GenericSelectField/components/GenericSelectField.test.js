import GenericSelectField from './GenericSelectField';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        // onChange: PropTypes.func,
        // locale: PropTypes.object,
        // itemsList: PropTypes.array,
        // itemsLoading: PropTypes.bool,
        // loadItemsList: PropTypes.func,
        // selectedValue: PropTypes.any,
        // parentItemsId: PropTypes.number,
        // className: PropTypes.string,
        // disabled: PropTypes.bool
    };
    return getElement(GenericSelectField, props, isShallow);
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
        });
    });

    describe('should call life cycle method ', () => {
        describe('componentDidMount and ', () => {
            it('loads items list for parent ID 1234', () => {
                const testLoadItemListFn = jest.fn();
                setup({loadItemsList: testLoadItemListFn, parentItemsId: 1234});
                expect(testLoadItemListFn).toHaveBeenCalledWith(1234);
            });

            it('sets state.selectedValue to Item 2', () => {
                const wrapper = setup({itemsList: ['Item 1', 'Item 2', 'Item 3'], selectedValue: 'Item 2'});
                expect(wrapper.state().selectedValue).toBe('Item 2');
            });
        });

        it('componentWillUpdate', () => {
            const testOnChangeFn = jest.fn();
            const wrapper = setup({itemsList: ['Item 1', 'Item 2', 'Item 3'], selectedValue: 'Item 2', onChange: testOnChangeFn});
            wrapper.instance()._itemSelected({}, 2, 'Item 3');
            expect(testOnChangeFn).toHaveBeenCalled();
        });
    });
});