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
        expect(wrapper.state().hasAnyFiles).toBeFalsy();
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
        expect(wrapper.state().hasAnyFiles).toBeFalsy();
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
})