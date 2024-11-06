import * as routes from './routes';
import * as pages from 'modules/App/components/pages';
import { accounts, authorDetails, currentAuthor } from 'mock/data/account';
import { getDatastreamVersionQueryString, pathConfig } from './pathConfig';

describe('Routes getMenuConfig method', () => {
    it('should return a list of menus for a non user', () => {
        const testRoutes = routes.getMenuConfig(null);
        expect(testRoutes.length).toEqual(5);
    });

    it('should return a list of menus for researcher (uqresearcher)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqresearcher,
            currentAuthor.uqresearcher.data,
            authorDetails.uqresearcher,
        );
        expect(testRoutes.length).toEqual(15);
    });

    it('should return a list of menus including incomplete menu item for researcher (uqresearcher)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqresearcher,
            currentAuthor.uqresearcher.data,
            authorDetails.uqresearcher,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(16);
    });

    it('should return menus for a user with dashboard only (eg HDR student without ORCID) (uqnoauthid)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqnoauthid,
            currentAuthor.uqnoauthid.data,
            authorDetails.uqnoauthid,
            true,
        );

        expect(testRoutes.length).toEqual(8);
    });

    it('should return a list of menus for user who has admin (uqstaff) and full masquerade access', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff, currentAuthor.uqstaff.data, authorDetails.uqstaff);
        expect(testRoutes.length).toEqual(28);
    });

    it('should return a list of menus with Incomplete entry for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqstaff,
            currentAuthor.uqstaff.data,
            authorDetails.uqstaff,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(29);
    });

    it('should return a list of menus for user who can masquerade', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
            false,
            false,
        );
        expect(testRoutes.length).toEqual(17);
    });

    it('should return a list of menus with Incomplete entry for user who can masquerade (uqmasquerade)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(18);
    });

    it('should return a list of menus for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getMenuConfig(accounts.uqstaff, currentAuthor.uqstaff.data, authorDetails.uqstaff);
        expect(testRoutes.length).toEqual(29);
    });

    it('should return a list of menus with Incomplete entry for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqstaff,
            currentAuthor.uqstaff.data,
            authorDetails.uqstaff,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(30);
    });

    it('should return a list of menus for user who can readonly masquerade', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
        );
        expect(testRoutes.length).toEqual(17);
    });

    it('should return a list of menus for user who can fully masquerade', () => {
        const testRoutes = routes.getMenuConfig(
            { ...accounts.uqmasquerade, canMasqueradeType: 'full' },
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
        );
        expect(testRoutes.length).toEqual(18);
    });

    it('should return a list of menus with Incomplete entry for user who can masquerade (uqmasquerade)', () => {
        const testRoutes = routes.getMenuConfig(
            accounts.uqmasquerade,
            currentAuthor.uqmasquerade.data,
            authorDetails.uqmasquerade,
            false,
            true,
        );
        expect(testRoutes.length).toEqual(18);
    });

    it('should return list of menus for a student with an author account', () => {
        const testMenuItems = routes.getMenuConfig(
            accounts.s2222222,
            currentAuthor.s2222222.data,
            authorDetails.s2222222,
            false,
            false,
        );
        expect(testMenuItems.length).toEqual(15);
    });

    it('should return list of menus for a student with no author account', () => {
        const testMenuItems = routes.getMenuConfig(
            accounts.s3333333,
            currentAuthor.s3333333.data,
            authorDetails.s3333333,
            false,
            false,
        );

        expect(testMenuItems.length).toEqual(6);
    });
});

describe('Routes getRoutesConfig method', () => {
    it('should return a list of routes for a non user', () => {
        const testRoutes = routes.getRoutesConfig({ components: pages, account: null });
        expect(testRoutes.length).toEqual(8);
    });

    it('should return a list of routes for researcher', () => {
        const testRoutes = routes.getRoutesConfig({
            components: pages,
            account: accounts.uqresearcher,
            authorDetails: authorDetails.uqresearcher,
        });
        expect(testRoutes.length).toEqual(29);
    });

    it('should return a list of routes for user who can masquerade (uqmasquerade)', () => {
        const testRoutes = routes.getRoutesConfig({
            components: pages,
            account: accounts.uqmasquerade,
            authorDetails: authorDetails.uqmasquerade,
        });
        expect(testRoutes.length).toEqual(30);
    });

    it('should return a list of routes for user who has admin (uqstaff)', () => {
        const testRoutes = routes.getRoutesConfig({
            components: pages,
            account: accounts.uqstaff,
            authorDetails: authorDetails.uqstaff,
        });
        expect(testRoutes.length).toEqual(52);
    });

    it('should return a list of routes for hdr student without ORCID', () => {
        const testRoutes = routes.getRoutesConfig({
            components: pages,
            account: accounts.s2222222,
            forceOrcidRegistration: true,
            isHdrStudent: true,
        });
        expect(testRoutes.length).toEqual(9);
    });

    it('should return a list of routes for hdr student with ORCID', () => {
        const testRoutes = routes.getRoutesConfig({
            components: pages,
            account: accounts.s2222222,
            forceOrcidRegistration: false,
            isHdrStudent: true,
            authorDetails: authorDetails.uqresearcher,
        });
        expect(testRoutes.length).toEqual(28);
    });
});

describe('Routes other methods', () => {
    it('file.url should without checksum', () => {
        const pid = 'UQ:12345';
        const filename = 'image.jpg';
        const url = pathConfig.file.url(pid, filename);
        expect(url).toEqual(`${routes.fullPath}/view/${pid}/${filename}`);
    });

    it('file.url should with checksum', () => {
        const pid = 'UQ:12345';
        const filename = 'image.jpg';
        const checksum = 'a5a5d5qwe5dq5f5qefqe';
        const versionHash = getDatastreamVersionQueryString(filename, checksum);
        const url = pathConfig.file.url(pid, filename, checksum);
        expect(url).toEqual(`${routes.fullPath}/view/${pid}/${filename}?dsi_version=${versionHash}`);
    });
});
