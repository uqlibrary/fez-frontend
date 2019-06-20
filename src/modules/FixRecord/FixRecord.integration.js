/* eslint-disable */
import React from 'react';
import Immutable from 'immutable';
import {
    cleanup,
    fireEvent,
    rtlRender,
    waitForElement,
    withRedux,
    withRouter
} from 'test-utils';

import { FixRecord } from '.';
import { mockRecordToFix } from 'mock/data/testing/records';
import {
    EXISTING_RECORD_API,
 } from 'repositories/routes';

const initialState = Immutable.Map({
    accountReducer: {
        account: {
            id: 'uqresearcher',
            'class': [
                'Campus-MATERHOSP',
            ],
            type: 3,
            homeLib: 'St Lucia',
            firstName: 'J',
            lastName: 'Researcher',
            name: 'J Researcher',
            mail: 'j.Researcher@uq.edu.au',
            barcode: '240675201000000',
            groups: [
                'CN=Sci Faculty',
            ],
            classes: [],
            expiryDate: '31-12-19',
            hasSession: true,
            tokenBased: false,
            canMasquerade: false,
            blocked: false,
        },
        author: {
            aut_id: 410,
            aut_org_username: 'uqresearcher',
            aut_org_staff_id: '0001952',
            aut_org_student_id: null,
            aut_email: '',
            aut_display_name: 'Researcher, J',
            aut_fname: 'J',
            aut_mname: '',
            aut_lname: 'Researcher',
            aut_title: 'Professor',
            aut_position: '',
            aut_homepage_link: '',
            aut_created_date: null,
            aut_update_date: '2017-07-23',
            aut_external_id: '0000040357',
            aut_ref_num: '',
            aut_researcher_id: 'A-1137-2007',
            aut_scopus_id: '35478294000',
            aut_is_scopus_id_authenticated: 1,
            aut_mypub_url: '',
            aut_rid_password: '',
            aut_people_australia_id: '',
            aut_description: '',
            aut_orcid_id: '0000-0001-1111-1111',
            aut_google_scholar_id: 'kUemDfMAAAAJ',
            aut_rid_last_updated: '2013-05-17',
            aut_publons_id: null,
            aut_student_username: null,
        },
        authorDetails: {
            uqr_id: 14,
            espace_id: 20288,
            image_exists: 1,
            username: 'uqresearcher',
            staff_id: '0000111',
            given_name: 'J',
            family_name: 'Researcher',
            title: 'Professor',
            scopus_id: '',
            google_scholar_id: 'kUemDfMAAAAJ',
            researcher_id: 'G-111-1111',
            orcid_id: '0000-0001-1111-1111',
            publons_id: '',
            mypub_url: 'uqresearcher',
            org_units: [
                'Institute for Molecular Bioscience',
                'Institute for Molecular Bioscience',
                'School of Chemistry and Molecular Biosciences',
                'The University of Queensland Diamantina Institute',
            ],
            positions: [
                'Affiliate Professor',
                'Casual Affiliate Professor',
                'Affiliate Professorial Res Fellow',
                'ARC Australian Laureate Fellow',
            ],
            espace: {
                first_year: 1975,
                last_year: 2018,
                doc_count: 357,
            },
        },
        accountLoading: false,
        accountAuthorLoading: false,
        accountAuthorDetailsLoading: false,
        isSessionExpired: null,
        accountAuthorSaving: false,
        accountAuthorError: null,
    },
    fixRecordReducer: {
        recordToFix: mockRecordToFix,
        loadingRecordToFix: false,
        recordToFixError: null,
    },
});


describe('FixRecord form', () => {

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        cleanup();
    });

    it('should allow content indicators to be selected', async () => {
        mockApi
            .onAny(EXISTING_RECORD_API({ pid: 'UQ:41878' }).apiUrl)
            .reply(200, { data: mockRecordToFix })
        ;

        const path = '/records/:pid(UQ:[a-z0-9]+)/fix';
        const route = '/records/UQ:41878/fix';

        const {
            asFragment,
            getByText,
            getByTestId
        } = rtlRender(
            withRedux(initialState)(
                withRouter({ route, path })(
                    <FixRecord />
                )
            )
        );

        let fragment = asFragment();

        // Wait till record is loaded
        await waitForElement(() => getByText('Work to be amended'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        // Open action dropdown
        fireEvent.click(getByTestId('fixAction'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        // Choose option to fix record
        fireEvent.click(getByText(/I am the author/));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        // Open Content Indicators dropdown
        fireEvent.click(getByTestId('content-indicators'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        /**
         * Selected & disabled items should not be clickable to deselect.
         * They actually seem to be clickable when these tests are run,
         * even though they aren't clickable in browser.
         * https://github.com/mui-org/material-ui/issues/13464 may be
         * the reason for this unexpected behaviour. Should re-test after
         * the changes have been applied via an MUI upgrade.
         */
        // fireEvent.click(getByText('Scholarship of Teaching and Learning'));
        // fireEvent.click(getByText('Protocols'));
        // expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        // Test if item can be selected
        fireEvent.click(getByText('Case Study'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        // Test if item can be deselected
        fireEvent.click(getByText('Case Study'));
        expect(fragment).toMatchDiffSnapshot(asFragment());
    });

    it('should validate the form where applicable and submit correctly', async () => {

        mockApi
            .onAny()
            .reply(200, { data: mockRecordToFix })
        ;

        const path = '/records/:pid(UQ:[a-z0-9]+)/fix';
        const route = '/records/UQ:41878/fix';

        const {
            asFragment,
            getByText,
            getByTestId
        } = rtlRender(
            withRedux(initialState)(
                withRouter({ route, path })(
                    <FixRecord />
                )
            )
        );

        await waitForElement(() => getByText('Work to be amended'));
        fireEvent.click(getByTestId('fixAction'));
        fireEvent.click(getByText(/I am the author/));
        fireEvent.click(getByTestId('content-indicators'));
        fireEvent.click(getByText('Case Study'));

        let fragment = asFragment();

        // Select unselected item and submit
        fireEvent.click(getByTestId('fixSubmit'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        await waitForElement(() => getByText('Your request has been submitted'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

    });
});
