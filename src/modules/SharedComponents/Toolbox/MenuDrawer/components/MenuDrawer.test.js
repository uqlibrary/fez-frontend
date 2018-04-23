import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import MenuDrawer from './MenuDrawer';

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

function setup({isShallow = true, ...props}) {
    // {menuItems, onToggleDrawer, drawerOpen, docked, logoImage, logoText, history, locale}
    const defaultMenuItems = [
        {
            linkTo: '/',
            primaryText: 'Primary text 0',
            secondaryText: 'secondary text 0'
        },
        {
            divider: true
        },
        {
            linkTo: '/xyz',
            primaryText: 'Primary text 1',
            secondaryText: 'secondary text 1'
        }
    ];
    const defaultLocale = {
        skipNavTitle: 'Skip navigation',
        skipNavAriaLabel: 'Skip navigation',
        closeMenuLabel: 'Close menu'
    };
    const testProps = {
        ...props,
        menuItems: props.menuItems || defaultMenuItems,
        onToggleDrawer: props.onToggleDrawer || jest.fn(),
        history: props.history || {push: jest.fn()},
        locale: props.locale || defaultLocale,
        drawerOpen: props.drawerOpen || false,
        docked: props.docked || false
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <MenuDrawer {...testProps} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<MenuDrawer {...testProps} />);
}

describe('MenuDrawer snapshots tests', () => {
    it('should render empty drawer', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider', () => {
        const wrapper = setup({drawerOpen: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus, divider and skip nav button', () => {
        const wrapper = setup({drawerOpen: true, docked: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should navigate to internal route', () => {
        const testMethod = jest.fn();
        const wrapper = setup({drawerOpen: true, docked: true, history: {push: testMethod}});
        // navigateToLink
        wrapper.find('span.menu-item-container ListItem').forEach(listItem => {
            listItem.props().onTouchTap();
            expect(testMethod).toHaveBeenCalled();
        });
    });

    it('should skip navigation', () => {
        const testMethod = jest.fn();
        const wrapper = setup({drawerOpen: true, docked: true, history: {push: testMethod}});
        // TODO: how to spy?
        // const spy = jest.spyOn(wrapper.find('div#afterMenuDrawer'), 'focus');
        // wrapper.find('SkipNavigation').props().onClick();
        // expect(spy).toHaveBeenCalled();
    });
});


