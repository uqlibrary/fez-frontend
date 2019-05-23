/* eslint-disable */
import React from 'react';
import * as repositories from 'repositories';
import ThesisSubmission from './containers/ThesisSubmission';
import { rtlRender, fireEvent, waitForElement, cleanup, withRedux, withRouter } from 'test-utils';
import { searchKeyList } from 'mock/data';
import 'ckeditor';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    accountReducer: {
        account: {
        id: 's2222222',
        'class': [
            'IS_UQ_STUDENT_PLACEMENT',
            'IS_CURRENT'
        ],
        type: 22,
        homeLib: 'St Lucia',
        firstName: 'J',
        lastName: 'RHD Student',
        name: 'J RHD Student',
        mail: 'rhd@student.uq.edu.au',
        barcode: '111111111111111',
        groups: null,
        classes: [],
        expiryDate: '14-12-19',
        hasSession: true,
        tokenBased: false,
        canMasquerade: false,
        blocked: false
        },
        author: {
        aut_id: 44444,
        aut_org_username: null,
        aut_org_staff_id: null,
        aut_org_student_id: '2222222',
        aut_email: null,
        aut_display_name: 'HDR Student, N',
        aut_fname: 'N',
        aut_mname: null,
        aut_lname: 'HDR Student',
        aut_title: 'Miss',
        aut_position: null,
        aut_homepage_link: null,
        aut_created_date: '2017-11-03T01:00:24Z',
        aut_update_date: '2017-12-21T07:31:09Z',
        aut_external_id: null,
        aut_ref_num: null,
        aut_researcher_id: null,
        aut_scopus_id: null,
        aut_mypub_url: null,
        aut_rid_password: null,
        aut_people_australia_id: null,
        aut_description: null,
        aut_orcid_id: null,
        aut_google_scholar_id: null,
        aut_rid_last_updated: null,
        aut_publons_id: null,
        aut_student_username: 's2222222'
        },
        authorDetails: {
        espace_id: 44444,
        staff_id: null,
        given_name: 'N',
        family_name: 'HDR Student',
        title: 'Miss',
        scopus_id: null,
        google_scholar_id: null,
        researcher_id: null,
        orcid_id: null,
        publons_id: null,
        mypub_url: null,
        username: 's2222222',
        org_units: [
            ''
        ],
        positions: [
            ''
        ],
        uqr_id: null,
        image_exists: null,
        espace: {
            first_year: null,
            last_year: null,
            doc_count: 0
        }
        },
        accountLoading: false,
        accountAuthorLoading: false,
        accountAuthorDetailsLoading: false,
        isSessionExpired: null,
        accountAuthorSaving: false,
        accountAuthorError: null
    },
    form: Immutable.Map({
        ThesisSubmission: {
            values: {
                thesisTitle: {
                    htmlText: '<p>test title</p>',
                    plainText: 'test title'
                },
                thesisAbstract: {
                    htmlText: '<p>test abstract</p>',
                    plainText: 'test abstract'
                },
                files: {    // add files here just to pass validation rule 'fileUploadRequired'
                    queue: [{
                        name: 'test.txt'
                    }],
                    isValid: true
                }
            }
        }
    })
});

describe('ThesisSubmission form', () => {
    afterEach(() => cleanup);

    it('should allow user to submit thesis', async () => {
        const testId = 451780;
        const returnedApiData = {
            "total": 2,
            "data": [
                {
                    "cvr_id": 2931,
                    "cvr_parent_cvo_id": 451780,
                    "cvr_child_cvo_id": 451799,
                    "controlled_vocab": {
                        "cvo_id": 451799,
                        "cvo_title": "01 Mathematical Sciences",
                        "cvo_desc": "",
                        "cvo_image_filename": null,
                        "cvo_external_id": "01",
                        "cvo_hide": 0,
                        "cvo_order": null,
                        "cvo_lat": null,
                        "cvo_long": null,
                        "cvo_policy": null,
                        "controlled_vocab_children": [
                            {
                                "cvr_id": 2932,
                                "cvr_parent_cvo_id": 451799,
                                "cvr_child_cvo_id": 451800,
                                "controlled_vocab": {
                                    "cvo_id": 451800,
                                    "cvo_title": "0101 Pure Mathematics",
                                    "cvo_desc": "",
                                    "cvo_image_filename": null,
                                    "cvo_external_id": "0101",
                                    "cvo_hide": 0,
                                    "cvo_order": null,
                                    "cvo_lat": null,
                                    "cvo_long": null,
                                    "cvo_policy": null,
                                    "controlled_vocab_children": [
                                        {
                                            "cvr_id": 2933,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451801,
                                            "controlled_vocab": {
                                                "cvo_id": 451801,
                                                "cvo_title": "010101 Algebra and Number Theory",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010101",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2934,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451802,
                                            "controlled_vocab": {
                                                "cvo_id": 451802,
                                                "cvo_title": "010102 Algebraic and Differential Geometry",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010102",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2935,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451803,
                                            "controlled_vocab": {
                                                "cvo_id": 451803,
                                                "cvo_title": "010103 Category Theory, K Theory, Homological Algebra",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010103",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2936,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451804,
                                            "controlled_vocab": {
                                                "cvo_id": 451804,
                                                "cvo_title": "010104 Combinatorics and Discrete Mathematics (excl. Physical Combinatorics)",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010104",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2937,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451805,
                                            "controlled_vocab": {
                                                "cvo_id": 451805,
                                                "cvo_title": "010105 Group Theory and Generalisations",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010105",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2938,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451806,
                                            "controlled_vocab": {
                                                "cvo_id": 451806,
                                                "cvo_title": "010106 Lie Groups, Harmonic and Fourier Analysis",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010106",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2939,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451807,
                                            "controlled_vocab": {
                                                "cvo_id": 451807,
                                                "cvo_title": "010107 Mathematical Logic, Set Theory, Lattices and Universal Algebra",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010107",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2940,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451808,
                                            "controlled_vocab": {
                                                "cvo_id": 451808,
                                                "cvo_title": "010108 Operator Algebras and Functional Analysis",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010108",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2941,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451809,
                                            "controlled_vocab": {
                                                "cvo_id": 451809,
                                                "cvo_title": "010109 Ordinary Differential Equations, Difference Equations and Dynamical Systems",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010109",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2942,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451810,
                                            "controlled_vocab": {
                                                "cvo_id": 451810,
                                                "cvo_title": "010110 Partial Differential Equations",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010110",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2943,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451811,
                                            "controlled_vocab": {
                                                "cvo_id": 451811,
                                                "cvo_title": "010111 Real and Complex Functions (incl. Several Variables)",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010111",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2944,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451812,
                                            "controlled_vocab": {
                                                "cvo_id": 451812,
                                                "cvo_title": "010112 Topology",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010112",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        },
                                        {
                                            "cvr_id": 2945,
                                            "cvr_parent_cvo_id": 451800,
                                            "cvr_child_cvo_id": 451813,
                                            "controlled_vocab": {
                                                "cvo_id": 451813,
                                                "cvo_title": "010199 Pure Mathematics not elsewhere classified",
                                                "cvo_desc": "",
                                                "cvo_image_filename": null,
                                                "cvo_external_id": "010199",
                                                "cvo_hide": 0,
                                                "cvo_order": null,
                                                "cvo_lat": null,
                                                "cvo_long": null,
                                                "cvo_policy": null,
                                                "controlled_vocab_children": []
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        };

        mockApi
            .onGet(repositories.routes.SEARCH_AUTHOR_LOOKUP_API({searchQuery: 'test', searchKey: 'author'}).apiUrl)
            .reply(200, searchKeyList.author)
            .onGet(repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'sch', searchKey: 'org_unit_name'}).apiUrl,
                repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'sch', searchKey: 'org_unit_name'}).options)
            .reply(200, {data: [
                {"value": "School of Engineering"},
                {"value": "School of Psychology"},
                {"value": "School of Economics"},
            ]})
            .onGet(repositories.routes.VOCABULARIES_API({id: testId}).apiUrl)
            .reply(200, returnedApiData);

        const route = '/rhdsubmission';
        const {container, asFragment, getByText, getByTestId} = rtlRender(withRedux(initialState)(withRouter({route})(<ThesisSubmission />)));
        const firstRender = asFragment();

        const submitButton = getByTestId('submit-thesis');
        expect(submitButton).toHaveAttribute('disabled');

        fireEvent.click(getByTestId('thesis-subtype'));
        fireEvent.click(getByText(/phd thesis/i));

        fireEvent.change(getByTestId('downshift-0-input'), {target: {value: 'sch'}});
        const enrollingUnitList = await waitForElement(() => getByTestId('downshift-0-menu'), {container});
        fireEvent.click(getByTestId('downshift-0-item-0', enrollingUnitList));

        fireEvent.change(getByTestId('supervisors-name-as-published-field'), {target: {value: 'test'}});
        fireEvent.click(getByText(/add supervisor/i));

        fireEvent.change(getByTestId('downshift-1-input'), {target: {value: 'math'}});
        const fieldOfResearchList = await waitForElement(() => getByTestId('downshift-1-menu'), {container});
        fireEvent.click(getByTestId('downshift-1-item-0', fieldOfResearchList));

        fireEvent.change(getByTestId('keywords-input'), {target: {value: 'test1,test2'}})
        fireEvent.click(getByTestId('add-items'));

        expect(submitButton).not.toHaveAttribute('disabled');
        expect(firstRender).toMatchDiffSnapshot(asFragment());
    });
});
