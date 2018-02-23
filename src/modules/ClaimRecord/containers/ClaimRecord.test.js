import ClaimRecordContainer from './ClaimRecord';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(ClaimRecordContainer, props, isShallow);
}

describe('ClaimRecordContainer', () => {

    it('form validation should return no errors for empty form', () => {
        const wrapper = setup({}, false);
        const allErrors = wrapper.find('Connect(Form(ConfirmDiscardFormChanges))').props().validate(Immutable.Map({}));
        expect(allErrors).toBeNull();
    });

    it('form validation should return no errors for a correctly filled out form', () => {
        const wrapper = setup({}, false);
        const data = {
            "publication": {
                "fez_record_search_key_author_id": [],
                "fez_record_search_key_contributor_id": [
                    {
                        "rek_contributor_id_id": 2391649,
                        "rek_contributor_id_pid": "UQ:641272",
                        "rek_contributor_id_xsdmf_id": 6037,
                        "rek_contributor_id": 0,
                        "rek_contributor_id_order": 1
                    },
                    {
                        "rek_contributor_id_id": 2391650,
                        "rek_contributor_id_pid": "UQ:641272",
                        "rek_contributor_id_xsdmf_id": 6037,
                        "rek_contributor_id": 0,
                        "rek_contributor_id_order": 2
                    }
                ]
            },
            "author":{
                "aut_mypub_url":"",
                "aut_rid_last_updated":"2013-05-17",
                "aut_created_date":null,
                "aut_update_date":"2017-07-23",
                "aut_display_name":"Researcher, J",
                "aut_position":"",
                "aut_people_australia_id":"",
                "aut_rid_password":"",
                "aut_scopus_id":"35478294000",
                "aut_homepage_link":"",
                "aut_org_username":"uqresearcher",
                "aut_external_id":"0000040357",
                "aut_fname":"J",
                "aut_researcher_id":"A-1137-2007",
                "aut_org_staff_id":"0001952",
                "aut_publons_id":null,
                "aut_lname":"Researcher",
                "aut_title":"Professor",
                "aut_org_student_id":null,
                "aut_student_username":null,
                "aut_mname":"",
                "aut_id":410,
                "aut_google_scholar_id":"kUemDfMAAAAJ",
                "aut_ref_num":"",
                "aut_description":"",
                "aut_email":"",
                "aut_orcid_id":"0000-0001-1111-1111"
            },
            "contributorLinking":{
                "authors":[
                    {
                        "rek_contributor_id_id":null,
                        "rek_contributor_id_pid":"UQ:641272",
                        "rek_contributor_id":410,
                        "rek_contributor_id_order":1
                    },
                    {
                        "rek_contributor_id_id":2391650,
                        "rek_contributor_id_pid":"UQ:641272",
                        "rek_contributor_id_xsdmf_id":6037,
                        "rek_contributor_id":0,
                        "rek_contributor_id_order":2
                    }
                ],
                "valid":true
            }
        };
        const allErrors = wrapper.find('Connect(Form(ConfirmDiscardFormChanges))').props().validate(Immutable.Map(data));
        expect(allErrors).toBeNull();
    });

    it('form validation should return 1 error for not validating/confirming the selection', () => {
        const wrapper = setup({}, false);
        const data = {
            "publication": {
                "fez_record_search_key_author_id": [],
                "fez_record_search_key_contributor_id": [
                    {
                        "rek_contributor_id_id": 2391649,
                        "rek_contributor_id_pid": "UQ:641272",
                        "rek_contributor_id_xsdmf_id": 6037,
                        "rek_contributor_id": 0,
                        "rek_contributor_id_order": 1
                    },
                    {
                        "rek_contributor_id_id": 2391650,
                        "rek_contributor_id_pid": "UQ:641272",
                        "rek_contributor_id_xsdmf_id": 6037,
                        "rek_contributor_id": 0,
                        "rek_contributor_id_order": 2
                    }
                ]
            },
            "author":{
                "aut_mypub_url":"",
                "aut_rid_last_updated":"2013-05-17",
                "aut_created_date":null,
                "aut_update_date":"2017-07-23",
                "aut_display_name":"Researcher, J",
                "aut_position":"",
                "aut_people_australia_id":"",
                "aut_rid_password":"",
                "aut_scopus_id":"35478294000",
                "aut_homepage_link":"",
                "aut_org_username":"uqresearcher",
                "aut_external_id":"0000040357",
                "aut_fname":"J",
                "aut_researcher_id":"A-1137-2007",
                "aut_org_staff_id":"0001952",
                "aut_publons_id":null,
                "aut_lname":"Researcher",
                "aut_title":"Professor",
                "aut_org_student_id":null,
                "aut_student_username":null,
                "aut_mname":"",
                "aut_id":410,
                "aut_google_scholar_id":"kUemDfMAAAAJ",
                "aut_ref_num":"",
                "aut_description":"",
                "aut_email":"",
                "aut_orcid_id":"0000-0001-1111-1111"
            },
            "contributorLinking":{
                "authors":[
                    {
                        "rek_contributor_id_id":null,
                        "rek_contributor_id_pid":"UQ:641272",
                        "rek_contributor_id":410,
                        "rek_contributor_id_order":1
                    },
                    {
                        "rek_contributor_id_id":2391650,
                        "rek_contributor_id_pid":"UQ:641272",
                        "rek_contributor_id_xsdmf_id":6037,
                        "rek_contributor_id":0,
                        "rek_contributor_id_order":2
                    }
                ],
                "valid":false
            }
        };
        const allErrors = wrapper.find('Connect(Form(ConfirmDiscardFormChanges))').props().validate(Immutable.Map(data));
        expect(allErrors._error.length).toEqual(1);
    });

    it('form validation should return 2 errors for not selecting or confirming the selection', () => {
        const wrapper = setup({}, false);
        const data = {
            "publication": {
                "fez_record_search_key_author_id": [],
                "fez_record_search_key_contributor_id": [
                    {
                        "rek_contributor_id_id": 2391649,
                        "rek_contributor_id_pid": "UQ:641272",
                        "rek_contributor_id_xsdmf_id": 6037,
                        "rek_contributor_id": 0,
                        "rek_contributor_id_order": 1
                    },
                    {
                        "rek_contributor_id_id": 2391650,
                        "rek_contributor_id_pid": "UQ:641272",
                        "rek_contributor_id_xsdmf_id": 6037,
                        "rek_contributor_id": 0,
                        "rek_contributor_id_order": 2
                    }
                ]
            },
            "author":{
                "aut_mypub_url":"",
                "aut_rid_last_updated":"2013-05-17",
                "aut_created_date":null,
                "aut_update_date":"2017-07-23",
                "aut_display_name":"Researcher, J",
                "aut_position":"",
                "aut_people_australia_id":"",
                "aut_rid_password":"",
                "aut_scopus_id":"35478294000",
                "aut_homepage_link":"",
                "aut_org_username":"uqresearcher",
                "aut_external_id":"0000040357",
                "aut_fname":"J",
                "aut_researcher_id":"A-1137-2007",
                "aut_org_staff_id":"0001952",
                "aut_publons_id":null,
                "aut_lname":"Researcher",
                "aut_title":"Professor",
                "aut_org_student_id":null,
                "aut_student_username":null,
                "aut_mname":"",
                "aut_id":410,
                "aut_google_scholar_id":"kUemDfMAAAAJ",
                "aut_ref_num":"",
                "aut_description":"",
                "aut_email":"",
                "aut_orcid_id":"0000-0001-1111-1111"
            },
            "contributorLinking": null
        };
        const allErrors = wrapper.find('Connect(Form(ConfirmDiscardFormChanges))').props().validate(Immutable.Map(data));
        expect(allErrors._error.length).toEqual(2);
    });

});
