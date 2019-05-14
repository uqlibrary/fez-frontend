/* eslint-disable */
import React from 'react';
import { MyIncompleteRecord } from '.';
import Immutable from 'immutable';
import UQ352045 from 'mock/data/records/incompleteNTRORecordUQ352045';
import {
    rtlRender,
    fireEvent,
    cleanup,
    withRedux,
    withRouter,
    getByTestId
} from 'test-utils';

const initialState = Immutable.Map({
    accountReducer: {
        account: {
            id: 'uqrdav10',
            'class': [
                'Campus-STLUCIA',
                'Faculty of Humanities and Social Sciences',
                'IS_ACADEMIC',
                'IS_CONTINUING',
                'IS_CURRENT',
                'IS_PAID',
                'IS_SUBSTANTIVE',
                'IS_TEACHING_AND_RESEARCH',
                'IS_UQ_STAFF_PLACEMENT',
                'Office of the Provost',
                'School of Music',
                'staff@uq.edu.au',
                'uqrdav10@uq.edu.au'
            ],
            type: 3,
            homeLib: 'St Lucia',
            firstName: 'Robert',
            lastName: 'DAVIDSON',
            name: 'Robert DAVIDSON',
            mail: 'r.davidson2@uq.edu.au',
            barcode: '24067620872938',
            groups: [
                'CN=lib_staff,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_staff_lts,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_ladmin,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libshare_rw,OU=lib-libshare-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libshare_ro,OU=lib-libshare-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_www,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_UQLCompAccess,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_dev,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libapi_MembershipAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libapi_LiaisonAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_www_cleanup,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_lts,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_uqsoftserv,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libapi_SpotlightAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libshare_Governance_CommitteesOther_LPPG,OU=lib-libshare-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libshare_Governance_CommitteesGoverning_LX,OU=lib-libshare-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libshare_ExternalRelations_Advancement_Donations,OU=lib-libshare-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libshare_ISRS_IR_Data_Licenses_Contracts,OU=lib-libshare-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_libapi_MasqueradeUsers,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=LIB_Staff_All,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=LIB_Staff_ISRS,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                'CN=lib_servicepoint_login,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au'
            ],
            classes: [],
            expiryDate: '31-12-99',
            hasSession: true,
            tokenBased: false,
            canMasquerade: false,
            blocked: false,
            masqueradingId: 'uqvasai',
            masqueradingType: 'full'
        },
        author: {
            aut_id: 79324,
            aut_org_username: 'uqrdav10',
            aut_org_staff_id: '0003370',
            aut_org_student_id: null,
            aut_email: 'r.davidson2@uq.edu.au',
            aut_display_name: 'Robert Davidson',
            aut_fname: 'Robert',
            aut_mname: null,
            aut_lname: 'Davidson',
            aut_title: 'Dr',
            aut_position: null,
            aut_homepage_link: null,
            aut_created_date: '2009-04-13T00:00:00Z',
            aut_update_date: '2019-04-07T19:23:53Z',
            aut_external_id: null,
            aut_ref_num: null,
            aut_researcher_id: 'I-7251-2018',
            aut_scopus_id: null,
            aut_is_scopus_id_authenticated: 0,
            aut_mypub_url: null,
            aut_rid_password: '',
            aut_people_australia_id: null,
            aut_description: null,
            aut_orcid_id: '0000-0001-8694-6144',
            aut_orcid_bio: null,
            aut_orcid_works_last_modified: null,
            aut_google_scholar_id: null,
            aut_twitter_username: null,
            aut_rid_last_updated: '1975-12-15',
            aut_publons_id: null,
            aut_student_username: null,
            aut_orcid_works_last_sync: null,
            aut_is_orcid_sync_enabled: null
        },
        authorDetails: {
            espace_id: 79324,
            staff_id: '0003370',
            given_name: 'Robert',
            family_name: 'Davidson',
            title: 'Dr',
            scopus_id: null,
            google_scholar_id: null,
            researcher_id: 'I-7251-2018',
            orcid_id: '0000-0001-8694-6144',
            publons_id: null,
            mypub_url: null,
            username: 'uqrdav10',
            org_units: [
                'School of Music'
            ],
            positions: [
                'Senior Lecturer'
            ],
            uqr_id: 394,
            image_exists: 1,
            espace: {
                first_year: 2001,
                last_year: 2019,
                doc_count: 192
            }
        },
        accountLoading: false,
        accountAuthorLoading: false,
        accountAuthorDetailsLoading: false,
        isSessionExpired: null,
        accountAuthorSaving: false,
        accountAuthorError: null
    },
    fixRecordReducer: {
        recordToFix: UQ352045,
        loadingRecordToFix: false,
        recordToFixError: null
    }
});
describe('MyIncompleteRecord form', () => {
    describe('Creative Work:Live Performance of Creative Work - Music', () => {
        afterEach(cleanup);
        it('should allow user to update work', async () => {
            const route = '/records/UQ:352045/incomplete';
            const {
                container,
                asFragment,
                getByText
            } = rtlRender(withRedux(initialState)(withRouter({route})(<MyIncompleteRecord/>)));

            let fragment = asFragment();
            expect(getByTestId(container, 'update-my-work')).toHaveAttribute('disabled');

            fireEvent.click(getByTestId(container, 'significance'));
            fireEvent.click(getByText(/Major/));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            fireEvent.click(getByTestId(container, 'rek-audience-size'));
            fireEvent.click(getByText(/less than 100/i));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            fireEvent.click(getByTestId(container, 'quality-indicators'));
            fireEvent.click(getByText(/commissioned by external body/i));
            fireEvent.click(container);
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            expect(getByTestId(container, 'delete-author-0')).toHaveAttribute('disabled');
            expect(getByTestId(container, 'delete-author-1')).toHaveAttribute('disabled');
            expect(getByTestId(container, 'delete-author-2')).toHaveAttribute('disabled');
            expect(getByTestId(container, 'delete-author-3')).toHaveAttribute('disabled');

            fireEvent.click(getByTestId(container, 'contributor-editor-row-0'));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            expect(getByTestId(container, 'submit-author')).toHaveAttribute('disabled');

            expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
            fireEvent.change(getByTestId(container, 'org-affiliation-name'), {target: {value: 'test'}});
            fireEvent.click(getByTestId(container, 'org-affiliation-type'));
            fireEvent.click(getByText('Government'));
            expect(getByTestId(container, 'submit-author')).not.toHaveAttribute('disabled');

            fireEvent.click(getByTestId(container, 'submit-author'));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            fireEvent.click(getByTestId(container, 'contributor-editor-row-1'));
            expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
            fireEvent.click(getByTestId(container, 'org-affiliation-selector'));
            fireEvent.click(getByText(/^uq$/i));
            expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
            fireEvent.click(getByTestId(container, 'submit-author'));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            fireEvent.click(getByTestId(container, 'contributor-editor-row-2'));
            expect(fragment).toMatchDiffSnapshot(fragment);

            fireEvent.click(getByTestId(container, 'contributor-editor-row-3'));
            expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
            fireEvent.click(getByTestId(container, 'org-affiliation-selector'));
            fireEvent.click(getByText(/^uq$/i));
            expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
            fireEvent.click(getByTestId(container, 'submit-author'));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
        });
    });
});