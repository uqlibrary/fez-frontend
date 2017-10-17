jest.dontMock('./OrgUnitForm');

import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {OrgUnitForm} from './OrgUnitForm';
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

function setup({orgUnitsList, onChange, actions, disabled, isShallow = true}){
    const props = {
        orgUnitsList: orgUnitsList || [], // : PropTypes.array,
        onChange: onChange || jest.fn(), // : PropTypes.func.isRequired,
        actions: actions || {}, // : PropTypes.object.isRequired,
        disabled // : PropTypes.bool
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <OrgUnitForm {...props} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><OrgUnitForm {...props} /></Provider>);
}

beforeAll(() => {
    injectTapEventPlugin();
});
describe('OrgUnitForm tests ', () => {
    it('renders textfield correctly with autocomplete', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ actions: { loadOrgUnits: testFunction }, isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('sets org unit display text of a OrgUnit ', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ actions: { loadOrgUnits: testFunction } }).find('OrgUnitForm').dive();
        expect(wrapper.state.orgUnitAsPublished).toBeFalsy();
        wrapper.instance()._onOrgUnitSelected('School of Economics');
        expect(wrapper.state().orgUnitAsPublished).toEqual('School of Economics');
    });
});
