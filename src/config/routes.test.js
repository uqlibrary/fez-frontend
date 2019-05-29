import React from 'react';
import * as routes from './routes';
import {accounts} from 'mock/data/account';
import {locale} from 'locale';

describe('Routes method', () => {
    it('should return a list of menus for anon user', () => {
        const testRoutes = routes.getMenuConfig(null);
        expect(testRoutes.length).toEqual(4);
    });

    it('should return a list of menus for researcher', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher);
        expect(testRoutes.length).toEqual(12);
    });

    it('should return a list of menus including incomplete menu item for researcher', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher, false, true);
        expect(testRoutes.length).toEqual(13);
    });

    it('should return a list of menus for a user with dashboard enabled only (eg HDR student without ORCID)', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher, true);
        expect(testRoutes.length).toEqual(6);
    });

    it('should return a list of menus for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff);
        expect(testRoutes.length).toEqual(17);
    });

    it('should return a list of menus including incomplete menu item for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff, false, true);
        expect(testRoutes.length).toEqual(18);
    });

    it('should return a list of routes for anon user', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: null});
        expect(testRoutes.length).toEqual(7);
    });

    it('should return a list of routes for researcher', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.uqresearcher});
        expect(testRoutes.length).toEqual(23);
    });

    it('should return a list of routes for user who can masquerade', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.uqstaff});
        expect(testRoutes.length).toEqual(26);
    });

    it('should return a list of routes for hdr student without ORCID', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.s2222222, forceOrcidRegistration: true, isHdrStudent: true});
        expect(testRoutes.length).toEqual(8);
    });

    it('should return a list of routes for hdr student with ORCID', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.s2222222, forceOrcidRegistration: false, isHdrStudent: true});
        expect(testRoutes.length).toEqual(23);
    });

    it('should render auth required page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({components: {StandardPage: testComponent}, account: null});
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: routes.pathConfig.contact
            }
        };
        const page = renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.authenticationRequired);
    });

    it('should render permissions denied page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({components: {StandardPage: testComponent}, account: accounts.uqresearcher});
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: routes.pathConfig.admin.masquerade
            }
        };
        const page = renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.permissionDenied);
    });

    it('should render not found page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({components: {StandardPage: testComponent}});
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: '/abc/abac/aba'
            }
        };
        const page = renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.notFound);
    });

    it('should not return Switch to old interface menu item for public view page', () => {
        const testMenuItems = routes.getMenuConfig(null, false, true);
        expect(testMenuItems.length).toEqual(4);

        const contactMenuItem = testMenuItems.pop();
        expect(contactMenuItem.primaryText).toEqual('Contact');
    });

    it('should return Switch to old interface menu item for logged in user on view page', () => {
        const testMenuItems = routes.getMenuConfig(accounts.uqresearcher, false, true);
        expect(testMenuItems.length).toEqual(13);
    });
});

