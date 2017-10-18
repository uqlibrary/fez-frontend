jest.dontMock('./SearchKeyAutoComplete');

import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {SearchKeyAutoComplete} from './SearchKeyAutoComplete';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import {authorsSearch} from 'mock/data';
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

function setup({searchKeySuggestions, onChange, actions, disabled, isShallow = true}){
    const props = {
        searchKeySuggestions: searchKeySuggestions || [], // : PropTypes.array,
        onChange: onChange || jest.fn(), // : PropTypes.func.isRequired,
        actions: actions || {}, // : PropTypes.object.isRequired,
        disabled // : PropTypes.bool
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <SearchKeyAutoComplete {...props} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><SearchKeyAutoComplete {...props} /></Provider>);
}

beforeAll(() => {
    injectTapEventPlugin();
});
describe('SearchKeyAutoComplete tests ', () => {
    it('renders textfield correctly with autocomplete', () => {
        const wrapper = setup({isShallow: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('loads search key suggestions on search text changed ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({actions: {searchKeyLookUp: testFunction}}).find('SearchKeyAutoComplete').dive();
        wrapper.instance()._onSearchKeyChanged('australia', [], {source: 'change'});
        expect(testFunction).toBeCalled();
    });

    it('selects and sets search key value ', () => {
        const wrapper = setup({}).find('SearchKeyAutoComplete').dive();
        wrapper.instance()._onSearchKeySelected('Some input text for search key', 0);
        expect(wrapper.state().searchKeyAsPublished).toBe('Some input text for search key');
    });

    it('sets entered search key value ', () => {
        const wrapper = setup({}).find('SearchKeyAutoComplete').dive();
        wrapper.instance()._onSearchKeySelected('New input text entered', -1);
        expect(wrapper.state().searchKeyAsPublished).toBe('New input text entered');
    });
});