import React from 'react';
import AdminActions from './AdminActions';
import { rtlRender, fireEvent, cleanup } from 'test-utils';
import { JOURNAL_ACTION_URLS as defaultActions } from 'config/general';

function setup(testProps = {}) {
    const props = {
        journal: {
            jnl_jid: 12,
        },
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

        const expectedActions = defaultActions.map(action => ({
            ...action,
        }));

        expectedActions
            .filter(action => action.label !== defaultActions.label)
            .map(action => {
                fireEvent.click(getByText(action.isDoi ? action.label(false) : action.label, menu));
                expect(global.window.open).toHaveBeenCalledTimes(1);
                expect(global.window.open).toHaveBeenCalledWith(
                    `${action.url(12)}?navigatedFrom=test`,
                    action.inApp ? '_self' : '_blank',
                    action.options,
                );
                windowOpenSpy.mockClear();
            });
    });

    it('should handle admin actions in a new window', () => {
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

        fireEvent.click(getByText(/edit selected journal/i, menu));
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith('http://localhost/admin/journal/edit/12', '_blank', null);
    });

    it('should handle alternate click events', () => {
        const { getByTestId, getByText } = setup({});
        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        fireEvent.contextMenu(getByText(/edit selected journal/i, menu));
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith('http://localhost/admin/journal/edit/12', '_blank', null);
    });

    it('should open the new edit url if user is whitelisted', () => {
        const { getByTestId, getByText } = setup({
            navigatedFrom: 'test',
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        fireEvent.click(getByText(/edit selected journal/i, menu));

        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            'http://localhost/admin/journal/edit/12?navigatedFrom=test',
            '_self',
            null,
        );
    });
});
