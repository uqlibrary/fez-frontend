import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import App from './App';
import {accounts, authorDetails} from 'mock/data';
import {routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL} from 'config';
import {locale} from 'locale';

function setup(values) {
    values.history = values.history || {};

    return shallow(<App {...values} />);
}

window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () {
        },
        removeListener: function () {
        }
    };
};

describe('App tests for user account and author status', () => {
    it('User logged in and is an author)', () => {
        const values = {
            user: {
                account: {...accounts.uqstaff},
                loadingAuthorDetails: false,
                accountLoading: false,
                authorDetails: {...authorDetails.uqresearcher}
            },
            location: {
                hash: '#/dashboard',
                pathname: '/',
            }
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('User logged in but is not an author)', () => {
        const values = {
            user: {
                account: {...accounts.uqstaff},
                loadingAuthorDetails: false,
                accountLoading: false,
                authorDetails: null,
            },
            location: {
                hash: '#/dashboard',
                pathname: '/',
            }
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('User is not logged in and is not an author)', () => {
        const values = {
            user: {
                account: null,
                loadingAuthorDetails: false,
                accountLoading: false,
                authorDetails: null,
            },
            location: {
                hash: '#/dashboard',
                pathname: '/',
            }
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('User is logged in but are still loading authorDetails)', () => {
        const values = {
            user: {
                account: {...accounts.uqstaff},
                loadingAuthorDetails: true,
                accountLoading: false,
                authorDetails: null,
            },
            location: {
                hash: '#/dashboard',
                pathname: '/',
            }
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to login page', () => {
        window.location.assign = jest.fn();
        const wrapper = setup({
            user: {
                accountLoading: false,
                account: null
            },
            location: {},
            history: {}
        }).instance().redirectUserToLogin();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGIN));
    });

    it('should redirect to logout page', () => {
        window.location.assign = jest.fn();
        const wrapper = setup({
            user: {
                accountLoading: false,
                account: {}
            },
            location: {},
            history: {}
        }).instance().redirectUserToLogin();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGOUT));
    });

    it('should handleResize', () => {
        const wrapper = setup({
            user: {
                accountLoading: false,
                account: {}
            },
            location: {},
            history: {}
        });
        expect(wrapper.state().docked).toBeFalsy();
        wrapper.instance().handleResize({matches: true });
        expect(wrapper.state().docked).toBeTruthy();
        wrapper.instance().handleResize({matches: false });
        expect(wrapper.state().docked).toBeFalsy();
    });

    it('should toggleDrawer', () => {
        const wrapper = setup({
            user: {
                accountLoading: false,
                account: {}
            },
            location: {},
            history: {}
        });
        expect(wrapper.state().menuDrawerOpen).toBeFalsy();
        wrapper.instance().toggleDrawer();
        expect(wrapper.state().menuDrawerOpen).toBeTruthy();
        wrapper.instance().toggleDrawer();
        expect(wrapper.state().menuDrawerOpen).toBeFalsy();
    });

    it('should redirectToOrcid', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            user: {
                accountLoading: false,
                account: {}
            },
            location: {},
            history: {
                push: testMethod
            }
        });

        wrapper.instance().redirectToOrcid();
        expect(testMethod).toHaveBeenCalledWith(routes.pathConfig.authorIdentifiers.orcid.link);
    });

    it('should display ORCID required alert', () => {
        const values = {
            user: {
                account: {},
                author: {
                    aut_orcid_id: null
                },
                loadingAuthorDetails: false,
                authorLoading: false,
                accountLoading: false
            },
            location: {
                hash: '#/dashboard',
                pathname: '/',
            }
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
