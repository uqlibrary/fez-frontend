import React from 'react';
import AdminActions from './AdminActions';
import { rtlRender, fireEvent, cleanup, waitForElement } from 'test-utils';
import { UNPUBLISHED_BUFFER_ACTION_URLS as options } from 'config/general';
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
            expect(url).toBe('https://fez-staging.library.uq.edu.au/admin/edit/UQ:111111?tab=security?navigatedFrom=');
            expect(target).toBe('_self');
        });

        const { getByTestId, getByText, container } = setup();

        fireEvent.click(getByTestId('admin-actions-button'));

        fireEvent.click(container);

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = await waitForElement(() => getByTestId('admin-actions-menu'));

        fireEvent.click(getByText(/edit security for selected record/i, menu));
    });

    it('should handle admin actions menu for non-admin', async() => {
        global.window.open = jest.fn((url, target) => {
            expect(url).toBe('https://fez-staging.library.uq.edu.au/admin/edit/UQ:111111?navigatedFrom=');
            expect(target).toBe('_self');
        });

        const { getByTestId, getByText, container } = setup({
            authorDetails: {
                is_administrator: 0,
                is_super_administrator: 0,
            },
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        fireEvent.click(container);

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = await waitForElement(() => getByTestId('admin-actions-menu'));

        fireEvent.click(getByText(/edit selected record/i, menu));
    });

    it('should handle admin actions ina  new window ', async() => {
        global.window.open = jest.fn((url, target) => {
            expect(url).toBe('https://fez-staging.library.uq.edu.au/admin/edit/UQ:111111?navigatedFrom=');
            expect(target).toBe('_blank');
        });

        const { getByTestId, getByText, container } = setup({
            authorDetails: {
                is_administrator: 1,
                is_super_administrator: 1,
            },
            options: [
                {
                    label: 'Edit selected record',
                    url: pid =>
                        process.env.NODE_ENV === 'development'
                            ? `${APP_URL}#/admin/edit/${pid}`
                            : `${APP_URL}admin/edit/${pid}`,
                    inApp: false,
                },
            ],
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        fireEvent.click(container);

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = await waitForElement(() => getByTestId('admin-actions-menu'));

        fireEvent.click(getByText(/edit selected record/i, menu));
    });
});
