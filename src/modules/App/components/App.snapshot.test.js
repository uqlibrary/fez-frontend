//jest.dontMock('./App');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import App from './App';
import {accounts, authorDetails} from 'mock/data';

function setup(values) {
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
        Object.defineProperty(window.location, 'href', {
            writable: true,
            value: 'https://development.library.uq.edu.au/espace/master/#/dashboard'
        });
        window.location.assign = jest.fn();
        const wrapper = setup({
            user: {
                accountLoading: false,
                account: null
            },
            location: {},
            history: {}
        }).instance().redirectUserToLogin();
        expect(window.location.assign).toBeCalledWith('https://auth.library.uq.edu.au/login?return=' + window.btoa('https://development.library.uq.edu.au/espace/master/#/dashboard'));
    });

});
