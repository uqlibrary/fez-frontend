import * as routes from './routes';
import { accounts, currentAuthor, authorDetails } from 'mock/data/account';
import { locale } from 'locale';

describe('Routes getMenuConfig method', () => {
    it('should return a list of menus for anon user', () => {
        const testRoutes = routes.getMenuConfig(null);
        expect(testRoutes.length).toEqual(4);
    });

    it('should return a list of menus for researcher (uqresearcher)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqresearcher,
            currentAuthor.uqresearcher.data,
            authorDetails.uqresearcher,
        );
        expect(testRoutes.length).toEqual(12);
    });

    it('should return a list of menus including incomplete menu item for researcher (uqresearcher)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqresearcher,
            currentAuthor.uqresearcher.data,
            authorDetails.uqresearcher,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(13);
    });

    it('should return menus for a user with dashboard only (eg HDR student without ORCID) (uqnoauthid)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqnoauthid,
            currentAuthor.uqnoauthid.data,
            authorDetails.uqnoauthid,
            true,
        );
        expect(testRoutes.length).toEqual(6);
    });

    it('should return a list of menus for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff, currentAuthor.uqstaff.data, authorDetails.uqstaff);
        expect(testRoutes.length).toEqual(21);
    });

    it('should return a list of menus with Incomplete entry for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqstaff,
            currentAuthor.uqstaff.data,
            authorDetails.uqstaff,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(22);
    });

    it('should return a list of menus for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
            false,
            false,
        );
        expect(testRoutes.length).toEqual(14);
    });

    it('should return a list of menus with Incomplete entry for user who can masquerade (uqmasquerade)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(15);
    });

    it('should not return Switch to old interface menu item for public view page', () => {
        const testMenuItems = routes.getMenuConfig(null, null, false, true);
        expect(testMenuItems.length).toEqual(4);

        const contactMenuItem = testMenuItems.pop();
        expect(contactMenuItem.primaryText).toEqual('Contact');
    });

    it('should return a list of menus for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff, currentAuthor.uqstaff.data, authorDetails.uqstaff);
        expect(testRoutes.length).toEqual(21);
    });

    it('should return a list of menus with Incomplete entry for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqstaff,
            currentAuthor.uqstaff.data,
            authorDetails.uqstaff,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(22);
    });

    it('should return a list of menus for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
        );
        expect(testRoutes.length).toEqual(14);
    });

    it('should return a list of menus with Incomplete entry for user who can masquerade (uqmasquerade)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(15);
    });

    it('should not return Switch to old interface menu item for public view page', () => {
        const testMenuItems = routes.getMenuConfig(null, null, false, true);
        expect(testMenuItems.length).toEqual(4);

        const contactMenuItem = testMenuItems.pop();
        expect(contactMenuItem.primaryText).toEqual('Contact');
    });

    it('should return Switch to old interface menu item for logged in user on view page', () => {
        const testMenuItems = routes.getMenuConfig(
            accounts.uqresearcher,
            currentAuthor.uqresearcher.data,
            authorDetails.uqresearcher,
            false,
            true,
        );
        expect(testMenuItems.length).toEqual(13);
    });

    it('should return list of menus for a student with an author account', () => {
        const testMenuItems = routes.getMenuConfig(
            accounts.s2222222,
            currentAuthor.s2222222.data,
            authorDetails.s2222222,
            false,
            false,
        );
        expect(testMenuItems.length).toEqual(12);
    });

    it('should return list of menus for a student with an author account', () => {
        const testMenuItems = routes.getMenuConfig(
            accounts.s3333333,
            currentAuthor.s3333333.data,
            authorDetails.s3333333,
            false,
            false,
        );
        expect(testMenuItems.length).toEqual(4);
    });
});

describe('Routes getRoutesConfig method', () => {
    it('should return a list of routes for anon user', () => {
        const testRoutes = routes.getRoutesConfig({ components: {}, account: null });
        expect(testRoutes.length).toEqual(7);
    });

    it('should return a list of routes for researcher', () => {
        const testRoutes = routes.getRoutesConfig({ components: {}, account: accounts.uqresearcher });
        expect(testRoutes.length).toEqual(23);
    });

    it('should return a list of routes for user who can masquerade (uqmasquerade)', () => {
        const testRoutes = routes.getRoutesConfig({
            components: {},
            account: accounts.uqmasquerade,
            authorDetails: authorDetails.uqmasquerade,
        });
        expect(testRoutes.length).toEqual(24);
    });

    it('should return a list of routes for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getRoutesConfig({
            components: {},
            account: accounts.uqstaff,
            authorDetails: authorDetails.uqstaff,
        });
        expect(testRoutes.length).toEqual(35);
    });

    it('should return a list of routes for hdr student without ORCID', () => {
        const testRoutes = routes.getRoutesConfig({
            components: {},
            account: accounts.s2222222,
            forceOrcidRegistration: true,
            isHdrStudent: true,
        });
        expect(testRoutes.length).toEqual(8);
    });

    it('should return a list of routes for hdr student with ORCID', () => {
        const testRoutes = routes.getRoutesConfig({
            components: {},
            account: accounts.s2222222,
            forceOrcidRegistration: false,
            isHdrStudent: true,
        });
        expect(testRoutes.length).toEqual(23);
    });

    it('should render auth required page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({
            components: { StandardPage: testComponent },
            account: null,
            authorDetails: null,
            accountAuthorDetailsLoading: false,
            forceOrcidRegistration: false,
            isHdrStudent: false,
        });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: routes.pathConfig.contact,
            },
            accountAuthorDetailsLoading: false,
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.authenticationRequired);
    });

    it('should render permissions denied page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({
            components: { StandardPage: testComponent },
            account: accounts.uqresearcher,
            authorDetails: authorDetails.uqresearcher,
            accountAuthorDetailsLoading: false,
        });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: routes.pathConfig.admin.masquerade,
            },
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.permissionDenied);
    });

    it('should render permissions denied or not found page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({
            components: { StandardPage: testComponent },
            account: accounts.uqresearcher,
            authorDetails: authorDetails.uqresearcher,
            accountAuthorDetailsLoading: false,
        });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: '/view/UQ:1/test.pdf',
            },
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.permissionDenied);
    });

    it('should render not found page', () => {
        const testComponent = jest.fn();
        const routesConfig = routes.getRoutesConfig({
            components: { StandardPage: testComponent },
            accountAuthorDetailsLoading: false,
        });
        const renderPage = routesConfig[routesConfig.length - 1].render;
        const props = {
            location: {
                pathname: '/abc/abac/aba',
            },
        };
        renderPage(props);
        expect(testComponent).toHaveBeenCalledWith(locale.pages.notFound);
    });
});

describe('Routes other methods', () => {
    it('file.url should without checksum', () => {
        const pid = 'UQ:12345';
        const filename = 'image.jpg';
        const url = routes.pathConfig.file.url(pid, filename);
        expect(url).toEqual(`${routes.fullPath}/view/${pid}/${filename}`);
    });

    it('file.url should with checksum', () => {
        const pid = 'UQ:12345';
        const filename = 'image.jpg';
        const checksum = 'a5a5d5qwe5dq5f5qefqe';
        const versionHash = routes.getDatastreamVersionQueryString(filename, checksum);
        const url = routes.pathConfig.file.url(pid, filename, checksum);
        expect(url).toEqual(`${routes.fullPath}/view/${pid}/${filename}?dsi_version=${versionHash}`);
    });
});
