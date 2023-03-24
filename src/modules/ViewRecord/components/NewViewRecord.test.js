import React from 'react';
import NewViewRecord from './NewViewRecord';
import { act, fireEvent, render, WithReduxStore, WithRouter, createMatchMedia } from 'test-utils';
import * as ViewRecordActions from 'actions/viewRecord';
import { userIsAdmin, userIsAuthor } from 'hooks';
import { ntro } from 'mock/data/testing/records';
import { default as record } from 'mock/data/records/record';
import { recordWithNoAffiliationIssues } from 'mock/data/records';
import { accounts, currentAuthor } from 'mock/data/account';
import { useParams } from 'react-router';
import { recordVersionLegacy } from '../../../mock/data';
import locale from '../../../locale/pages';
import { notFound } from '../../../config/routes';
import { stripHtml } from '../../../helpers/general';
import globalLocale from '../../../locale/global';
import { default as recordWithNotes } from 'mock/data/records/recordWithNotes';
import { default as recordWithAuthorAffiliates } from 'mock/data/records/recordWithAuthorAffiliates';
import { NTRO_SUBTYPE_RREB_PUBLIC_SECTOR } from '../../../config/general';

jest.mock('../../../hooks', () => ({
    userIsAdmin: jest.fn(() => ({})),
    isIntWithin: jest.requireActual('../../../hooks').isIntWithin,
    belongsToAuthor: jest.requireActual('../../../hooks').belongsToAuthor,
}));

jest.mock('react-router', () => ({
    useParams: jest.fn(() => ({ pid: 'UQ:123456' })),
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({})),
}));

const setup = (testProps = {}, renderer = render) => {
    const props = {
        account: accounts.uqresearcher,
        author: null,
        isDeleted: false,
        isDeletedVersion: false,
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
        userIsAuthor && userIsAuthor.mockImplementation(() => true);
    });

    afterEach(() => {
        userIsAdmin.mockReset();
        userIsAuthor && userIsAuthor.mockReset();
    });

    it('should render default empty view', () => {
        // Checked OK
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
        // Checked OK
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
        // Checked OK
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByTestId } = setup({ recordToView: record });
        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });

    it('should render default view with admin menu when no AA issues exist', () => {
        // Checked OK
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByTestId } = setup({ recordToView: recordWithNoAffiliationIssues });
        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });
    it('should render internal notes view with admin menu when no AA issues exist', () => {
        // Checked OK
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByTestId } = setup({
            recordToView: { ...recordWithNoAffiliationIssues, fez_internal_notes: { ain_detail: 'test' } },
        });
        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });

    it('should render version', () => {
        // Checked OK
        const txt = locale.pages.viewRecord.version;
        const pid = 'UQ:1';
        const loadRecordToViewFn = jest.spyOn(ViewRecordActions, 'loadRecordVersionToView');
        useParams.mockImplementationOnce(() => ({ pid, version: recordVersionLegacy.rek_version }));
        const { getByTestId } = setup({ recordToView: recordVersionLegacy });
        expect(loadRecordToViewFn).toHaveBeenCalledWith(pid, recordVersionLegacy.rek_version);
        expect(getByTestId(txt.alert.version.alertId)).toBeInTheDocument();
        expect(getByTestId(txt.alert.warning.alertId)).toBeInTheDocument();
    });

    it('should render deleted version', () => {
        // Checked OK
        const txt = locale.pages.viewRecord.version;
        const pid = 'UQ:1';
        const loadRecordToViewFn = jest.spyOn(ViewRecordActions, 'loadRecordVersionToView');
        useParams.mockImplementationOnce(() => ({ pid, version: recordVersionLegacy.rek_version }));
        const { getByTestId } = setup({ recordToView: recordVersionLegacy, isDeletedVersion: true });
        expect(loadRecordToViewFn).toHaveBeenCalledWith(pid, recordVersionLegacy.rek_version);
        expect(getByTestId(txt.alert.version.alertId)).toBeInTheDocument();
        expect(getByTestId(txt.alert.warning.alertId)).toBeInTheDocument();
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

    it('should render not found', () => {
        useParams.mockImplementationOnce(() => ({ pid: notFound }));
        const { queryByText } = setup();
        expect(queryByText(locale.pages.viewRecord.notFound.title)).toBeInTheDocument();
        stripHtml(componentToString(locale.pages.viewRecord.notFound.message))
            .replace(/\n+/, '\n')
            .split('\n')
            .filter(line => line.trim())
            .forEach(line => expect(queryByText(line.trim())).toBeInTheDocument());
        expect(queryByText(globalLocale.global.loginAlert.title)).not.toBeInTheDocument();
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
        window.matchMedia = createMatchMedia(window.innerWidth);
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByText } = setup({
            recordToView: { ...record, rek_status: 1, rek_status_lookup: 'Unpublished' },
        });
        expect(getByText('Unpublished')).toBeInTheDocument();
    });

    it('should load record to view', () => {
        const loadRecordToViewFn = jest.spyOn(ViewRecordActions, 'loadRecordToView');
        useParams.mockImplementationOnce(() => ({ pid: 'UQ:111111' }));
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
        beforeEach(() => {
            userIsAdmin.mockImplementation(() => true);
        });

        it('should render for Admin user', () => {
            const { getByTestId } = setup({
                recordToView: record,
                account: accounts.uqstaff,
            });
            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
            expect(getByTestId('adminRecordDrawerCloseBtnDesktop')).not.toBeVisible();
            expect(getByTestId('adminRecordDrawerCloseBtnMobile')).not.toBeVisible();
        });

        it('should open desktop admin drawer when button pressed', () => {
            const { getByTestId } = setup({
                recordToView: recordWithNotes,
                account: accounts.uqstaff,
            });

            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getByTestId('adminRecordDrawerCloseBtnDesktop')).not.toBeVisible();

            act(() => {
                fireEvent.click(getByTestId('adminDrawerButton'));
            });

            expect(getByTestId('adminRecordDrawerCloseBtnDesktop')).toBeVisible();
            expect(getByTestId('adminRecordDrawerCloseBtnMobile')).not.toBeVisible();
        });

        it('should open mobile admin drawer when button pressed', () => {
            window.matchMedia = createMatchMedia(320);

            const { getByTestId } = setup({
                recordToView: recordWithNotes,
                account: accounts.uqstaff,
            });

            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
            expect(getByTestId('adminRecordDrawerCloseBtnMobile')).not.toBeVisible();

            act(() => {
                fireEvent.click(getByTestId('adminDrawerButton'));
            });

            expect(getByTestId('adminRecordDrawerCloseBtnDesktop')).not.toBeVisible();
            expect(getByTestId('adminRecordDrawerCloseBtnMobile')).toBeVisible();
        });

        it('should render data in both admin drawers', () => {
            const { getByTestId } = setup({
                recordToView: recordWithAuthorAffiliates,
                account: accounts.uqstaff,
            });

            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();

            // DESKTOP
            // Notes
            expect(getByTestId('drawer-Desktop-content-scrollable-0-1')).toHaveTextContent(
                'Some internal notes for testing',
            );

            // Author affiliations
            expect(getByTestId('drawer-Desktop-content-value-2-1')).toHaveTextContent(
                'orphaned organisation information',
            );

            // WoS ID
            expect(getByTestId('drawer-Desktop-content-clipboard-4-1')).toHaveTextContent('000381303000009');
            // WoS DocType
            expect(getByTestId('drawer-Desktop-content-value-4-3')).toHaveTextContent('Article');

            // Scopus ID
            expect(getByTestId('drawer-Desktop-content-clipboard-6-1')).toHaveTextContent('2-s2.0-84975764277');
            // Scopus DocType
            expect(getByTestId('drawer-Desktop-content-value-6-3')).toHaveTextContent(
                'ar - Article (original research)',
            );

            // PubMed ID
            expect(getByTestId('drawer-Desktop-content-clipboard-8-1')).toHaveTextContent('27166757');
            // PubMed Central ID
            expect(getByTestId('drawer-Desktop-content-clipboard-8-3')).toHaveTextContent('PMC5179926');
            // PubMed DocType
            expect(getByTestId('drawer-Desktop-content-value-8-5')).toHaveTextContent(
                'Journal Article - Article (original research)',
            );

            // MOBILE
            // Notes
            expect(getByTestId('drawer-Mobile-content-scrollable-0-1')).toHaveTextContent(
                'Some internal notes for testing',
            );

            // Author affiliations
            expect(getByTestId('drawer-Mobile-content-value-2-1')).toHaveTextContent(
                'orphaned organisation information',
            );

            // WoS ID
            expect(getByTestId('drawer-Mobile-content-clipboard-4-1')).toHaveTextContent('000381303000009');
            // WoS DocType
            expect(getByTestId('drawer-Mobile-content-value-4-3')).toHaveTextContent('Article');

            // Scopus ID
            expect(getByTestId('drawer-Mobile-content-clipboard-6-1')).toHaveTextContent('2-s2.0-84975764277');
            // Scopus DocType
            expect(getByTestId('drawer-Mobile-content-value-6-3')).toHaveTextContent(
                'ar - Article (original research)',
            );

            // PubMed ID
            expect(getByTestId('drawer-Mobile-content-clipboard-8-1')).toHaveTextContent('27166757');
            // PubMed Central ID
            expect(getByTestId('drawer-Mobile-content-clipboard-8-3')).toHaveTextContent('PMC5179926');
            // PubMed DocType
            expect(getByTestId('drawer-Mobile-content-value-8-5')).toHaveTextContent(
                'Journal Article - Article (original research)',
            );
        });
    });

    describe('datastream visibility', () => {
        const filename = 'image.jpg';
        const publication = {
            ...record,
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:792099',
                    dsi_dsid: filename,
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'testing image description',
                    dsi_mimetype: 'image/jpeg',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 97786,
                    dsi_security_policy: 1,
                    dsi_security_inherited: 0,
                },
            ],
        };
        publication.fez_record_search_key_author_id[0].rek_author_id = currentAuthor.uqresearcher.data.aut_id;

        it("shouldn't show admin only attachments to authors", () => {
            const { queryByText } = setup({
                recordToView: publication,
                account: accounts.uqresearcher,
                author: currentAuthor.uqresearcher.data,
            });
            expect(queryByText(filename)).not.toBeInTheDocument();
        });

        it('should show admin only attachments to admin', () => {
            userIsAdmin.mockImplementation(() => true);
            const { queryByText } = setup({
                recordToView: publication,
                account: accounts.uqresearcher,
                author: currentAuthor.uqresearcher.data,
            });
            expect(queryByText(filename)).toBeInTheDocument();
        });

        describe('NTRO', () => {
            const ntroPublication = {
                ...ntro,
                fez_record_search_key_author_id: publication.fez_record_search_key_author_id,
                fez_datastream_info: publication.fez_datastream_info,
            };

            it('should show admin only attachments to authors of NTROs (non research reports)', () => {
                const filename = 'image.jpg';
                const { queryByText } = setup({
                    recordToView: ntroPublication,
                    account: accounts.uqresearcher,
                    author: currentAuthor.uqresearcher.data,
                });
                expect(queryByText(filename)).toBeInTheDocument();
            });

            it("shouldn't show admin only attachments to authors of NTROs research reports", () => {
                const { queryByText } = setup({
                    recordToView: { ...ntroPublication, rek_subtype: NTRO_SUBTYPE_RREB_PUBLIC_SECTOR },
                    account: accounts.uqresearcher,
                    author: currentAuthor.uqresearcher.data,
                });
                expect(queryByText(filename)).not.toBeInTheDocument();
            });
        });
    });
});
