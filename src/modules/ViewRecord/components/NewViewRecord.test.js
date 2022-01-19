import React from 'react';
import NewViewRecord from './NewViewRecord';
import { render, WithRouter, WithReduxStore, fireEvent, act } from 'test-utils';
import * as ViewRecordActions from 'actions/viewRecord';
import mediaQuery from 'css-mediaquery';
import { userIsAdmin, userIsAuthor } from 'hooks';
import { ntro } from 'mock/data/testing/records';
import { default as record } from 'mock/data/records/record';
import { accounts } from 'mock/data/account';
import { useParams } from 'react-router';
import { default as recordWithNotes } from 'mock/data/records/recordWithNotes';
import { default as recordWithAuthorAffiliates } from 'mock/data/records/recordWithAuthorAffiliates';

jest.mock('../../../hooks');
jest.mock('react-router', () => ({
    useParams: jest.fn(() => ({ pid: 'UQ:123456' })),
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
        <WithRouter>
            <WithReduxStore>
                <NewViewRecord {...props} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('NewViewRecord', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    beforeEach(() => {
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

    it('should render deleted record correctly', () => {
        const { getByText } = setup({ isDeleted: true, recordToView: record });
        expect(getByText('This work has been deleted.')).toBeInTheDocument();
        expect(
            getByText(
                'Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer (default record)',
            ),
        ).toBeInTheDocument();
    });

    it('should render loader', () => {
        const { getByText } = setup({ loadingRecordToView: true });
        expect(getByText('Loading work')).toBeInTheDocument();
    });

    it('should render error', () => {
        const { getByText } = setup({ recordToViewError: { message: 'PID not found', status: 403 } });
        expect(getByText('You are not logged in -')).toBeInTheDocument();
        expect(getByText('Login to UQ eSpace for full search results and more services.')).toBeInTheDocument();
    });

    it('should render human readable message record not found', () => {
        const { getByText } = setup({ recordToViewError: { message: 'PID not found', status: 404 } });
        expect(getByText('Work not found')).toBeInTheDocument();
        expect(getByText('(404 - PID not found)')).toBeInTheDocument();
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

    it('redirects user to login if not Authorized', () => {
        const { location } = window;
        delete window.location;

        const assignFn = jest.fn();
        window.location = {
            assign: assignFn,
        };

        const { getByTestId } = setup({
            recordToViewError: { message: 'Your session has expired', status: 403 },
        });

        fireEvent.click(getByTestId('action-button'));

        expect(assignFn).toHaveBeenCalledWith('https://fez-staging.library.uq.edu.au/login.php?url=dW5kZWZpbmVk');

        window.location = location;
    });

    it('should not render for researcher', () => {
        const { queryByTestId } = setup({
            recordToView: record,
            account: accounts.uqresearcher,
        });
        expect(queryByTestId('adminViewRecordDrawerDesktop')).not.toBeInTheDocument();
        expect(queryByTestId('adminViewRecordDrawerMobile')).not.toBeInTheDocument();
        expect(queryByTestId('adminDrawerButton')).not.toBeInTheDocument();
    });
    it('should not render for student user', () => {
        const { queryByTestId } = setup({
            recordToView: record,
            account: accounts.s1111111,
        });
        expect(queryByTestId('adminViewRecordDrawerDesktop')).not.toBeInTheDocument();
        expect(queryByTestId('adminViewRecordDrawerMobile')).not.toBeInTheDocument();
        expect(queryByTestId('adminDrawerButton')).not.toBeInTheDocument();
    });

    describe('Admin record drawer for admins', () => {
        const DESKTOP = 0;
        const MOBILE = 1;

        beforeEach(() => {
            userIsAdmin.mockImplementation(() => true);
        });

        it('should render for Admin user', () => {
            const { getByTestId, getAllByTestId } = setup({
                recordToView: record,
                account: accounts.uqstaff,
            });
            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
            expect(getAllByTestId('adminRecordDrawerCloseBtn')[DESKTOP]).not.toBeVisible();
            expect(getAllByTestId('adminRecordDrawerCloseBtn')[MOBILE]).not.toBeVisible();
        });

        it('should open desktop admin drawer when button pressed', () => {
            const { getByTestId, getAllByTestId } = setup({
                recordToView: recordWithNotes,
                account: accounts.uqstaff,
            });

            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getAllByTestId('adminRecordDrawerCloseBtn')[DESKTOP]).not.toBeVisible();

            act(() => {
                fireEvent.click(getByTestId('adminDrawerButton'));
            });

            expect(getAllByTestId('adminRecordDrawerCloseBtn')[DESKTOP]).toBeVisible();
            expect(getAllByTestId('adminRecordDrawerCloseBtn')[MOBILE]).not.toBeVisible();
        });

        it('should open mobile admin drawer when button pressed', () => {
            window.matchMedia = createMatchMedia(320);

            const { getByTestId, getAllByTestId } = setup({
                recordToView: recordWithNotes,
                account: accounts.uqstaff,
            });

            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
            expect(getAllByTestId('adminRecordDrawerCloseBtn')[MOBILE]).not.toBeVisible();

            act(() => {
                fireEvent.click(getByTestId('adminDrawerButton'));
            });

            expect(getAllByTestId('adminRecordDrawerCloseBtn')[DESKTOP]).not.toBeVisible();
            expect(getAllByTestId('adminRecordDrawerCloseBtn')[MOBILE]).toBeVisible();
        });

        it('should render data in both admin drawers', () => {
            const { getByTestId, getAllByTestId } = setup({
                recordToView: recordWithAuthorAffiliates,
                account: accounts.uqstaff,
            });

            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();

            // DESKTOP
            // Notes
            expect(getAllByTestId('drawer-content-scrollable-0-1')[DESKTOP]).toHaveTextContent(
                'Some internal notes for testing',
            );

            // Author affiliations
            expect(getAllByTestId('drawer-content-value-2-1')[DESKTOP]).toHaveTextContent('Yes');

            // WoS ID
            expect(getAllByTestId('drawer-content-clipboard-4-1')[DESKTOP]).toHaveTextContent('000381303000009');
            // WoS DocType
            expect(getAllByTestId('drawer-content-value-4-3')[DESKTOP]).toHaveTextContent('Article');

            // Scopus ID
            expect(getAllByTestId('drawer-content-clipboard-6-1')[DESKTOP]).toHaveTextContent('2-s2.0-84975764277');
            // Scopus DocType
            expect(getAllByTestId('drawer-content-value-6-3')[DESKTOP]).toHaveTextContent(
                'ar - Article (original research)',
            );

            // PubMed ID
            expect(getAllByTestId('drawer-content-clipboard-8-1')[DESKTOP]).toHaveTextContent('27166757');
            // PubMed Central ID
            expect(getAllByTestId('drawer-content-clipboard-8-3')[DESKTOP]).toHaveTextContent('PMC5179926');
            // PubMed DocType
            expect(getAllByTestId('drawer-content-value-8-5')[DESKTOP]).toHaveTextContent(
                'Journal Article - Article (original research)',
            );

            // MOBILE
            // Notes
            expect(getAllByTestId('drawer-content-scrollable-0-1')[MOBILE]).toHaveTextContent(
                'Some internal notes for testing',
            );

            // Author affiliations
            expect(getAllByTestId('drawer-content-value-2-1')[MOBILE]).toHaveTextContent('Yes');

            // WoS ID
            expect(getAllByTestId('drawer-content-clipboard-4-1')[MOBILE]).toHaveTextContent('000381303000009');
            // WoS DocType
            expect(getAllByTestId('drawer-content-value-4-3')[MOBILE]).toHaveTextContent('Article');

            // Scopus ID
            expect(getAllByTestId('drawer-content-clipboard-6-1')[MOBILE]).toHaveTextContent('2-s2.0-84975764277');
            // Scopus DocType
            expect(getAllByTestId('drawer-content-value-6-3')[MOBILE]).toHaveTextContent(
                'ar - Article (original research)',
            );

            // PubMed ID
            expect(getAllByTestId('drawer-content-clipboard-8-1')[MOBILE]).toHaveTextContent('27166757');
            // PubMed Central ID
            expect(getAllByTestId('drawer-content-clipboard-8-3')[MOBILE]).toHaveTextContent('PMC5179926');
            // PubMed DocType
            expect(getAllByTestId('drawer-content-value-8-5')[MOBILE]).toHaveTextContent(
                'Journal Article - Article (original research)',
            );
        });
    });
});
