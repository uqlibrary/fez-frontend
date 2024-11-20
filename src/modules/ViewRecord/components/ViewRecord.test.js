import React from 'react';
import ViewRecord from './ViewRecord';
import Immutable from 'immutable';
import { fireEvent, render, WithReduxStore, WithRouter, createMatchMedia } from 'test-utils';
import * as ViewRecordActions from 'actions/viewRecord';
import { userIsAdmin, userIsAuthor } from 'hooks';
import { ntro } from 'mock/data/testing/records';
import { default as record } from 'mock/data/records/record';
import { recordWithNoAffiliationIssues } from 'mock/data/records';
import { accounts, currentAuthor } from 'mock/data/account';
import { useParams } from 'react-router-dom';
import { recordVersionLegacy } from 'mock/data';
import locale from 'locale/pages';
import { notFound } from 'config/routes';
import globalLocale from 'locale/global';
import { default as recordWithNotes } from 'mock/data/records/recordWithNotes';
import { default as recordWithAuthorAffiliates } from 'mock/data/records/recordWithAuthorAffiliates';
import { NTRO_SUBTYPE_RREB_PUBLIC_SECTOR, PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

jest.mock('../../../hooks', () => ({
    userIsAdmin: jest.fn(() => ({})),
    isIntWithin: jest.requireActual('../../../hooks').isIntWithin,
    belongsToAuthor: jest.requireActual('../../../hooks').belongsToAuthor,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ pid: 'UQ:123456' })),
    useNavigate: jest.fn(() => jest.fn()),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

const setup = (state = {}, renderer = render) => {
    const { accountReducer, viewRecordReducer } = state;
    const initState = {
        accountReducer: {
            account: accounts.uqresearcher,
            author: null,
            ...accountReducer,
        },
        viewRecordReducer: {
            isDeleted: false,
            isDeletedVersion: false,
            loadingRecordToView: false,
            recordToViewError: null,
            recordToView: null,
            ...viewRecordReducer,
        },
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(initState)}>
            <WithRouter>
                <ViewRecord />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('ViewRecord', () => {
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
        const { asFragment } = setup({
            viewRecordReducer: { recordToView: {} },
        });
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
        const { getByTestId } = setup({
            viewRecordReducer: { recordToView: record },
        });

        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });

    it('should render default view with admin menu when AA issues and internal notes exist', () => {
        // Checked OK
        const affiliationIssues = {
            fez_author_affiliation: [
                {
                    af_id: 478894,
                    af_pid: 'UQ:871c1f8',
                    af_author_id: 7624000,
                    af_percent_affiliation: 900,
                    af_org_id: 881,
                    af_status: 1,
                    fez_author: {
                        aut_id: 88844,
                        aut_display_name: 'one Wrong',
                    },
                    fez_org_structure: [
                        {
                            org_id: 881,
                            org_title: 'School of Chemistry and Molecular Biosciences',
                        },
                    ],
                },
                {
                    af_id: 478894,
                    af_pid: 'UQ:871c1f8',
                    af_author_id: 7624001,
                    af_percent_affiliation: 100000,
                    af_org_id: 881,
                    af_status: 1,
                    fez_author: {
                        aut_id: 88844,
                        aut_display_name: 'two OK',
                    },
                    fez_org_structure: [
                        {
                            org_id: 881,
                            org_title: 'School of Chemistry and Molecular Biosciences',
                        },
                    ],
                },
            ],
            fez_internal_notes: { ain_detail: 'test' },
        };
        const recordwithIssues = { ...recordWithNoAffiliationIssues, ...affiliationIssues };
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByTestId } = setup({
            viewRecordReducer: { recordToView: recordwithIssues },
        });

        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });

    it('should render feedback button', () => {
        const { getByRole } = setup({
            viewRecordReducer: {
                recordToView: { ...record, fez_record_search_key_ismemberof: [{ rek_ismemberof: 'UQ:774620b' }] },
            },
        });

        expect(getByRole('button', { name: 'Tell Us More' })).toBeInTheDocument();
    });

    it('should not render feedback button', () => {
        const { queryByTestId } = setup({
            viewRecordReducer: { recordToView: record },
        });

        expect(queryByTestId('btnFeedback')).not.toBeInTheDocument();
    });

    it('should render default view with admin menu when no AA issues exist', () => {
        // Checked OK
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByTestId } = setup({
            viewRecordReducer: { recordToView: recordWithNoAffiliationIssues },
        });
        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });
    it('should render internal notes view with admin menu when no AA issues exist', () => {
        // Checked OK
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByTestId } = setup({
            viewRecordReducer: {
                recordToView: { ...recordWithNoAffiliationIssues, fez_internal_notes: { ain_detail: 'test' } },
            },
        });
        expect(getByTestId('admin-actions-button')).toBeInTheDocument();
    });

    it('should render version', () => {
        // Checked OK
        const txt = locale.pages.viewRecord.version;
        const pid = 'UQ:1';
        const loadRecordToViewFn = jest.spyOn(ViewRecordActions, 'loadRecordVersionToView');
        useParams.mockImplementationOnce(() => ({ pid, version: recordVersionLegacy.rek_version }));
        const { getByTestId } = setup({ viewRecordReducer: { recordToView: recordVersionLegacy } });
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
        const { getByTestId } = setup({
            viewRecordReducer: { recordToView: recordVersionLegacy, isDeletedVersion: true },
        });
        expect(loadRecordToViewFn).toHaveBeenCalledWith(pid, recordVersionLegacy.rek_version);
        expect(getByTestId(txt.alert.version.alertId)).toBeInTheDocument();
        expect(getByTestId(txt.alert.warning.alertId)).toBeInTheDocument();
    });

    it('should render deleted record correctly', () => {
        const { getByText } = setup({ viewRecordReducer: { isDeleted: true, recordToView: record } });
        expect(getByText('This work has been deleted.')).toBeInTheDocument();
        expect(
            getByText(
                'Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer (default record)',
            ),
        ).toBeInTheDocument();
    });

    it('should render deleted data collection correctly', () => {
        const { getByText } = setup({
            viewRecordReducer: {
                isDeleted: true,
                recordToView: { ...record, rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION },
            },
        });
        expect(getByText('This work has been deleted.')).toBeInTheDocument();
        expect(
            getByText(
                'Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer (default record)',
            ),
        ).toBeInTheDocument();
    });

    it('should render deleted data collection with new doi correctly', () => {
        const newDoi = '10.000/abc';
        const { getByText, container } = setup({
            viewRecordReducer: {
                isDeleted: true,
                recordToView: {
                    ...record,
                    rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                    fez_record_search_key_new_doi: {
                        rek_new_doi: '10.000/abc',
                    },
                },
            },
        });
        expect(container.textContent).toContain(
            'This Data Collection has been deleted and substituted by another version.',
        );
        expect(container.querySelector(`[href="https://doi.org/${newDoi}"][target="_blank"]`)).toBeInTheDocument();
        expect(
            getByText(
                'Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer (default record)',
            ),
        ).toBeInTheDocument();
    });

    it('should render deleted data collection with new doi and deletion notes correctly', () => {
        const newDoi = '10.000/abc';
        const deletionNotes = 'notes test';
        const { getByText, container } = setup({
            viewRecordReducer: {
                isDeleted: true,
                recordToView: {
                    ...record,
                    rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                    fez_record_search_key_new_doi: {
                        rek_new_doi: '10.000/abc',
                    },
                    fez_record_search_key_deletion_notes: {
                        rek_deletion_notes: deletionNotes,
                    },
                },
            },
        });
        expect(container.textContent).toContain(
            'This Data Collection has been deleted and substituted by another version.',
        );
        expect(container.querySelector(`[href="https://doi.org/${newDoi}"][target="_blank"]`)).toBeInTheDocument();
        expect(container.textContent).toContain(deletionNotes);
        expect(
            getByText(
                'Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer (default record)',
            ),
        ).toBeInTheDocument();
    });

    it('should render deleted data collection with deletion notes correctly', () => {
        const deletionNotes = 'notes test';
        const { getByText, container } = setup({
            viewRecordReducer: {
                isDeleted: true,
                recordToView: {
                    ...record,
                    rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                    fez_record_search_key_deletion_notes: {
                        rek_deletion_notes: deletionNotes,
                    },
                },
            },
        });
        expect(getByText('This work has been deleted.')).toBeInTheDocument();
        expect(container.textContent).toContain(deletionNotes);
        expect(
            getByText(
                'Long-range regulators of the lncRNA HOTAIR enhance its prognostic potential in breast cancer (default record)',
            ),
        ).toBeInTheDocument();
    });

    it('should render loader', () => {
        const { getByText } = setup({ viewRecordReducer: { loadingRecordToView: true } });
        expect(getByText('Loading work')).toBeInTheDocument();
    });

    it('should render not found', () => {
        useParams.mockImplementationOnce(() => ({ pid: notFound }));
        const { container, queryByText } = setup();
        expect(container).toMatchSnapshot();
        expect(queryByText(locale.pages.workNotFound.title)).toBeInTheDocument();
        expect(queryByText(globalLocale.global.loginAlert.title)).not.toBeInTheDocument();
    });

    it('should render error', () => {
        const { getByText } = setup({
            viewRecordReducer: { recordToViewError: { message: 'PID not found', status: 403 } },
        });
        expect(getByText('You are not logged in -')).toBeInTheDocument();
        expect(getByText('Login to UQ eSpace for full search results and more services.')).toBeInTheDocument();
    });

    it('should render human readable message record not found', () => {
        const { getByText } = setup({
            viewRecordReducer: { recordToViewError: { message: 'PID not found', status: 404 } },
        });
        expect(getByText('Work not found')).toBeInTheDocument();
        expect(getByText('(404 - PID not found)')).toBeInTheDocument();
    });

    it('should have status prop in the header for admins', () => {
        window.matchMedia = createMatchMedia(window.innerWidth);
        userIsAdmin.mockImplementationOnce(() => true);
        const { getByText } = setup({
            viewRecordReducer: { recordToView: { ...record, rek_status: 1, rek_status_lookup: 'Unpublished' } },
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
        const { unmount } = setup({ viewRecordReducer: { recordToView: record } });
        unmount();
        expect(clearRecordToViewFn).toHaveBeenCalled();
    });

    it('should render NTRO Details', () => {
        const { getAllByText } = setup({
            viewRecordReducer: { recordToView: ntro },
            accountReducer: {
                account: {
                    canMasquerade: true,
                },
            },
        });
        expect(getAllByText('Scale/Significance of work').length).toBe(2);
    });

    it('should rerender component on props change', () => {
        const { getByText, queryByText, rerender } = setup({ viewRecordReducer: { loadingRecordToView: true } });
        expect(getByText('Loading work')).toBeInTheDocument();

        setup({ viewRecordReducer: { loadingRecordToView: false, recordToView: record } }, rerender);
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
            viewRecordReducer: { recordToViewError: { message: 'Your session has expired', status: 403 } },
        });

        fireEvent.click(getByTestId('action-button'));

        expect(assignFn).toHaveBeenCalledWith('https://fez-staging.library.uq.edu.au/login?url=dW5kZWZpbmVk');

        window.location = location;
    });

    it('should not render for researcher', () => {
        const { queryByTestId } = setup({
            viewRecordReducer: { recordToView: record },
            accountReducer: { account: accounts.uqresearcher },
        });
        expect(queryByTestId('adminViewRecordDrawerDesktop')).not.toBeInTheDocument();
        expect(queryByTestId('adminViewRecordDrawerMobile')).not.toBeInTheDocument();
        expect(queryByTestId('adminDrawerButton')).not.toBeInTheDocument();
    });
    it('should not render for student user', () => {
        const { queryByTestId } = setup({
            viewRecordReducer: { recordToView: record },
            accountReducer: { account: accounts.s1111111 },
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
                viewRecordReducer: { recordToView: record },
                accountReducer: { account: accounts.uqstaff },
            });
            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
            expect(getByTestId('btnAdminRecordDrawerCloseBtnDesktop')).not.toBeVisible();
            expect(getByTestId('btnAdminRecordDrawerCloseBtnMobile')).not.toBeVisible();
        });

        it('should open desktop admin drawer when button pressed', () => {
            const { getByTestId } = setup({
                viewRecordReducer: { recordToView: recordWithNotes },
                accountReducer: { account: accounts.uqstaff },
            });

            expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
            expect(getByTestId('btnAdminRecordDrawerCloseBtnDesktop')).not.toBeVisible();

            fireEvent.click(getByTestId('btnAdminToggleDrawerVisibility'));

            expect(getByTestId('btnAdminRecordDrawerCloseBtnDesktop')).toBeVisible();
            expect(getByTestId('btnAdminRecordDrawerCloseBtnMobile')).not.toBeVisible();
        });

        it('should open mobile admin drawer when button pressed', () => {
            window.matchMedia = createMatchMedia(320);

            const { getByTestId } = setup({
                viewRecordReducer: { recordToView: recordWithNotes },
                accountReducer: { account: accounts.uqstaff },
            });

            expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
            expect(getByTestId('btnAdminRecordDrawerCloseBtnMobile')).not.toBeVisible();

            fireEvent.click(getByTestId('btnAdminToggleDrawerVisibility'));

            expect(getByTestId('btnAdminRecordDrawerCloseBtnDesktop')).not.toBeVisible();
            expect(getByTestId('btnAdminRecordDrawerCloseBtnMobile')).toBeVisible();
        });

        it('should render data in both admin drawers', () => {
            const { getByTestId } = setup({
                viewRecordReducer: { recordToView: recordWithAuthorAffiliates },
                accountReducer: { account: accounts.uqstaff },
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
                'Valid author affiliation information has been added',
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
                'Valid author affiliation information has been added',
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
                viewRecordReducer: { recordToView: publication },
                accountReducer: { account: accounts.uqresearcher, author: currentAuthor.uqresearcher.data },
            });
            expect(queryByText(filename)).not.toBeInTheDocument();
        });

        it('should show admin only attachments to admin', () => {
            userIsAdmin.mockImplementation(() => true);
            const { queryByText } = setup({
                viewRecordReducer: { recordToView: publication },
                accountReducer: { account: accounts.uqresearcher, author: currentAuthor.uqresearcher.data },
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
                    viewRecordReducer: { recordToView: ntroPublication },
                    accountReducer: { account: accounts.uqresearcher, author: currentAuthor.uqresearcher.data },
                });
                expect(queryByText(filename)).toBeInTheDocument();
            });

            it("shouldn't show admin only attachments to authors of NTROs research reports", () => {
                const { queryByText } = setup({
                    viewRecordReducer: {
                        recordToView: { ...ntroPublication, rek_subtype: NTRO_SUBTYPE_RREB_PUBLIC_SECTOR },
                    },
                    accountReducer: { account: accounts.uqresearcher, author: currentAuthor.uqresearcher.data },
                });
                expect(queryByText(filename)).not.toBeInTheDocument();
            });
        });
    });
});
