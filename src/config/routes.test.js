import React from 'react';
import * as routes from './routes';
import {accounts} from 'mock/data/account';
import {locale} from 'locale';

describe('Routes method', () => {
    it('should return a list of menus for anon user', () => {
        const testRoutes = routes.getMenuConfig(null);
        expect(testRoutes.length).toEqual(2);
    });

    it('should return a list of menus for researcher', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher);
        expect(testRoutes.length).toEqual(10);
    });

    it('should return a list of menus for a user with dashboard enabled only (eg HDR student without ORCID)', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqresearcher, true);
        expect(testRoutes.length).toEqual(4);
    });

    it('should return a list of menus for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff);
        expect(testRoutes.length).toEqual(12);
    });

    it('should return a list of routes for anon user', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: null});
        expect(testRoutes.length).toEqual(5);
    });

    it('should return a list of routes for researcher', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.uqresearcher});
        expect(testRoutes.length).toEqual(17);
    });

    it('should return a list of routes for user who can masquerade', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.uqstaff});
        expect(testRoutes.length).toEqual(18);
    });

    it('should return a list of routes for hdr student without ORCID', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.s2222222, forceOrcidRegistration: true, isHdrStudent: true});
        expect(testRoutes.length).toEqual(6);
    });

    it('should return a list of routes for hdr student with ORCID', () => {
        const testRoutes = routes.getRoutesConfig({components: {}, account: accounts.s2222222, forceOrcidRegistration: false, isHdrStudent: true});
        expect(testRoutes.length).toEqual(17);
    });

    it('should render auth required page', () => {
        const testComponent = jest.fn();
        const renderPage = routes.getRoutesConfig({components: {StandardPage: testComponent}, account: null})[4].render;
        const props = {
            location: {
                pathname: routes.pathConfig.dashboard
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
        const renderPage = routes.getRoutesConfig({components: {StandardPage: testComponent}})[4].render;
        const props = {
            location: {
                pathname: '/abc/abac/aba'
            }
        };
        const page = renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.notFound);
    });

});

