jest.dontMock('./ListRow');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ListRow from './ListRow';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';

function setup({index, item,
    canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDelete, disabled}){

    const props = {
        index: index || 0, // PropTypes.number.isRequired,
        item: item || 'one', // PropTypes.object.isRequired,
        canMoveUp: canMoveUp || false, // PropTypes.bool,
        canMoveDown: canMoveDown || false, // PropTypes.bool,
        onMoveUp, // PropTypes.func,
        onMoveDown, // PropTypes.func,
        onDelete, // PropTypes.func,
        disabled: disabled || false // PropTypes.bool
    };

    return shallow(<ListRow {...props} />);
}


beforeAll(() => {
    injectTapEventPlugin();
});

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
