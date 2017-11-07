jest.dontMock('./ListEditor');

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import ListEditor from './ListEditor';
import injectTapEventPlugin from 'react-tap-event-plugin';

beforeAll(() => {
    injectTapEventPlugin();
});

function setup({className, searchKey, maxCount, isValid, disabled, onChange}) {

    const props = {
        className, // : PropTypes.string,
        searchKey: searchKey || {value: 'value', order: 'order'}, // : PropTypes.object.isRequired,
        maxCount: maxCount || 0, // PropTypes.number,
        isValid: isValid || jest.fn(), // PropTypes.func,
        disabled: disabled || false, // PropTypes.bool,
        onChange: onChange || jest.fn() // PropTypes.func,
        // locale: PropTypes.object
    };

    return shallow(<ListEditor {...props} />);
}

describe('ListEditor tests ', () => {
    it('rendering full component with a defined className', () => {
        const wrapper = setup({ className: 'requiredField' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('rendering full component as disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('appending an item to the list', () => {
        const wrapper = setup({ });
        expect(wrapper.state().itemList.length).toEqual(0);
        wrapper.instance().addItem('one');
        expect(wrapper.state().itemList.length).toEqual(1);
    });

    it('deleting an item from the list', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: [ 'one', 'two', 'three' ]});
        expect(wrapper.state().itemList.length).toEqual(3);
        wrapper.instance().deleteItem('one', 0);
        expect(wrapper.state().itemList.length).toEqual(2);
    });

    it('deleting all items from a list', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: ['one', 'two', 'three'] });
        expect(wrapper.state().itemList.length).toEqual(3);
        wrapper.instance().deleteAllItems();
        expect(wrapper.state().itemList.length).toEqual(0);
    });

    it('moving up an item', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: ['one', 'two', 'three']});
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('two');
        wrapper.instance().moveUpList('two', 1);
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('one');
    });

    it('moving down an item', () => {
        const wrapper = setup({ });
        wrapper.setState({ itemList: ['one', 'two', 'three']});
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('two');
        wrapper.instance().moveDownList('two', 1);
        expect(wrapper.state().itemList.length).toEqual(3);
        expect(wrapper.state().itemList[1]).toEqual('three');
    });
});
