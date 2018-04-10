jest.dontMock('./CitationCounts');
import CitationCounts from './CitationCounts';
import {myRecordsList} from 'mock/data';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        ...testProps,
        publication: testProps.publication || {}, // : PropTypes.object.isRequired,
    };
    return getElement(CitationCounts, props, isShallow);
}

describe('CitationCounts renders ', () => {

    beforeEach(() => {
        Date.now = jest.genMockFunction().mockReturnValue('2020-01-01T00:00:00.000Z');
    });

    it('component with no metrics', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with a mock record metrics', () => {
        const wrapper = setup({ publication: {...myRecordsList.data[0],
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 0
        },
            rek_created_date: '2019-12-25T00:00:00Z'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with all metrics', () => {
        const publication = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 0
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            rek_thomson_citation_count: 1,
            rek_scopus_citation_count: 1,
            rek_gs_citation_count: 1,
            rek_altmetric_score: 1,
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693
            },
            fez_record_search_key_isi_loc: {
                rek_isi_loc: 12345,
            },
            fez_record_search_key_scopus_id: {
                rek_scopus_id: 12345,
            },
            rek_altmetric_id: 12345,
        };
        const wrapper = setup({publication});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should calculate OA status', () => {
        const publicationDOIOANoEmbargoDate = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 0
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693
            }
        };
        const publicationDOIOAWithEmbargoDate = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 400
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693
            }
        };
        const publicationPMC = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453954
            }
        };
        const publicationNotOA = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453700
            }
        };
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
            },
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "FezACML_UQ357538_OA.pdf.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for datastream - UQ357538_OA.pdf",
                    "dsi_mimetype": "text\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 62
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "presmd_UQ357538_OA.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 275290
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2021-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }],
        };
        const publicationEmbargoMaturedOAFile = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
            },
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "FezACML_UQ357538_OA.pdf.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for datastream - UQ357538_OA.pdf",
                    "dsi_mimetype": "text\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 62
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "presmd_UQ357538_OA.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 275290
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2019-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }],
        };
        const publicationMultipleOAFiles = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
            },
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "FezACML_UQ357538_OA.pdf.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for datastream - UQ357538_OA.pdf",
                    "dsi_mimetype": "text\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 62
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "presmd_UQ357538_OA.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 275290
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2019-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:123",
                    "dsi_dsid": "UQ357538_OAEmbargo.pdf",
                    "dsi_embargo_date": "2021-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }
            ],
        };
        const publicationMultipleEmbargoOAFiles = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
            },
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "FezACML_UQ357538_OA.pdf.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for datastream - UQ357538_OA.pdf",
                    "dsi_mimetype": "text\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 62
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "presmd_UQ357538_OA.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 275290
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2022-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:123",
                    "dsi_dsid": "UQ357538_OAEmbargo.pdf",
                    "dsi_embargo_date": "2023-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }
            ],
        };
        const publicationNoEmbargoOAFile = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
            },
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "FezACML_UQ357538_OA.pdf.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "FezACML security for datastream - UQ357538_OA.pdf",
                    "dsi_mimetype": "text\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 62
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "presmd_UQ357538_OA.xml",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "",
                    "dsi_mimetype": "application\/xml",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 275290
                },
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }],
        };


        const expectOADoiNoEmbargoDate = {"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453693};
        const expectOADoiWithEmbargoDate = {"embargoDate": "4th February 2021", "isOpenAccess": false, "openAccessStatusId": 453693};
        const expectOAPMC = {"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453954};
        const expectNotOA = {"embargoDate": null, "isOpenAccess": false, "openAccessStatusId": 453700};
        const expectEmbargoOA = {"embargoDate": "1st December 2021", "isOpenAccess": false, "openAccessStatusId": 453695};
        const expectOA = {"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453695};
        const expectEmbargoMultipleFiles = {"embargoDate": "1st December 2022", "isOpenAccess": false, "openAccessStatusId": 453695};

        const wrapper = setup({});
        expect(wrapper.instance().isRecordOpenAccess(publicationDOIOANoEmbargoDate)).toEqual(expectOADoiNoEmbargoDate);
        expect(wrapper.instance().isRecordOpenAccess(publicationDOIOAWithEmbargoDate)).toEqual(expectOADoiWithEmbargoDate);
        expect(wrapper.instance().isRecordOpenAccess(publicationPMC)).toEqual(expectOAPMC);
        expect(wrapper.instance().isRecordOpenAccess(publicationNotOA)).toEqual(expectNotOA);
        expect(wrapper.instance().isRecordOpenAccess(publicationEmbargoOAFile)).toEqual(expectEmbargoOA);
        expect(wrapper.instance().isRecordOpenAccess(publicationEmbargoMaturedOAFile)).toEqual(expectOA);
        expect(wrapper.instance().isRecordOpenAccess(publicationMultipleOAFiles)).toEqual(expectOA);
        expect(wrapper.instance().isRecordOpenAccess(publicationNoEmbargoOAFile)).toEqual(expectOA);
        expect(wrapper.instance().isRecordOpenAccess(publicationMultipleEmbargoOAFiles)).toEqual(expectEmbargoMultipleFiles);
    });
});
