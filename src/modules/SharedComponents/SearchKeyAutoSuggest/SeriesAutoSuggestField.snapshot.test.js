import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import SeriesAutoSuggestField from './SeriesAutoSuggestField';
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

function setup({isShallow = true}){
    const props = {
        input: {
            onChange: jest.fn()
        }
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <SeriesAutoSuggestField {...props} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><SeriesAutoSuggestField {...props} /></Provider>);
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('SeriesAutoSuggestField component', () => {
    it('should render with custom vocab id set and locale values', () => {
        const wrapper = setup({isShallow: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});