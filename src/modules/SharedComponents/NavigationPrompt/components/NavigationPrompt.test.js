import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {NavigationPrompt} from './NavigationPrompt';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {ConfirmDialogBox} from 'uqlibrary-react-toolbox';

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

function setup({when, history, isShallow = true}) {
    const txt = {
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes'
    };

    const props = {
        when: when || false,
        history: history || {}
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <NavigationPrompt {...props}>
                    {
                        (setConfirmation, onConfirm, onCancel) => (
                            <ConfirmDialogBox
                                onRef={setConfirmation}
                                onAction={onConfirm}
                                onCancelAction={onCancel}
                                locale={txt}
                            />
                        )
                    }
                </NavigationPrompt>
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><NavigationPrompt {...props} /></Provider>);
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('NavigationPrompt component', () => {
    it('should render', () => {
        const testFunction = jest.fn();

        const history = {
            block: testFunction
        };

        const wrapper = setup({isShallow: false, history: history});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });
});
