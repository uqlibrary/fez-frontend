import Links from './Links';
import {recordLinks} from 'mock/data/testing/records';
import {OPEN_ACCESS_ID_LINK_NO_DOI, OPEN_ACCESS_ID_DOI} from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        publication: testProps.publication || recordLinks,
    };
    return getElement(Links, props, isShallow);
}

describe('Component Links ', () => {

    const getPublication = (embargoDays = 0, oaStatus = OPEN_ACCESS_ID_LINK_NO_DOI) => ({
        fez_record_search_key_oa_embargo_days: {
            rek_oa_embargo_days: embargoDays
        },
        rek_date: '2019-12-25T00:00:00Z',
        "fez_record_search_key_oa_status": {
            "rek_oa_status_id": 281706,
            "rek_oa_status_pid": "UQ:396321",
            "rek_oa_status_xsdmf_id": 16607,
            "rek_oa_status": oaStatus
        },
        ...(oaStatus === OPEN_ACCESS_ID_DOI ? {
        fez_record_search_key_doi: {
            rek_doi_id: 1706266,
            rek_doi_pid: "UQ:795721",
            rek_doi_xsdmf_id: 16514,
            rek_doi: "10.1016/j.pnsc.2012.12.004"
        }} : {}),
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
    });

    beforeEach(() => {
        Date.now = jest.genMockFunction().mockReturnValue('2020-01-01T00:00:00.000Z');
    });

    it('should render list of links with 3 OA and a google scholar link', () => {
        const wrapper = setup({publication: getPublication()}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.openAccess').length).toEqual(4);
    });

    it('should render list of links with 3 embargoed links and a google scholar link', () => {
        const linkProps = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 365
            },
            rek_date: '2019-12-25T00:00:00Z',
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

        const wrapper = setup({publication: getPublication(365)}, false);
        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.find('.openAccessEmbargoed').length).toEqual(3);
        expect(wrapper.find('.openAccess').length).toEqual(1);
    });

    it('should render list of links with 3 closed OA icons due to DOI OA status and DOI OA link', () => {
        const wrapper = setup({publication: getPublication(365, OPEN_ACCESS_ID_DOI)}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.openAccessClosed').length).toEqual(3);
        expect(wrapper.find('.openAccess').length).toEqual(1);
    });

    it('should render a PubMed Central link', () => {
        const pmcProps = {
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": OPEN_ACCESS_ID_DOI
            },
            "fez_record_search_key_pubmed_central_id": {
                "rek_pubmed_central_id_id": 12345678901,
                "rek_pubmed_central_id_pid": "UQ:1234",
                "rek_pubmed_central_id_xsdmf_id": 1234,
                "rek_pubmed_central_id": 'PMC5179926'
            },
        };
        const wrapper = setup({publication: pmcProps}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.openAccess').length).toEqual(1);
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
        const wrapper = setup({publication: doiProps}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.openAccessClosed').length).toEqual(1);
    });

    it('should render AO DOI link', () => {
        const doiProps = {
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 281706,
                "rek_oa_status_pid": "UQ:396321",
                "rek_oa_status_xsdmf_id": 16607,
                "rek_oa_status": OPEN_ACCESS_ID_DOI
            },
            fez_record_search_key_doi: {
                rek_doi_id: 1706266,
                rek_doi_pid: "UQ:795721",
                rek_doi_xsdmf_id: 16514,
                rek_doi: "10.1016/j.pnsc.2012.12.004"
            }
        };
        const wrapper = setup({publication: doiProps}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.openAccess').length).toEqual(1);
    });

    it('should return getDOILink', () => {
        const intput = [
            {openAccessStatusId: OPEN_ACCESS_ID_DOI, doi: '10.1093/hmg/ddw177', pubmedCentralId: 1234},
            {openAccessStatusId: OPEN_ACCESS_ID_DOI, doi: '10.1093/hmg/ddw177', pubmedCentralId: null},
            {openAccessStatusId: OPEN_ACCESS_ID_LINK_NO_DOI, doi: '10.1093/hmg/ddw177', pubmedCentralId: null},
        ];
        const expected = [
            {isOpenAccess: false, openAccessStatusId: OPEN_ACCESS_ID_DOI},
            {isOpenAccess: true, openAccessStatusId: OPEN_ACCESS_ID_DOI},
            {isOpenAccess: false, openAccessStatusId: OPEN_ACCESS_ID_LINK_NO_DOI}
        ];

        const wrapper = setup({});
        intput.map((item, index) => {
            // openAccessStatusId, doi, pubmedCentralId
            const output = wrapper.instance().getDOILink(item.openAccessStatusId, item.doi, item.pubmedCentralId);
            expect(output.openAccessStatus).toEqual(expected[index]);

        });
    });

    it('should return getPMCLink', () => {
        // openAccessStatusId, pubmedCentralId
        const intput = [
            {openAccessStatusId: OPEN_ACCESS_ID_DOI, pubmedCentralId: 'PM1234'},
        ];
        const expected = [
            {isOpenAccess: true, openAccessStatusId: OPEN_ACCESS_ID_DOI},
        ];

        const wrapper = setup({});
        intput.map((item, index) => {
            // openAccessStatusId, doi, pubmedCentralId
            const output = wrapper.instance().getPMCLink(item.openAccessStatusId, item.pubmedCentralId);
            expect(output.openAccessStatus).toEqual(expected[index]);
        });
    });

    it('should return getGoogleScholarLink', () => {
        // openAccessStatusId, title
        const intput = [
            {openAccessStatusId: 1234, title: 'test'},
        ];
        const expected = [
            {isOpenAccess: true, openAccessStatusId: 1234},
        ];

        const wrapper = setup({});
        intput.map((item, index) => {
            // openAccessStatusId, doi, pubmedCentralId
            const output = wrapper.instance().getGoogleScholarLink(item.openAccessStatusId, item.title);
            expect(output.openAccessStatus).toEqual(expected[index]);
        });
    });

    it('should return isRecordOpenAccess status', () => {
        // openAccessStatusId, title
        const intput = [
            {
                fez_record_search_key_oa_status: {rek_oa_status: OPEN_ACCESS_ID_LINK_NO_DOI},
                fez_record_search_key_oa_embargo_days: {rek_oa_embargo_days: 0},
                rek_date: "2017-08-03T00:00:00Z",
            },
            {
                fez_record_search_key_oa_status: {rek_oa_status: OPEN_ACCESS_ID_LINK_NO_DOI},
                fez_record_search_key_oa_embargo_days: {rek_oa_embargo_days: 400},
                rek_date: "2019-01-01T00:00:00Z",
            }
        ];
        const expected = [
            {isOpenAccess: true, embargoDate: null},
            {isOpenAccess: false, embargoDate: '5th February 2020'}
        ];

        const wrapper = setup({});
        intput.map((item, index) => {
            // openAccessStatusId, doi, pubmedCentralId
            const output = wrapper.instance().isRecordOpenAccess(item);
            expect(output).toEqual(expected[index]);
        });
    });
});
