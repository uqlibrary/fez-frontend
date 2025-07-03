import React from 'react';
import { render, WithReduxStore, fireEvent, act, waitForElementToBeRemoved } from 'test-utils';
import BulkExport from './BulkExport';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    resetExportPublicationsStatus: jest.fn(() => jest.fn()),
}));

import pagesLocale from 'locale/pages';

const setup = (testProps = {}, initialState = {}) => {
    const props = {
        locale: pagesLocale.pages.searchRecords.bulkExport,
        exportPublications: jest.fn(),
        pageSize: 10,
        totalMatches: 40,
        ...testProps,
    };
    const state = {
        exportPublicationsReducer: {
            exportPublicationsLoading: false,
            loadingByPage: {},
            loadedByPage: {},
        },
        ...initialState,
    };
    return render(
        <WithReduxStore initialState={state}>
            <BulkExport {...props} />
        </WithReduxStore>,
    );
};

describe('BulkExport component', () => {
    it('should render button disabled', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('bulk-export-open').closest('button')).toHaveAttribute('disabled');
    });

    it('should open and close dialog on button click', async () => {
        const { getByTestId, getByLabelText, findByRole, queryByRole } = setup();

        expect(getByTestId('bulk-export')).toBeInTheDocument();
        expect(getByTestId('bulk-export-open')).toBeInTheDocument();

        expect(queryByRole('dialog')).toBeNull();
        act(() => {
            fireEvent.click(getByTestId('bulk-export-open'));
        });
        await findByRole('dialog');
        expect(actions.resetExportPublicationsStatus).toHaveBeenCalledTimes(1);

        expect(getByLabelText('close')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByLabelText('close'));
        });
        await waitForElementToBeRemoved(queryByRole('dialog'));
        expect(queryByRole('dialog')).toBeNull();
        expect(actions.resetExportPublicationsStatus).toHaveBeenCalledTimes(2);
    });

    it('should render buttons in different states', () => {
        const initialState = {
            exportPublicationsReducer: {
                exportPublicationsLoading: false,
                loadingByPage: {
                    'excel-page-1': true,
                    'endnote-page-1': false,
                },
                loadedByPage: {
                    'excel-page-2': true,
                },
            },
        };
        const { getByTestId } = setup({}, initialState);

        act(() => {
            fireEvent.click(getByTestId('bulk-export-open'));
        });

        expect(getByTestId('excel-page-1-loading')).toBeInTheDocument();
        expect(getByTestId('endnote-page-1-error')).toBeInTheDocument();
        expect(getByTestId('excel-page-2-loaded')).toBeInTheDocument();
        expect(getByTestId('endnote-page-2-available')).toBeInTheDocument();
    });

    it('should call export function on button click', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ exportPublications: testFn });
        act(() => {
            fireEvent.click(getByTestId('bulk-export-open'));
        });
        expect(getByTestId('excel-page-1-available')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('excel-page-1-available'));
        });
        expect(testFn).toHaveBeenCalledWith({
            exportPublicationsFormat: 'excel',
            page: 1,
            pageSize: 10,
            bulkExportSelected: true,
        });
    });
});
