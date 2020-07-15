import React from 'react';
import NewViewRecord from './NewViewRecord';
import { render, RenderWithRouter, WithRedux } from 'test-utils';
import * as ViewRecordActions from 'actions/viewRecord';
import mediaQuery from 'css-mediaquery';
import { userIsAdmin, userIsAuthor } from 'hooks';
import { ntro } from 'mock/data/testing/records';
import { default as record } from 'mock/data/records/record';
import { accounts } from 'mock/data/account';
import { useParams } from 'react-router';
import { fireEvent } from '@testing-library/dom';

jest.mock('../../../hooks');
jest.mock('react-router', () => ({
    useParams: jest.fn(() => 'UQ:123456'),
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({})),
}));

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

const setup = (testProps = {}, renderer = render) => {
    const props = {
        account: accounts.uqresearcher,
        author: null,
        hideCulturalSensitivityStatement: true,
        isDeleted: false,
        loadingRecordToView: false,
        recordToViewError: null,
        recordToView: null,
        ...testProps,
    };
    return renderer(
        <RenderWithRouter>
            <WithRedux>
                <NewViewRecord {...props} />
            </WithRedux>
        </RenderWithRouter>,
    );
};

describe('NewViewRecord', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        userIsAdmin.mockImplementation(() => false);
        userIsAuthor.mockImplementation(() => true);
    });

    it('should render default empty view', () => {
        const { asFragment } = setup({});
        expect(asFragment()).toMatchInlineSnapshot(`
            <DocumentFragment>
              <div
                class="empty"
              />
            </DocumentFragment>
        `);
    });

    it('should not render components for empty record', () => {
        const { asFragment } = setup({ recordToView: {} });
        expect(asFragment()).toMatchInlineSnapshot(`
            <DocumentFragment>
              <div
                class="empty"
              />
            </DocumentFragment>
        `);
    });

    it('should render default view with admin menu', () => {
        userIsAdmin.mockImplementation(() => true);
        const { getByTestId } = setup({ recordToView: record });
        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });

    it('should render missing record message', () => {
        const { getByText } = setup({ isDeleted: true, recordToViewError: { message: 'test', status: 404 } });
        expect(getByText('Record not found')).toBeInTheDocument();
        expect(getByText('The record you are attempting to access does not appear in our system.')).toBeInTheDocument();
    });

    it('should render loader', () => {
        const { getByText } = setup({ loadingRecordToView: true });
        expect(getByText('Loading work')).toBeInTheDocument();
    });

    it('should render error', () => {
        const { getByText } = setup({ recordToViewError: 'PID not found' });
        expect(getByText('PID not found')).toBeInTheDocument();
    });

    it('should have status prop in the header for admins', () => {
        userIsAdmin.mockImplementation(() => true);
        const { getByText } = setup({
            recordToView: { ...record, rek_status: 1, rek_status_lookup: 'Unpublished' },
        });
        expect(getByText('Unpublished')).toBeInTheDocument();
    });

    it('should load record to view', () => {
        const loadRecordToViewFn = jest.spyOn(ViewRecordActions, 'loadRecordToView');
        useParams.mockImplementation(() => ({ pid: 'UQ:111111' }));
        setup({});
        expect(loadRecordToViewFn).toHaveBeenCalledWith('UQ:111111');
    });

    it('should reset store when component is unmounted', () => {
        const clearRecordToViewFn = jest.spyOn(ViewRecordActions, 'clearRecordToView');
        const { unmount } = setup({ recordToView: record });
        unmount();
        expect(clearRecordToViewFn).toHaveBeenCalled();
    });

    it('should render NTRO Details', () => {
        const { getAllByText } = setup({
            recordToView: ntro,
            account: {
                canMasquerade: true,
            },
        });
        expect(getAllByText('Scale/Significance of work').length).toBe(2);
    });

    it('should dismiss cultural sensitivity statement alert', () => {
        window.matchMedia = createMatchMedia(2056);
        const setHideCulturalSensitivityStatementFn = jest.spyOn(
            ViewRecordActions,
            'setHideCulturalSensitivityStatement',
        );
        const { getByTestId } = setup({
            recordToView: {
                ...record,
                fez_record_search_key_advisory_statement: { rek_advisory_statement: 'Test advisory statement' },
            },
            hideCulturalSensitivityStatement: false,
        });
        fireEvent.click(getByTestId('dismiss'));
        expect(setHideCulturalSensitivityStatementFn).toHaveBeenCalled();
    });

    it('should rerender component on props change', () => {
        const { getByText, queryByText, rerender } = setup({ loadingRecordToView: true });
        expect(getByText('Loading work')).toBeInTheDocument();

        setup({ loadingRecordToView: false, recordToView: record }, rerender);
        expect(queryByText('Loading work')).not.toBeInTheDocument();
    });
});
