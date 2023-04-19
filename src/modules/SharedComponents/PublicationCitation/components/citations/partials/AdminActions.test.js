import React from 'react';
import AdminActions from './AdminActions';
import { navigateToUrl } from 'modules/SharedComponents/Toolbox/helpers';
import { rtlRender, fireEvent, cleanup } from 'test-utils';
import {
    APP_URL,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_WORKING_PAPER,
    RECORD_ACTION_URLS as defaultActions,
    UPDATE_DELETED_RECORD_LABEL,
} from 'config/general';
import { rccDatasetCollection } from 'config/doi';

function setup(testProps = {}) {
    const props = {
        publication: {
            rek_pid: 'UQ:111111',
            rek_display_type: PUBLICATION_TYPE_WORKING_PAPER,
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
            publication: {
                rek_pid: 'UQ:111111',
                rek_object_type_lookup: 'Record',
                rek_display_type: PUBLICATION_TYPE_WORKING_PAPER,
            },
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        const expectedActions = defaultActions.map(action => ({
            ...action,
        }));

        expectedActions
            .filter(action => action.label !== UPDATE_DELETED_RECORD_LABEL)
            .map(action => {
                fireEvent.click(getByText(action.isDoi ? action.label(false) : action.label, menu));
                expect(global.window.open).toHaveBeenCalledTimes(1);
                expect(global.window.open).toHaveBeenCalledWith(
                    `${action.url('UQ:111111')}${!action.isRecordEdit ? '' : '?navigatedFrom=test'}`,
                    action.inApp ? '_self' : '_blank',
                    action.options,
                );
                windowOpenSpy.mockClear();
            });
    });

    it('should handle deleted record admin actions menu', () => {
        const { getByTestId, queryByText } = setup({
            navigatedFrom: 'test',
            isRecordDeleted: true,
            adminActions: [
                {
                    label: 'Show in deleted records',
                    showInDeleted: true,
                    url: jest.fn(),
                },
                {
                    label: 'Dont show in deleted records',
                    showInDeleted: false,
                    url: jest.fn(),
                },
                {
                    label: UPDATE_DELETED_RECORD_LABEL,
                    showInDeleted: true,
                    url: jest.fn(),
                },
            ],
        });

        fireEvent.click(getByTestId('admin-actions-button'));
        const menu = getByTestId('admin-actions-menu');
        expect(queryByText('Show in deleted records', menu)).not.toBeNull();
        expect(queryByText('Dont show in deleted records', menu)).toBeNull();
        expect(queryByText(UPDATE_DELETED_RECORD_LABEL, menu)).toBeNull();
    });

    it('should handle deleted data collection admin actions menu', () => {
        const { getByTestId, queryByText } = setup({
            navigatedFrom: 'test',
            isRecordDeleted: true,
            publication: {
                rek_pid: 'UQ:111111',
                rek_object_type_lookup: 'Record',
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
            adminActions: [
                {
                    label: 'Show in deleted records',
                    showInDeleted: true,
                    url: jest.fn(),
                },
                {
                    label: 'Dont show in deleted records',
                    showInDeleted: false,
                    url: jest.fn(),
                },
                {
                    label: UPDATE_DELETED_RECORD_LABEL,
                    showInDeleted: true,
                    url: jest.fn(),
                },
            ],
        });

        fireEvent.click(getByTestId('admin-actions-button'));
        const menu = getByTestId('admin-actions-menu');
        expect(queryByText('Show in deleted records', menu)).not.toBeNull();
        expect(queryByText('Dont show in deleted records', menu)).toBeNull();
        expect(queryByText(UPDATE_DELETED_RECORD_LABEL, menu)).not.toBeNull();
    });

    it('should include DOI item if supported type has existing UQ DOI', () => {
        const { getByTestId, queryByText } = setup({
            navigatedFrom: 'test',
            publication: {
                rek_pid: 'UQ:111111',
                rek_object_type_lookup: 'Record',
                fez_record_search_key_doi: {
                    rek_doi: '10.14264/111111',
                },
                rek_display_type: 174,
            },
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');
        const doiAction = defaultActions.find(action => !!action.isDoi);

        expect(queryByText(doiAction.label(true), menu)).not.toBeNull();
    });

    it('should not include DOI item for communities and collections', () => {
        const { getByTestId, queryByText } = setup({
            navigatedFrom: 'test',
            publication: {
                rek_pid: 'UQ:111111',
                rek_object_type_lookup: 'Community',
                fez_record_search_key_doi: {
                    rek_doi: 'testing',
                },
            },
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');
        const doiAction = defaultActions.find(action => !!action.isDoi);

        expect(queryByText(doiAction.label(false), menu)).toBeNull();
    });

    it('should not include Update DOI item for records with existing non-UQ DOIs', () => {
        const { getByTestId, queryByText } = setup({
            publication: {
                rek_pid: 'UQ:111111',
                rek_display_type: PUBLICATION_TYPE_WORKING_PAPER,
                fez_record_search_key_doi: {
                    rek_doi: '123456',
                },
            },
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');
        const doiAction = defaultActions.find(action => !!action.isDoi);

        expect(queryByText(doiAction.label(false), menu)).toBeNull();
    });

    it('should not include Update DOI item for RCC datasets', () => {
        const { getByTestId, queryByText } = setup({
            publication: {
                rek_pid: 'UQ:111111',
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: rccDatasetCollection,
                    },
                ],
            },
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');
        const doiAction = defaultActions.find(action => !!action.isDoi);

        expect(queryByText(doiAction.label(false), menu)).toBeNull();
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

        fireEvent.click(getByText(/edit selected record/i, menu));
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            'https://fez-staging.library.uq.edu.au/admin/edit/UQ:111111',
            '_blank',
            null,
        );
    });

    it('should handle alternate click events', () => {
        const { getByTestId, getByText } = setup({});
        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        fireEvent.contextMenu(getByText(/edit selected record/i, menu));
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            'https://fez-staging.library.uq.edu.au/admin/edit/UQ:111111',
            '_blank',
            null,
        );
    });

    it('should have helper to append referral URL', () => {
        // no existing query parameters
        navigateToUrl(
            `${APP_URL}admin/edit/UQ:111111`,
            '_blank',
            '/records/search?searchQueryParams%5Ball%5D=&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
            null,
        );
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}admin/edit/UQ:111111?navigatedFrom=%2Frecords%2Fsearch%3FsearchQueryParams%255Ball%255D%3D%26page%3D1%26pageSize%3D20%26sortBy%3Dscore%26sortDirection%3DDesc`,
            '_blank',
            null,
        );
        windowOpenSpy.mockClear();

        // has existing query parameters
        navigateToUrl(`${APP_URL}admin/edit/UQ:111111?tab=security`, '_blank', '/records/mine');
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}admin/edit/UQ:111111?tab=security&navigatedFrom=%2Frecords%2Fmine`,
            '_blank',
            undefined,
        );
        windowOpenSpy.mockClear();

        // missing referral
        const legacyUrl = `${APP_URL}workflow/update.php?pid=UQ:3A111111&cat=select_workflow&xdis_id=11&wft_id=291&href=%2Fcommunity%2FUQ%3A111111`;
        navigateToUrl(legacyUrl, '_self', false);
        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(legacyUrl, '_self', undefined);
    });

    it('should open the new edit url if user is whitelisted', () => {
        const { getByTestId, getByText } = setup({
            navigatedFrom: 'test',
        });

        fireEvent.click(getByTestId('admin-actions-button'));

        const menu = getByTestId('admin-actions-menu');

        fireEvent.click(getByText(/edit selected record/i, menu));

        expect(global.window.open).toHaveBeenCalledTimes(1);
        expect(global.window.open).toHaveBeenCalledWith(
            `${APP_URL}admin/edit/UQ:111111?navigatedFrom=test`,
            '_self',
            null,
        );
    });
});
