import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {AutoSuggestField} from './AutoSuggestField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';

const create = () => {
    const initialState = Immutable.Map();

    const store = {
        getState: jest.fn(() => (initialState)),
        dispatch: jest.fn(),
        subscribe: jest.fn()
    };
    const next = jest.fn();
    const invoke = (action) => thunk(store)(next)(action);
    return {store, next, invoke}
};

function setup({itemsList, onChange, className, loadSuggestions, async, itemsListLoading, category, disabled = false, isShallow = true}){
    const props = {
        itemsList: itemsList || [],         // : PropTypes.array,
        onChange: onChange || jest.fn(),    // : PropTypes.func.isRequired,
        disabled: disabled,     // PropTypes.bool
        className: className,    //PropTypes.string,
        async: async || false,
        itemsListLoading: itemsListLoading || false,
        category: category,
        loadSuggestions: loadSuggestions || jest.fn()
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <AutoSuggestField {...props} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><AutoSuggestField {...props} /></Provider>);
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('AutoSuggestField component', () => {

    it('should render', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with disabled flag set to true', () => {
        const wrapper = setup({disabled: true, isShallow: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with className set', () => {
        const wrapper = setup({className: 'requiredField', isShallow: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render autosuggest field and call action creator', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ loadSuggestions: testFunction, isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });

    it('should set selected value', () => {
        const wrapper = setup({}).find('AutoSuggestField').dive();
        expect(wrapper.state.selectedValue).toBeFalsy();
        const testValue = 'School of Economics';
        wrapper.instance().valueSelected(testValue);
        expect(wrapper.state().selectedValue).toEqual(testValue);
    });

    it('should set typed value as selected value', () => {
        const wrapper = setup({}).find('AutoSuggestField').dive();
        expect(wrapper.state.selectedValue).toBeFalsy();
        const testValue = 'School of Economics';
        wrapper.instance().textUpdated(testValue);
        expect(wrapper.state().selectedValue).toEqual(testValue);
    });
});
