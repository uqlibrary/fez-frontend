import React from 'react';
import AdminActions, { navigateToUrl } from './AdminActions';
import { rtlRender, fireEvent, cleanup, waitForElement } from 'test-utils';
import { RECORD_ACTION_URLS as options } from 'config/general';
import { APP_URL } from '../../../../../../config';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        pid: 'UQ:111111',
        options: testProps.options || options,
        ...testProps,
    };
    return rtlRender(<AdminActions {...props} />);
}

describe('AdminActions component', () => {
    afterEach(() => cleanup);

    it('should handle admin actions menu', async() => {
        global.window.open = jest.fn((url, target) => {
            expect(url).toBe(
                'https://fez-staging.library.uq.edu.au/admin/edit/UQ:111111?tab=security&navigatedFrom=test',
            );
            expect(target).toBe('_self');
        });

        const { getByTestId, getByText } = setup({
            navigatedFrom: 'test',
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = await waitForElement(() => getByTestId('admin-actions-menu'));

        fireEvent.click(getByText(/edit security for selected record/i, menu));
    });

    it('should handle admin actions in a new window ', async() => {
        global.window.open = jest.fn((url, target) => {
            expect(url).toBe('https://fez-staging.library.uq.edu.au/admin/edit/UQ:111111');
            expect(target).toBe('_blank');
        });

        const { getByTestId, getByText } = setup({
            options: [
                {
                    ...options[0],
                    inApp: false,
                },
            ],
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = await waitForElement(() => getByTestId('admin-actions-menu'));

        fireEvent.click(getByText(/edit selected record/i, menu));
    });

    it('should have helper to append referral URL', () => {
        global.window.open = jest.fn();
        navigateToUrl(
            `${APP_URL}admin/edit/UQ:111111`,
            '_blank',
            '/records/search?searchQueryParams%5Ball%5D=&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        )();
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}admin/edit/UQ:111111?navigatedFrom=%2Frecords%2Fsearch%3FsearchQueryParams%255Ball%255D%3D%26page%3D1%26pageSize%3D20%26sortBy%3Dscore%26sortDirection%3DDesc`,
            '_blank',
        );
    });
});
