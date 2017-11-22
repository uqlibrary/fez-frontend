jest.dontMock('./GenericSelectField');

import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import GenericSelectField from './GenericSelectField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {locale} from 'config';

beforeAll(() => {
    injectTapEventPlugin();
});

function setup({onChange = jest.fn(), itemsList = [], itemsLoading = false, loadItemsList = jest.fn(), selectedValue = null, parentItemsId = null, disabled = false, isShallow = false}){
    const props = {
        onChange: onChange,
        itemsList: itemsList,
        itemsLoading: itemsLoading,
        loadItemsList: loadItemsList,
        selectedValue: selectedValue,
        parentItemsId: parentItemsId,
        disabled: disabled
    };

    if(isShallow) {
        return shallow(<GenericSelectField {...props} />);
    }

    return mount(<GenericSelectField {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
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