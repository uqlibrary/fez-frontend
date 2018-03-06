import ViewRecordLinks from './ViewRecordLinks';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        recordToView: testProps.recordToView || null,
        match: testProps.match || { params: {pid: 'UQ:12344'}},
        actions: testProps.actions || {
            loadRecordToView: jest.fn(),
            clearRecordToView: jest.fn()
        }
    };
    return getElement(ViewRecordLinks, props, isShallow);
}

describe('Component ViewRecord ', () => {

    it('should render empty div', () => {
        const wrapper = setup({});
        console.log(wrapper.instance().recordToView);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render list of links with OA icons', () => {
        const linkProps = {
                fez_record_search_key_oa_embargo_days: {
                    rek_embargo_days: 0
                },
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": 453693
            },
            "fez_record_search_key_link": [
                {
                    "rek_link_id": 3240198,
                    "rek_link_pid": "UQ:795347",
                    "rek_link_xsdmf_id": null,
                    "rek_link": "http://www.thisisatest.com",
                    "rek_link_order": 1
                },
                {
                    "rek_link_id": 3240199,
                    "rek_link_pid": "UQ:795347",
                    "rek_link_xsdmf_id": null,
                    "rek_link": "http://www.thisisanothertest.com",
                    "rek_link_order": 2
                },
                {
                    "rek_link_id": 3240200,
                    "rek_link_pid": "UQ:795347",
                    "rek_link_xsdmf_id": null,
                    "rek_link": "http://www.nodescription.com",
                    "rek_link_order": 2
                }
            ],
            "fez_record_search_key_link_description": [
                {
                    "rek_link_description_id": 3240198,
                    "rek_link_description_pid": "UQ:795347",
                    "rek_link_description_xsdmf_id": null,
                    "rek_link_description": "Link to publication",
                    "rek_link_description_order": 1
                },
                {
                    "rek_link_description_id": 3240199,
                    "rek_link_description_pid": "UQ:795347",
                    "rek_link_description_xsdmf_id": null,
                    "rek_link_description": "Another link to publication",
                    "rek_link_description_order": 1
                },
                {
                    "rek_link_description_id": 3240200,
                    "rek_link_description_pid": "UQ:795347",
                    "rek_link_description_xsdmf_id": null,
                    "rek_link_description": null,
                    "rek_link_description_order": 1
                }
            ],
        };
        const wrapper = setup({recordToView: linkProps});
        expect(wrapper.find('.openAccess').length).toEqual(3);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render list of links without OA icons', () => {
        const linkProps = {
            fez_record_search_key_oa_embargo_days: {
                rek_embargo_days: 100000
            },
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": 453693
            },
            "fez_record_search_key_link": [
                {
                    "rek_link_id": 3240198,
                    "rek_link_pid": "UQ:795347",
                    "rek_link_xsdmf_id": null,
                    "rek_link": "http://www.thisisatest.com",
                    "rek_link_order": 1
                },
                {
                    "rek_link_id": 3240199,
                    "rek_link_pid": "UQ:795347",
                    "rek_link_xsdmf_id": null,
                    "rek_link": "http://www.thisisanothertest.com",
                    "rek_link_order": 2
                },
                {
                    "rek_link_id": 3240200,
                    "rek_link_pid": "UQ:795347",
                    "rek_link_xsdmf_id": null,
                    "rek_link": "http://www.nodescription.com",
                    "rek_link_order": 2
                }
            ],
            "fez_record_search_key_link_description": [
                {
                    "rek_link_description_id": 3240198,
                    "rek_link_description_pid": "UQ:795347",
                    "rek_link_description_xsdmf_id": null,
                    "rek_link_description": "Link to publication",
                    "rek_link_description_order": 1
                },
                {
                    "rek_link_description_id": 3240199,
                    "rek_link_description_pid": "UQ:795347",
                    "rek_link_description_xsdmf_id": null,
                    "rek_link_description": "Another link to publication",
                    "rek_link_description_order": 1
                },
                {
                    "rek_link_description_id": 3240200,
                    "rek_link_description_pid": "UQ:795347",
                    "rek_link_description_xsdmf_id": null,
                    "rek_link_description": null,
                    "rek_link_description_order": 1
                }
            ],
        };
        const wrapper = setup({recordToView: linkProps});
        expect(wrapper.find('.openAccess').length).toEqual(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a PubMed Central link', () => {
        const pmcProps = {
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": 453693
            },
            "fez_record_search_key_pubmed_central_id": {
                "rek_pubmed_central_id_id": 12345678901,
                "rek_pubmed_central_id_pid": "UQ:1234",
                "rek_pubmed_central_id_xsdmf_id": 1234,
                "rek_pubmed_central_id": 'PMC5179926'
            },
        };
        const wrapper = setup({recordToView: pmcProps});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
