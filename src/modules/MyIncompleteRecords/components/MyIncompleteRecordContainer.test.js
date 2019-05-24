import MyIncompleteRecordContainer from './MyIncompleteRecordContainer';
import { UQ352045 } from 'mock/data/records';

function setup(testProps, isShallow = true) {
    const props = {
        recordToFix: null,
        author: {aut_id: 410},
        account: {canMasquerade: false},
        accountAuthorLoading: false,
        loadingRecordToFix: false,
        disableInitialGrants: true,
        match: {
            params: {
                pid: 'UQ:111111'
            }
        },
        actions: {},
        ...testProps,
    };
    return getElement(MyIncompleteRecordContainer, props, isShallow);
}

describe('MyIncompleteRecord Container', () => {
    it('should display loading screen on record loading', () => {
        const wrapper = setup({
            loadingRecordToFix: true
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display loading screen on author loading', () => {
        const wrapper = setup({
            accountAuthorLoading: true
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should run componentDidMount() life cycle method to load record to fix', () => {
        const loadRecordToFix = jest.fn();
        const wrapper = setup({
            actions: {
                loadRecordToFix
            },
            match: {
                params: {
                    pid: 'UQ:123456'
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(loadRecordToFix).toHaveBeenCalledTimes(1);
        expect(loadRecordToFix).toHaveBeenCalledWith('UQ:123456');
    });

    it('should display form once record and author loaded', () => {
        const wrapper = setup({});

        const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        const getInitialValues = jest.spyOn(wrapper.instance(), 'getInitialValues');
        const getNtroFieldFlags = jest.spyOn(wrapper.instance(), 'getNtroFieldFlags');

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            recordToFix: {
                ...UQ352045,
                fez_record_search_key_author_affiliation_name: [{
                    rek_author_affiliation_name: '',
                    rek_author_affiliation_name_order: 1,
                }, {
                    rek_author_affiliation_name: 'The University of Queensland',
                    rek_author_affiliation_name_order: 2,
                }, {
                    rek_author_affiliation_name: '',
                    rek_author_affiliation_name_order: 3,
                }, {
                    rek_author_affiliation_name: 'National Library',
                    rek_author_affiliation_name_order: 4,
                }],
                fez_record_search_key_author_affiliation_type: [{
                    rek_author_affiliation_type: 0,
                    rek_author_affiliation_type_order: 1
                }, {
                    rek_author_affiliation_type: 453989,
                    rek_author_affiliation_type_order: 2
                }, {
                    rek_author_affiliation_type: 0,
                    rek_author_affiliation_type_order: 3
                }, {
                    rek_author_affiliation_type: 453983,
                    rek_author_affiliation_type_order: 4
                }],
                fez_record_search_key_grant_agency: [{
                    rek_grant_agency: 'Test 1',
                    rek_grant_agency_order: 1
                }, {
                    rek_grant_agency: 'Test 2',
                    rek_grant_agency_order: 2
                }],
                fez_record_search_key_grant_id: [{
                    rek_grant_id: '11111',
                    rek_grant_id_order: 1
                }],
                fez_record_search_key_grant_agency_type: [{
                    rek_grant_agency_type: '453983',
                    rek_grant_agency_type_order: 1
                }]
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(componentWillReceiveProps).toHaveBeenCalledTimes(1);
        expect(getInitialValues).toHaveBeenCalledTimes(1);
        expect(getNtroFieldFlags).toHaveBeenCalledTimes(1);

        expect(wrapper.state().isNtro).toBeTruthy();
        expect(wrapper.state().ntroFieldProps).toEqual({
            hideAbstract: true,
            hideAudienceSize: false,
            hideExtent: true,
            hideLanguage: true,
            hidePeerReviewActivity: false,
            showContributionStatement: true,
            showSignificance: true
        });
        expect(wrapper.state().isAuthorLinked).toBeFalsy();
        expect(wrapper.state().hasAnyFiles).toBeTruthy();
        expect(wrapper.state().initialValues).toEqual({
            grants: [{
                grantAgencyName: 'Test 1',
                grantAgencyType: '453983',
                grantId: '11111',
                disabled: true
            }, {
                grantAgencyName: 'Test 2',
                grantAgencyType: '454045',
                grantId: '',
                disabled: true
            }],
            authorsAffiliation: [{
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": 0,
                "nameAsPublished": "Topology",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "0",
            }, {
                "affiliation": "UQ",
                "creatorRole": "",
                "disabled": true,
                "nameAsPublished": "Davidson, Robert",
                "orgaff": "The University of Queensland",
                "orgtype": "453989",
                "required": false,
                "uqIdentifier": "79324",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": true,
                "nameAsPublished": "Babbage, John",
                "orgaff": "",
                "orgtype": "",
                "required": false,
                "uqIdentifier": "78691",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": 0,
                "nameAsPublished": "The Brodsky Quartet",
                "orgaff": "National Library",
                "orgtype": "453983",
                "required": false,
                "uqIdentifier": "0",
            }],
            initialContributionStatements: [],
            initialSignificance: [],
            languages: ['eng']
        });
    });

    it('should load all contribution statements and significance for linked admin author', () => {
        const wrapper = setup({
            author: {
                aut_id: 79324
            },
            account: {
                canMasquerade: true
            }
        });

        const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        const getInitialValues = jest.spyOn(wrapper.instance(), 'getInitialValues');
        const getNtroFieldFlags = jest.spyOn(wrapper.instance(), 'getNtroFieldFlags');

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({
            recordToFix: {
                ...UQ352045,
                fez_record_search_key_creator_contribution_statement: [{
                    rek_creator_contribution_statement: 'Test statement',
                    rek_creator_contribution_statement_order: 1,
                }, {
                    rek_creator_contribution_statement: 'Missing',
                    rek_creator_contribution_statement_order: 2,
                }, {
                    rek_creator_contribution_statement: '',
                    rek_creator_contribution_statement_order: 3,
                }, {
                    rek_creator_contribution_statement: 'Missing',
                    rek_creator_contribution_statement_order: 4,
                }],
                fez_record_search_key_significance: [{
                    rek_significance: 454026,
                    rek_significance_order: 1
                }, {
                    rek_significance: 0,
                    rek_significance_order: 2
                }, {
                    rek_significance: 0,
                    rek_significance_order: 3
                }, {
                    rek_significance: 0,
                    rek_significance_order: 4
                }]
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(componentWillReceiveProps).toHaveBeenCalledTimes(1);
        expect(getInitialValues).toHaveBeenCalledTimes(1);
        expect(getNtroFieldFlags).toHaveBeenCalledTimes(1);

        expect(wrapper.state().isNtro).toBeTruthy();
        expect(wrapper.state().ntroFieldProps).toEqual({
            hideAbstract: true,
            hideAudienceSize: false,
            hideExtent: true,
            hideLanguage: true,
            hidePeerReviewActivity: false,
            showContributionStatement: true,
            showSignificance: true
        });
        expect(wrapper.state().isAuthorLinked).toBeTruthy();
        expect(wrapper.state().hasAnyFiles).toBeTruthy();
        expect(wrapper.state().initialValues).toEqual({
            grants: [],
            authorsAffiliation: [{
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": 0,
                "nameAsPublished": "Topology",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "0",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": false,
                "nameAsPublished": "Davidson, Robert",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "79324",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": true,
                "nameAsPublished": "Babbage, John",
                "orgaff": "",
                "orgtype": "",
                "required": false,
                "uqIdentifier": "78691",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": 0,
                "nameAsPublished": "The Brodsky Quartet",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "0",
            }],
            initialContributionStatements: [{
                rek_creator_contribution_statement: 'Test statement',
                rek_creator_contribution_statement_order: 1,
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 2,
            }, {
                rek_creator_contribution_statement: '',
                rek_creator_contribution_statement_order: 3,
            }, {
                rek_creator_contribution_statement: 'Missing',
                rek_creator_contribution_statement_order: 4,
            }],
            initialSignificance: [{
                rek_significance: 454026,
                rek_significance_order: 1
            }, {
                rek_significance: 0,
                rek_significance_order: 2
            }, {
                rek_significance: 0,
                rek_significance_order: 3
            }, {
                rek_significance: 0,
                rek_significance_order: 4
            }],
            languages: ['eng']
        });
    });

    it('should load initial values for admin author and if search key is not there then it should get default', () => {
        const wrapper = setup({
            author: {
                aut_id: 79324
            },
            account: {
                canMasquerade: true
            }
        });

        const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        const getInitialValues = jest.spyOn(wrapper.instance(), 'getInitialValues');
        const getNtroFieldFlags = jest.spyOn(wrapper.instance(), 'getNtroFieldFlags');

        expect(toJson(wrapper)).toMatchSnapshot();

        const {
            rek_formatted_abstract,
            fez_record_search_key_language,
            fez_record_search_key_total_pages,
            fez_record_search_key_significance,
            fez_record_search_key_creator_contribution_statement,
            ...restOfTheRecord
        } = UQ352045;

        wrapper.setProps({
            recordToFix: {
                ...restOfTheRecord,
                fez_datastream_info: [{
                    dsi_dsid: 'Testing.pdf',
                    dsi_label: 'Hello there',
                    dsi_state: 'A'
                }]
            }
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(componentWillReceiveProps).toHaveBeenCalledTimes(1);
        expect(getInitialValues).toHaveBeenCalledTimes(1);
        expect(getNtroFieldFlags).toHaveBeenCalledTimes(1);

        expect(wrapper.state().isNtro).toBeTruthy();
        expect(wrapper.state().ntroFieldProps).toEqual({
            hideAbstract: false,
            hideAudienceSize: false,
            hideExtent: false,
            hideLanguage: false,
            hidePeerReviewActivity: false,
            showContributionStatement: true,
            showSignificance: true
        });
        expect(wrapper.state().isAuthorLinked).toBeTruthy();
        expect(wrapper.state().hasAnyFiles).toBeTruthy();
        expect(wrapper.state().initialValues).toEqual({
            grants: [],
            authorsAffiliation: [{
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": 0,
                "nameAsPublished": "Topology",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "0",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": false,
                "nameAsPublished": "Davidson, Robert",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "79324",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": true,
                "nameAsPublished": "Babbage, John",
                "orgaff": "",
                "orgtype": "",
                "required": false,
                "uqIdentifier": "78691",
            }, {
                "affiliation": "NotUQ",
                "creatorRole": "",
                "disabled": 0,
                "nameAsPublished": "The Brodsky Quartet",
                "orgaff": "",
                "orgtype": "",
                "required": true,
                "uqIdentifier": "0",
            }],
            initialContributionStatements: [],
            initialSignificance: [],
            languages: ['eng']
        });
    });

    it('should unmount and clear fix record reducer', () => {
        const clearFixRecord = jest.fn();
        const wrapper = setup({
            actions: {
                clearFixRecord
            }
        });
        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.unmount();

        expect(componentWillUnmount).toHaveBeenCalled();
        expect(clearFixRecord).toHaveBeenCalled();
    });

    it('isFileValid()', () => {
        const wrapper = setup({});

        expect(wrapper.instance().isFileValid({
            "dsi_pid": "UQ:719129",
            "dsi_dsid": "FezACML_stradbroke_review_1.pdf.xml",
            "dsi_label": "FezACML security for datastream - stradbroke_review_1.pdf",
            "dsi_state": "A",
        })).toBeFalsy();

        expect(wrapper.instance().isFileValid({
            "dsi_pid": "UQ:719129",
            "dsi_dsid": "review_1.pdf.xml",
            "dsi_label": null,
            "dsi_state": "A",
        })).toBeTruthy();

        expect(wrapper.instance().isFileValid({
            "dsi_pid": "UQ:719129",
            "dsi_dsid": "review_1.pdf.xml",
            "dsi_label": 'not publicly available',
            "dsi_state": "A",
        })).toBeTruthy();

        expect(wrapper.instance().isFileValid({
            "dsi_pid": "UQ:719129",
            "dsi_dsid": "review_1.pdf.xml",
            "dsi_label": 'corrected thesis',
            "dsi_state": "A",
        })).toBeFalsy();

        expect(wrapper.instance().isFileValid({
            "dsi_pid": "UQ:719129",
            "dsi_dsid": "review_1.pdf.xml",
            "dsi_label": 'ERA',
            "dsi_state": "A",
        })).toBeTruthy();

        expect(wrapper.instance().isFileValid({
            "dsi_pid": "UQ:719129",
            "dsi_dsid": "thumbnail_review_1.pdf.xml",
            "dsi_label": 'ERA',
            "dsi_state": "A",
        })).toBeFalsy();
    });
});

describe('Cards', () => {
    const baseRecordTest = {
        "rek_pid": "UQ:41878",
        "rek_title": "Article Title",
        "rek_genre": "",
        "rek_display_type": null,
        "rek_display_type_lookup": "",
        "rek_subtype": "",
        "rek_status": 2,
        "rek_date": "2004-01-01T00:00:00Z",
        "rek_object_type": 3,
        "rek_citation": "blah blah blah",
        "fez_record_search_key_author": [
            {
                "rek_author_id": 30038090,
                "rek_author_pid": "UQ:41878",
                "rek_author": "Brown, M. A.",
                "rek_author_order": 2
            },
            {
                "rek_author_id": 30038089,
                "rek_author_pid": "UQ:41878",
                "rek_author": "He, Y.",
                "rek_author_order": 1
            },
            {
                "rek_author_id": 30038091,
                "rek_author_pid": "UQ:41878",
                "rek_author": "Rothnagel, J. A.",
                "rek_author_order": 3
            },
            {
                "rek_author_id": 30038092,
                "rek_author_pid": "UQ:41878",
                "rek_author": "Saunders, N. A.",
                "rek_author_order": 4
            },
            {
                "rek_author_id": 30038093,
                "rek_author_pid": "UQ:41878",
                "rek_author": "Smith, R.",
                "rek_author_order": 5
            }
        ],
        "fez_record_search_key_author_id": [
            {
                "rek_author_id_id": 29384218,
                "rek_author_id_pid": "UQ:41878",
                "rek_author_id": 0,
                "rek_author_id_order": 1
            },
            {
                "rek_author_id_id": 29384219,
                "rek_author_id_pid": "UQ:41878",
                "rek_author_id": 410,
                "rek_author_id_order": 2
            },
            {
                "rek_author_id_id": 29384220,
                "rek_author_id_pid": "UQ:41878",
                "rek_author_id": 786,
                "rek_author_id_order": 3
            },
            {
                "rek_author_id_id": 29384221,
                "rek_author_id_pid": "UQ:41878",
                "rek_author_id": 687,
                "rek_author_id_order": 4
            },
            {
                "rek_author_id_id": 29384222,
                "rek_author_id_pid": "UQ:41878",
                "rek_author_id": 4100,
                "rek_author_id_order": 5
            }
        ],
        "fez_record_search_key_end_page": {
            "rek_end_page_id": 5708077,
            "rek_end_page_pid": "UQ:41878",
            "rek_end_page": "253A"
        },
        "fez_record_search_key_issue_number": null,
        // "fez_record_search_key_job_number": null,
        "fez_record_search_key_journal_name": {
            "rek_journal_name_id": 5236446,
            "rek_journal_name_pid": "UQ:41878",
            "rek_journal_name": "Molecular Biology of The Cell"
        },
        "fez_record_search_key_place_of_publication": {
            "rek_place_of_publication_id": 4343575,
            "rek_place_of_publication_pid": "UQ:41878",
            "rek_place_of_publication": "Bethesda"
        },
        "fez_record_search_key_publisher": {
            "rek_publisher_id": 4629173,
            "rek_publisher_pid": "UQ:41878",
            "rek_publisher": "American Society for Cell Biology"
        },
        "fez_record_search_key_start_page": {
            "rek_start_page_id": 5781267,
            "rek_start_page_pid": "UQ:41878",
            "rek_start_page": "252A"
        },
        "fez_record_search_key_total_chapters": null,
        "fez_record_search_key_volume_number": {
            "rek_volume_number_id": 5294487,
            "rek_volume_number_pid": "UQ:41878",
            "rek_volume_number": "15"
        },
        "fez_record_search_key_grant_agency": [],
        "fez_record_search_key_grant_id": [],
        "fez_record_search_key_grant_agency_type": [],
        "fez_datastream_info": []
    };

    it('will display correct empty fields for an Architectural Design work', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Design",
            "rek_display_type": 316,
            "rek_display_type_lookup": "Design",
            "rek_subtype": "Creative Work - Design/Architectural",
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_language": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": true,
            "hideExtent": false,
            "hideLanguage": false,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });

    it('will display correct empty fields for a Textual Book work', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Book",
            "rek_display_type": 174,
            "rek_display_type_lookup": "Book",
            "rek_subtype": "Creative Work - Textual",
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_language": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": true,
            "hideExtent": false,
            "hideLanguage": false,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });

    it('will display correct empty fields for a Textual Book work with lang supplied', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Book",
            "rek_display_type": 174,
            "rek_display_type_lookup": "Book",
            "rek_subtype": "Creative Work - Textual",
            "fez_record_search_key_language": [
                {
                    "rek_language_id": 5459649,
                    "rek_language_pid": "UQ:41878",
                    "rek_language": "chi",
                    "rek_language_order": 1
                }
            ],
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": true,
            "hideExtent": false,
            "hideLanguage": true,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });

    it('will display correct empty fields for a Musical Creative work', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Creative",
            "rek_display_type": 313,
            "rek_display_type_lookup": "Creative Work",
            "rek_subtype": "Creative Work - Musical Composition",
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_language": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": true,
            "hideExtent": false,
            "hideLanguage": false,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });

    });

    it('will display correct empty fields for a Website Creative work', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Creative",
            "rek_display_type": 313,
            "rek_display_type_lookup": "Creative Work",
            "rek_subtype": "Recorded or Rendered Creative Work - Web Exhibition",
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_language": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": true,
            "hideExtent": false,
            "hideLanguage": false,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });

    it('will display correct empty fields for a Public Sector Research Report work', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Research Report",
            "rek_display_type": 275,
            "rek_display_type_lookup": "Research Report",
            "rek_subtype": "Research Report for an External Body - Public Sector",
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_language": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": true,
            "hideExtent": false,
            "hideLanguage": false,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });

    it('will display correct empty fields for a Live Performance of Musical Creative Work work', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Creative",
            "rek_display_type": 313,
            "rek_display_type_lookup": "Creative Work",
            "rek_subtype": "Live Performance of Creative Work - Music",
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_language": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": false,
            "hideExtent": false,
            "hideLanguage": false,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });

    it('will display correct empty fields for a Exhibition Creative Work work', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Creative",
            "rek_display_type": 313,
            "rek_display_type_lookup": "Creative Work",
            "rek_subtype": "Curated or Produced Exhibition or Event - Exhibition or Event",
            "rek_formatted_abstract": null,
            "fez_record_search_key_audience_size": null,
            "fez_record_search_key_creator_contribution_statement": null,
            "fez_record_search_key_language": null,
            "fez_record_search_key_quality_indicator": null,
            "fez_record_search_key_significance": null,
            "fez_record_search_key_total_pages": null,
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": false,
            "hideAudienceSize": false,
            "hideExtent": false,
            "hideLanguage": false,
            "hidePeerReviewActivity": false,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });

    // of course, the card should never be called like this...
    it('will display empty where nothing is incomplete', () => {
        const wrapper = setup({});
        const testRecord = {
            ...baseRecordTest,
            "rek_genre": "Creative",
            "rek_display_type": 313,
            "rek_display_type_lookup": "Creative Work",
            "rek_subtype": "Curated or Produced Exhibition or Event - Exhibition or Event",
            "rek_formatted_abstract": "<p>abstract</p>",
            "fez_record_search_key_audience_size": {
                "rek_audience_size_pid": "UQ:ec5ce03",
                "rek_audience_size": 1,
                "rek_audience_size_id": 453993,
            },
            "fez_record_search_key_creator_contribution_statement": [
                {
                    "rek_creator_contribution_statement_id": 293,
                    "rek_creator_contribution_statement_pid": "UQ:ec5ce03",
                    "rek_creator_contribution_statement": "<p>It was significant.</p>",
                    "rek_creator_contribution_statement_order": 1
                },
                {
                    "rek_creator_contribution_statement_id": 294,
                    "rek_creator_contribution_statement_pid": "UQ:ec5ce03",
                    "rek_creator_contribution_statement": "Missing",
                    "rek_creator_contribution_statement_order": 2
                }
            ],
            "fez_record_search_key_language": [
                {
                    "rek_language_id": 5459649,
                    "rek_language_pid": "UQ:41878",
                    "rek_language": "chi",
                    "rek_language_order": 1
                }
            ],
            "fez_record_search_key_quality_indicator": [
                {
                    "rek_quality_indicator_id": 282,
                    "rek_quality_indicator_pid": "UQ:ec5ce03",
                    "rek_quality_indicator": 453996,
                    "rek_quality_indicator_order": 1,
                    "rek_quality_indicator_lookup": "Reviews, prizes, awards recognition of the output"
                },
                {
                    "rek_quality_indicator_id": 283,
                    "rek_quality_indicator_pid": "UQ:ec5ce03",
                    "rek_quality_indicator": 453997,
                    "rek_quality_indicator_order": 2,
                    "rek_quality_indicator_lookup": "Association with recognised international entities, distinct from co-creation"
                }
            ],
            "fez_record_search_key_significance": [
                {
                    "rek_significance_id": 214,
                    "rek_significance_pid": "UQ:ec5ce03",
                    "rek_significance": 454026,
                    "rek_significance_order": 1,
                    "rek_significance_lookup": "Major"
                },
                {
                    "rek_significance_id": 215,
                    "rek_significance_pid": "UQ:ec5ce03",
                    "rek_significance": 0,
                    "rek_significance_order": 2
                }
            ],
            "fez_record_search_key_total_pages": {
                "rek_total_pages_id": 5782362,
                "rek_total_pages_pid": "UQ:ec5ce03",
                "rek_total_pages_xsdmf_id": null,
                "rek_total_pages": "10"
            },
        };
        wrapper.setProps({recordToFix: testRecord});
        expect(wrapper.state().ntroFieldProps).toEqual({
            "hideAbstract": true,
            "hideAudienceSize": true,
            "hideExtent": true,
            "hideLanguage": true,
            "hidePeerReviewActivity": true,
            "showContributionStatement": true,
            "showSignificance": true,
        });
    });
});