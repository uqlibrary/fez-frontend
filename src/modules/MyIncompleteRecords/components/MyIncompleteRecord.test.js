import { MyIncompleteRecordClass, styles }from './MyIncompleteRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
import Immutable from 'immutable';
import { routes } from 'config';

function setup(testProps, isShallow = true) {
    const props = {
        array: {
            insert: jest.fn(),
            move: jest.fn(),
            pop: jest.fn(),
            push: jest.fn(),
            remove: jest.fn(),
            removeAll: jest.fn(),
            shift: jest.fn(),
            splice: jest.fn(),
            swap: jest.fn(),
            unshift: jest.fn(),
        },
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        submitFailed: false,
        valid: true,
        pure: true,
        pristine: true,
        submitting: false,
        invalid: false,
        submitSucceeded: false,
        recordToFix: testProps.recordToFix,
        loadingRecordToFix: testProps.loadingRecordToFix || false,

        accountAuthorLoading: testProps.accountAuthorLoading || false,
        author: testProps.author || {aut_id: 410},

        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues: testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(testProps.recordToFix || mockRecordToFix),
                author: Immutable.Map(testProps.author || {aut_id: 410})
            }),
        actions: testProps.actions || {},
        history: testProps.history || {go: jest.fn(), push: jest.fn()},
        match: testProps.match || {},
        classes: {},

        publicationToFixFileUploadingError: testProps.publicationToFixFileUploadingError || false,
        ...testProps,
    };
    return getElement(MyIncompleteRecordClass, props, isShallow);
}

describe('Component MyIncompleteRecord', () => {

    it('should render loader when author is loading', () => {
        const wrapper = setup({recordToFix: mockRecordToFix, accountAuthorLoading: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loader when record is loading', () => {
        const wrapper = setup({recordToFix: mockRecordToFix, loadingRecordToFix: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect if author not linked', () => {
        const testMethod = jest.fn();
        const wrapper = setup({author: {aut_id: 1001}, recordToFix: mockRecordToFix, history: {push: testMethod}});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        expect(toJson(wrapper)).toMatchSnapshot();

        // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
    });

    it('should set local variables', () => {
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.setState({selectedRecordAction: 'unclaim'});
        wrapper.instance()._setSuccessConfirmation('successBox');
        expect(wrapper.instance().successConfirmationBox).toEqual('successBox');
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();
        const wrapper = setup({recordToFix: mockRecordToFix, history: {push: testMethod}});
        wrapper.instance()._cancelFix();
        expect(testMethod).toHaveBeenCalledWith('/records/incomplete');
    });

    it('should clear record to fix when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({recordToFix: mockRecordToFix, actions: {clearFixRecord: actionFunction}});
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({
            loadingRecordToFix: false,
            recordToFix: null,
            actions: {
                loadRecordToFix: actionFunction
            },
            match: {
                params: {
                    pid: 'UQ:1001'
                }
            }
        });
        wrapper.update;
        wrapper.instance().componentDidMount();
        expect(actionFunction).toHaveBeenCalledWith('UQ:1001');
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup({recordToFix: mockRecordToFix});
        wrapper.instance().successConfirmationBox = {showConfirmation: testMethod};
        wrapper.instance().componentWillReceiveProps({submitSucceeded: true});
        expect(testMethod).toHaveBeenCalled();
    });

    it('should render the confirm dialog box with an alert due to a file upload failure', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: true
        });
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render the confirm dialog box without an alert due to a file upload success', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        wrapper.setState({selectedRecordAction: 'fix'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        const testFN = jest.fn();
        const event = {preventDefault: testFN};
        wrapper.instance()._handleDefaultSubmit(event);
        expect(testFN).toHaveBeenCalled();
    });

    it('_handleDefaultSubmit()', () => {
        const wrapper = setup({
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        wrapper.instance()._handleDefaultSubmit();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should be able to navigate to specific routes', () => {
        const testFn = jest.fn();
        const wrapper = setup({ history: {
            push: testFn,
            go: jest.fn(),
        } });
        wrapper.instance()._navigateToMyIncomplete();
        expect(testFn).toBeCalledWith(routes.pathConfig.records.incomplete);

        wrapper.instance()._navigateToDashboard();
        expect(testFn).toBeCalledWith(routes.pathConfig.dashboard);
    });

    it('componentWillReceiveProps()', () => {
        const wrapper = setup({
            submitSucceeded: true,
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        const nextProps = {submitSucceeded: true};
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('componentWillUnmount()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            actions: {
                clearFixRecord: testFN
            },
            submitSucceeded: true,
            recordToFix: mockRecordToFix,
            publicationToFixFileUploadingError: false
        });
        wrapper.instance().componentWillUnmount();
        expect(testFN).toHaveBeenCalled();
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
    });

    it('should render no fields as they are complete', () => {
        const wrapper = setup({recordToFix: {
            ...mockRecordToFix,
                rek_display_type_lookup: 'Creative Work',
                rek_subtype: 'Creative Work - Design/Architectural',
                rek_author_id: 410,
                // Linked Authors
                fez_record_search_key_author_id: [
                    {},
                    {
                        rek_author_id: 410,
                        rek_author_id_order: 2
                    }
                ],
                // Abstract
                rek_formatted_abstract: 'test',
                rek_description: 'test',
                // Contribution Statement
                fez_record_search_key_creator_contribution_statement: [
                    {},
                    {rek_creator_contribution_statement: 'test'}
                ],
                // Extent
                fez_record_search_key_total_pages: {
                    rek_total_pages: 'test'
                },
                // Audience size
                fez_record_search_key_audience_size: {
                    rek_audience_size: 'test'
                },
                // Language
                fez_record_search_key_language: [
                    {rek_language: 'Test'}
                ],
                // Quality Indicator
                fez_record_search_key_quality_indicator: [
                    'Test'
                ],
                // Significance
                fez_record_search_key_significance: [
                    {},
                    {rek_significance: 'test'}
                ]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render langauge field', () => {
        const wrapper = setup({recordToFix: {
            ...mockRecordToFix,
                rek_display_type_lookup: 'Creative Work',
                rek_subtype: 'Creative Work - Design/Architectural',
                rek_author_id: 410,
                // Linked Authors
                fez_record_search_key_author_id: [
                    {},
                    {
                        rek_author_id: 410,
                        rek_author_id_order: 2
                    }
                ],
                // Abstract
                rek_formatted_abstract: 'test',
                rek_description: 'test',
                // Contribution Statement
                fez_record_search_key_creator_contribution_statement: [
                    {},
                    {rek_creator_contribution_statement: 'test'}
                ],
                // Extent
                fez_record_search_key_total_pages: {
                    rek_total_pages: 'test'
                },
                // Audience size
                fez_record_search_key_audience_size: {
                    rek_audience_size: 'test'
                },
                // Language
                fez_record_search_key_language: [],
                // Quality Indicator
                fez_record_search_key_quality_indicator: [
                    'Test'
                ],
                // Significance
                fez_record_search_key_significance: [
                    {},
                    {rek_significance: 'test'}
                ]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render file upload field', () => {
        const wrapper = setup({recordToFix: {
            ...mockRecordToFix,
                rek_display_type_lookup: 'Creative Work',
                rek_subtype: 'Creative Work - Design/Architectural',
                rek_author_id: 410,
                // Linked Authors
                fez_record_search_key_author_id: [
                    {},
                    {
                        rek_author_id: 410,
                        rek_author_id_order: 2
                    }
                ],
                // Abstract
                rek_formatted_abstract: 'test',
                rek_description: 'test',
                // Contribution Statement
                fez_record_search_key_creator_contribution_statement: [
                    {},
                    {rek_creator_contribution_statement: 'test'}
                ],
                // Extent
                fez_record_search_key_total_pages: {
                    rek_total_pages: 'test'
                },
                // Audience size
                fez_record_search_key_audience_size: {
                    rek_audience_size: 'test'
                },
                // Language
                fez_record_search_key_language: [],
                // Quality Indicator
                fez_record_search_key_quality_indicator: [
                    'Test'
                ],
                // Significance
                fez_record_search_key_significance: [
                    {},
                    {rek_significance: 'test'}
                ],
                // Files
                fez_datastream_info: [
                    {
                        dsi_dsid: '',
                        dsi_label: '',
                        dsi_state: ''
                    }
                ]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render significance and contribution statement fields', () => {
        const wrapper = setup({recordToFix: {
            ...mockRecordToFix,
                rek_display_type_lookup: 'Creative Work',
                rek_subtype: 'Creative Work - Other',
                rek_author_id: 410,
                // Linked Authors
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 1,
                        rek_author_id_order: 1},
                    {
                        rek_author_id: 410,
                        rek_author_id_order: 2
                    }
                ],
                // Abstract
                rek_formatted_abstract: 'test',
                rek_description: 'test',
                // Contribution Statement
                fez_record_search_key_creator_contribution_statement: [
                    {rek_creator_contribution_statement: 'Missing', rek_creator_contribution_statement_order: 1},
                    {rek_creator_contribution_statement: 'Missing', rek_creator_contribution_statement_order: 2}
                ],
                // Extent
                fez_record_search_key_total_pages: {
                    rek_total_pages: 'test'
                },
                // Audience size
                fez_record_search_key_audience_size: {
                    rek_audience_size: 'test'
                },
                // Language
                fez_record_search_key_language: [],
                // Quality Indicator
                fez_record_search_key_quality_indicator: [
                    'Test'
                ],
                // Significance
                fez_record_search_key_significance: [
                    {rek_significance: 1, rek_significance_order: 1},
                    {rek_significance: 0, rek_significance_order: 2}
                ]
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
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
        }
    };

    it('will display correct empty fields for an Architectural Design work', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('will display correct empty fields for a Textual Book work', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('will display correct empty fields for a Textual Book work with lang supplied', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('will display correct empty fields for a Musical Creative work', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('will display correct empty fields for a Website Creative work', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('will display correct empty fields for a Public Sector Research Report work', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('will display correct empty fields for a Live Performance of Musical Creative Work work', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('will display correct empty fields for a Exhibition Creative Work work', () => {
        const testrecord = {
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    // of course, the card should never be called like this...
    it('will display empty where nothing is incomplete', () => {
        const testrecord = {
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
                    "rek_creator_contribution_statement": "Missing.",
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
        const wrapper = setup({recordToFix: testrecord});
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('_navigateToMyIncomplete()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            author: {
                aut_id: 1
            },
            recordToFix: {
                fez_datastream_info: [],
                fez_record_search_key_author_id: [
                    {rek_author_id: 1}
                    ]
            },
            history: {push: testFN},
            accountAuthorLoading: false,
            loadingRecordToFix: false
        });
        wrapper.instance()._navigateToMyIncomplete();
        expect(testFN).toHaveBeenCalledWith('/records/incomplete');

    });

    it('_navigateToDashboard()', () => {
        const testFN = jest.fn();
        const wrapper = setup({
            author: {
                aut_id: 1
            },
            recordToFix: {
                fez_datastream_info: [],
                fez_record_search_key_author_id: [
                    {rek_author_id: 1}
                ]
            },
            history: {push: testFN},
            accountAuthorLoading: false,
            loadingRecordToFix: false
        });
        wrapper.instance()._navigateToDashboard();
        expect(testFN).toHaveBeenCalledWith('/dashboard');

    });

    it('should have a proper style generator', () => {
        const theme = {
            palette: {
                secondary: {
                    light: 'test1'
                }
            }
        };
        expect(styles(theme)).toMatchSnapshot();
    });
});

