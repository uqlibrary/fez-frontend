import React from 'react';
import AdminActions from './AdminActions';
import { rtlRender, fireEvent, cleanup } from 'test-utils';
import { PATH_PREFIX, APP_URL } from 'config';

const testActions = [
    {
        label: 'Edit selected record',
        url: pid => `${APP_URL}${PATH_PREFIX}admin/edit/${pid}`,
        inApp: true,
        showInDeleted: true,
        options: null,
        isRecordEdit: true,
    },
    {
        label: 'Change security for record',
        url: pid => `${APP_URL}${PATH_PREFIX}admin/edit/${pid}?tab=security`,
        inApp: true,
        showInDeleted: true,
        options: null,
        isRecordEdit: false,
    },
];

const testProps = {
    record: 'UQ:ABCDEF',
    adminActions: [...testActions],
};

function setup(props = testProps) {
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
        const { getByTestId, getByText } = setup();

        fireEvent.click(getByTestId('admin-actions-button-UQ:ABCDEF'));

        const menu = getByTestId('admin-actions-menu-UQ:ABCDEF');

        const expectedActions = testActions.map(action => ({
            ...action,
        }));

        expectedActions.map(action => {
            fireEvent.click(getByText(action.label, menu));
            expect(global.window.open).toHaveBeenCalledTimes(1);
            expect(global.window.open).toHaveBeenCalledWith(
                `${action.url('UQ:ABCDEF')}`,
                action.inApp ? '_self' : '_blank',
                action.options,
            );
            windowOpenSpy.mockClear();
        });
    });

    it('should handle admin actions with correct end point URLs', () => {
        const testProps = { record: 'UQ:123ZZ' };
        const { getByTestId, getByText } = setup(testProps);

        fireEvent.click(getByTestId('admin-actions-button-UQ:123ZZ'));

        const menu = getByTestId('admin-actions-menu-UQ:123ZZ');

        const expectedActions = testActions.map(action => ({
            ...action,
        }));

        expectedActions.map(action => {
            fireEvent.click(getByText(action.label, menu));
            expect(global.window.open).toHaveBeenCalledTimes(1);
            expect(global.window.open).toHaveBeenCalledWith(
                `${action.url('UQ:123ZZ')}`,
                action.inApp ? '_self' : '_blank',
                action.options,
            );
            windowOpenSpy.mockClear();
        });
    });
});
