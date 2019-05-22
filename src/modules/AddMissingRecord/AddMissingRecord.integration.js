/* eslint-disable */
import React from 'react';
import AddMissingRecord from './containers/AddMissingRecord';
import NewRecord from './components/steps/NewRecord';
import Immutable from 'immutable';
import { rtlRender, fireEvent, waitForElement, cleanup, withRedux, withRouter } from 'test-utils';

const initialState = Immutable.Map({
    accountReducer: {
        account: {
            'id': 'uqresearcher',
            "class": ["Campus-MATERHOSP"],
            "type": 3,
            "homeLib": "St Lucia",
            "firstName": "J",
            "lastName": "Researcher",
            "name": "J Researcher",
            "mail": "j.Researcher@uq.edu.au",
            "barcode": "240675201000000",
            "groups": ["CN=Sci Faculty"],
            "classes": [],
            "expiryDate": "31-12-19",
            "hasSession": true,
            "tokenBased": false,
            "canMasquerade": false,
            "blocked": false
        },
        author: {
            "aut_id": 410,
            "aut_org_username": "uqresearcher",
            "aut_org_staff_id": "0000111",
            "aut_org_student_id": null,
            "aut_email": null,
            "aut_display_name": "J Researcher",
            "aut_fname": "J",
            "aut_mname": null,
            "aut_lname": "Researcher",
            "aut_title": "Professor",
            "aut_position": null,
            "aut_homepage_link": null,
            "aut_created_date": "2007-08-09",
            "aut_update_date": null,
            "aut_external_id": "0001098586",
            "aut_ref_num": null,
            "aut_researcher_id": null,
            "aut_scopus_id": null,
            "aut_mypub_url": null,
            "aut_rid_password": null,
            "aut_people_australia_id": null,
            "aut_description": null,
            "aut_orcid_id": "0000-0001-1111-1111",
            "aut_google_scholar_id": "kUemDfMAAAAJ",
            "aut_rid_last_updated": null,
            "aut_publons_id": null,
            "aut_student_username": null
        },
        authorDetails: {
            "uqr_id": 14,
            "espace_id": 20288,
            "image_exists": 1,
            "username": "uqresearcher",
            "staff_id": "0000111",
            "given_name": "J",
            "family_name": "Researcher",
            "title": "Professor",
            "scopus_id": "",
            "google_scholar_id": "kUemDfMAAAAJ",
            "researcher_id": "G-111-1111",
            "orcid_id": "0000-0001-1111-1111",
            "publons_id": "",
            "mypub_url": "uqresearcher",
            "org_units": ["Institute for Molecular Bioscience", "Institute for Molecular Bioscience", "School of Chemistry and Molecular Biosciences", "The University of Queensland Diamantina Institute"],
            "positions": ["Affiliate Professor", "Casual Affiliate Professor", "Affiliate Professorial Res Fellow", "ARC Australian Laureate Fellow"],
            "espace": {"first_year":1975,"last_year":2018,"doc_count":357}
        },
        accountLoading: false,
        accountAuthorLoading: false,
        accountAuthorDetailsLoading: false,
        isSessionExpired: null,
        accountAuthorSaving: false,
        accountAuthorError: null
    }
});

describe('AddMissingRecord form', () => {
    afterEach(cleanup);
    describe('BookForm:Textbook', () => {
        it('should validate the form and show validation error message correctly for authors/editors field combination', async () => {
            const route = '/records/add/new';
            const {container, asFragment, getByText, getByTestId} = rtlRender(withRedux(initialState)(withRouter({route})(<AddMissingRecord addRecordStep={NewRecord} />)));

            let fragment = asFragment();

            fireEvent.click(getByTestId('rek-display-type'));
            waitForElement(() => getByTestId('menu-rek_display_type'));
            fireEvent.click(getByText(/book/i));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            fireEvent.click(getByTestId('rek-subtype'));
            waitForElement(() => getByTestId('menu-rek_subtype'));
            fireEvent.click(getByText(/textbook/i));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            expect(getByTestId('submit-work')).toHaveAttribute('disabled');

            fireEvent.change(getByTestId('rek-title'), {target: {value: 'book title'}});
            fireEvent.change(getByTestId('rek-place-of-publication'), {target: {value: 'test place of publication'}});
            fireEvent.change(getByTestId('rek-publisher'), {target: {value: 'test publisher'}});
            fireEvent.change(getByTestId('year'), {target: {value: '2018'}});
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            fireEvent.change(getByTestId('editors-name-as-published-field'), {target: {value: 'test'}});
            fireEvent.click(getByText(/add editor/i));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

            expect(getByTestId('submit-work')).not.toHaveAttribute('disabled');

            fireEvent.click(getByTestId('delete-editor-0'));
            fireEvent.click(getByText(/yes/i));
            expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
            expect(getByTestId('submit-work')).toHaveAttribute('disabled');
        });
    });
});
