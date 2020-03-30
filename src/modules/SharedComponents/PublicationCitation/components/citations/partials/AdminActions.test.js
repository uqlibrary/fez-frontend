import React from 'react';
import AdminActions, { navigateToUrl, getLegacyEditUrl } from './AdminActions';
import { rtlRender, fireEvent, cleanup } from 'test-utils';
import { RECORD_ACTION_URLS as defaultActions, STAGING_URL } from 'config/general';
import { APP_URL } from '../../../../../../config';

function setup(testProps = {}) {
    const props = {
        pid: 'UQ:111111',
        ...testProps,
    };
    return rtlRender(<AdminActions {...props} />);
}

describe('AdminActions component', () => {
    let windowOpenSpy;

    beforeAll(() => {
        windowOpenSpy = jest.spyOn(global.window, 'open').mockImplementation(() => {});
    });

    afterEach(() => {
        windowOpenSpy.mockClear();
        cleanup();
    });

    afterAll(() => {
        windowOpenSpy.mockRestore();
    });

    it('should handle admin actions menu', () => {
        const { getByTestId, getByText } = setup({
            navigatedFrom: 'test',
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        fireEvent.click(getByText(/edit security for selected record/i, menu));
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}workflow/update.php?pid=UQ:111111&cat=select_workflow&xdis_id=179&wft_id=289&href=%2Fview%2FUQ%3A111111`,
            '_self',
        );
    });

    it('should handle admin actions in a new window ', () => {
        const { getByTestId, getByText } = setup({
            adminActions: [
                {
                    ...defaultActions[0],
                    inApp: false,
                },
            ],
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        fireEvent.click(getByText(/edit selected record/i, menu));
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}workflow/update.php?pid=UQ:111111&cat=select_workflow&xdis_id=179&wft_id=289&href=%2Fview%2FUQ%3A111111`,
            '_blank',
        );
    });

    it('should have helper to append referral URL', () => {
        // no existing query parameters
        navigateToUrl(
            `${APP_URL}admin/edit/UQ:111111`,
            '_blank',
            '/records/search?searchQueryParams%5Ball%5D=&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        )();
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}admin/edit/UQ:111111?navigatedFrom=%2Frecords%2Fsearch%3FsearchQueryParams%255Ball%255D%3D%26page%3D1%26pageSize%3D20%26sortBy%3Dscore%26sortDirection%3DDesc`,
            '_blank',
        );
        windowOpenSpy.mockClear();

        // has existing query parameters
        navigateToUrl(`${APP_URL}admin/edit/UQ:111111?tab=security`, '_blank', '/records/mine')();
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}admin/edit/UQ:111111?tab=security&navigatedFrom=%2Frecords%2Fmine`,
            '_blank',
        );
    });

    it('should open the new edit url if user is whitelisted', () => {
        const { getByTestId, getByText } = setup({
            navigatedFrom: 'test',
            userHasNewAdminEdit: true,
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        fireEvent.click(getByText(/edit selected record/i, menu));

        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(`${APP_URL}admin/edit/UQ:111111?navigatedFrom=test`, '_self');
    });

    it('should have helper to create legacy edit URL for other object types', () => {
        const urlPrefixProd = 'https://espace.library.uq.edu.au/';
        const urlPrefixDev = 'http://development.library.uq.edu.au/espace/feature-example/#/';
        const pid = 'UQ:111111';
        expect(getLegacyEditUrl(pid, 'community', urlPrefixProd)).toBe(
            `${urlPrefixProd}workflow/update.php?pid=${pid}&cat=select_workflow&xdis_id=11&wft_id=291&href=%2Fcommunity%2FUQ%3A111111`,
        );
        expect(getLegacyEditUrl(pid, 'collection', urlPrefixDev)).toBe(
            `${STAGING_URL}workflow/update.php?pid=${pid}&cat=select_workflow&xdis_id=9&wft_id=290&href=%2Fcollection%2FUQ%3A111111`,
        );
    });
});
