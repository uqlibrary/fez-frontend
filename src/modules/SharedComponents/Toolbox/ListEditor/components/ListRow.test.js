import {ListRow} from './ListRow';

function setup(testProps, isShallow = true) {
    const props = {
        index: 0,
        item: 'one',
        canMoveUp: false,
        canMoveDown: false,
        onMoveUp: jest.fn(),
        onMoveDown: jest.fn(),
        onDelete: jest.fn(),
        disabled: false,
        classes: {center: {}, right: {}},
        ...testProps,
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
        const wrapper = setup({canMoveUp: true, onMoveUp: testFunction}, false);
        const button = wrapper.find('pure(KeyboardArrowUpIcon)');
        expect(button.length).toBe(1);

        const buttonDown = wrapper.find('pure(KeyboardArrowDownIcon)');
        expect(buttonDown.length).toBe(0);
    });


    it('a row with index and item set calls move down function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, canMoveDown: true, onMoveDown: testFunction}, false);

        const button = wrapper.find('pure(KeyboardArrowDownIcon)');
        expect(button.length).toBe(1);

        const buttonUp = wrapper.find('pure(KeyboardArrowUpIcon)');
        expect(buttonUp.length).toBe(0);
    });

    it('a row with index and item set calls delete function', () => {
        const testFunction = jest.fn();
        const wrapper = setup({index: 0, onDelete: testFunction}, false);

        const button = wrapper.find('pure(DeleteIcon)');
        expect(button.length).toBe(1);
    });
});
