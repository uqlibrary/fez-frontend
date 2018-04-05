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
        expect(wrapper.find('.citationCount').length).toEqual(2);
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
        const publicationOAPossibleEmbargo = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
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

        const expectOADoiNoEmbargoDate = {"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453693};
        const expectOADoiWithEmbargoDate = {"embargoDate": "4th February 2021", "isOpenAccess": false, "openAccessStatusId": 453693};
        const expectOAPossibleEmbargo = {"embargoDate": "a possible embargo date", "isOpenAccess": false, "openAccessStatusId": 453695};
        const expectOAPMC = {"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453954};
        const expectNotOA = {"embargoDate": null, "isOpenAccess": false, "openAccessStatusId": 453700};

        const wrapper = setup({});
        expect(wrapper.instance().isRecordOpenAccess(publicationDOIOANoEmbargoDate)).toEqual(expectOADoiNoEmbargoDate);
        expect(wrapper.instance().isRecordOpenAccess(publicationDOIOAWithEmbargoDate)).toEqual(expectOADoiWithEmbargoDate);
        expect(wrapper.instance().isRecordOpenAccess(publicationOAPossibleEmbargo)).toEqual(expectOAPossibleEmbargo);
        expect(wrapper.instance().isRecordOpenAccess(publicationPMC)).toEqual(expectOAPMC);
        expect(wrapper.instance().isRecordOpenAccess(publicationNotOA)).toEqual(expectNotOA);
    });
});
