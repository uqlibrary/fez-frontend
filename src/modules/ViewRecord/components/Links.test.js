import Links from './Links';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        recordToView: testProps.publication || null,
        match: testProps.match || { params: {pid: 'UQ:12344'}},
        actions: testProps.actions || {
            loadRecordToView: jest.fn(),
            clearRecordToView: jest.fn()
        }
    };
    return getElement(Links, props, isShallow);
}

describe('Component ViewRecord ', () => {

    beforeEach(() => {
        Date.now = jest.genMockFunction().mockReturnValue('2020-01-01T00:00:00.000Z');
    });

    it('should render empty div', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render list of links with OA icons', () => {
        const linkProps = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 1
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453694 // Link (no DOI)
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

        const wrapper = setup({publication: linkProps});
        expect(wrapper.find('.openAccess').length).toEqual(4);
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should render list of links with OA icons due to no embargo days', () => {
        const linkProps = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 0
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": 453694
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

        const wrapper = setup({publication: linkProps});
        expect(wrapper.find('.openAccess').length).toEqual(4);
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should render list of links with locked OA icons due to embargo date in the future', () => {
        const linkProps = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 365
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": 453694
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

        const wrapper = setup({publication: linkProps});
        expect(wrapper.find('.openAccessEmbargoed').length).toEqual(3);
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should render list of links with closed OA icons due to DOI OA status', () => {
        const linkProps = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 365
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": 453693
            },
            fez_record_search_key_doi: {
                rek_doi_id: 1706266,
                rek_doi_pid: "UQ:795721",
                rek_doi_xsdmf_id: 16514,
                rek_doi: "10.1016/j.pnsc.2012.12.004"
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

        const wrapper = setup({publication: linkProps});
        expect(wrapper.find('.openAccessClosed').length).toEqual(3);
        expect(wrapper.find('.openAccess').length).toEqual(1);
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
        const wrapper = setup({publication: pmcProps});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a DOI link', () => {
        const doiProps = {
            fez_record_search_key_doi: {
                rek_doi_id: 1706266,
                rek_doi_pid: "UQ:795721",
                rek_doi_xsdmf_id: 16514,
                rek_doi: "10.1016/j.pnsc.2012.12.004"
            }
        };
        const wrapper = setup({publication: doiProps});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
