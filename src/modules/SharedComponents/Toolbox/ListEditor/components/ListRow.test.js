import ListRow from './ListRow';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        index: testProps.index || 0, // PropTypes.number.isRequired,
        item: testProps.item || 'one', // PropTypes.object.isRequired,
        canMoveUp: testProps.canMoveUp || false, // PropTypes.bool,
        canMoveDown: testProps.canMoveDown || false, // PropTypes.bool,
        onMoveUp: testProps.onMoveUp, // PropTypes.func,
        onMoveDown: testProps.onMoveDown, // PropTypes.func,
        onDelete: testProps.onDelete, // PropTypes.func,
        disabled: testProps.disabled || false // PropTypes.bool
    };
    return getElement(ListRow, props, isShallow);
}

describe('ListRow renders ', () => {
    it('a row with index and item and delete button', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and item set, renders reorder buttons, and delete button', () => {
        const wrapper = setup({canMoveUp: true, canMoveDown: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('a row with index and item set calls move up function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({canMoveUp: true, onMoveUp: testFunction});
        const button = wrapper.find('IconButton .reorderUp');
        expect(button.length).toBe(1);

        const buttonDown = wrapper.find('IconButton .reorderDown');
        expect(buttonDown.length).toBe(0);

        wrapper.instance().onMoveUp();
        expect(testFunction).toBeCalled();
    });


    it('a row with index and item set calls move down function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, canMoveDown: true, onMoveDown: testFunction});

        const button = wrapper.find('IconButton .reorderDown');
        expect(button.length).toBe(1);

        const buttonUp = wrapper.find('IconButton .reorderUp');
        expect(buttonUp.length).toBe(0);

        wrapper.instance().onMoveDown();
        expect(testFunction).toBeCalled;
    });

    it('a row with index and item set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, onDelete: testFunction});
        expect(toJson(wrapper)).toMatchSnapshot();
        const button = wrapper.find('IconButton .itemDelete');
        expect(button.length).toBe(1);
        wrapper.instance().deleteRecord();
        expect(testFunction).toBeCalled;
    });
});
