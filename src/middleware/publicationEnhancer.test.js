import publicationEnhancer, { calculateOpenAccess, potentiallyOpenAccessible } from './publicationEnhancer';
import { OPEN_ACCESS_ID_NOT_OPEN_ACCESS } from 'config/openAccess';
import {
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
} from 'config/general';

describe('publication enhancer', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should add a method to a publication to calculate open access', () => {
        const publication = {
            rek_pid: 'UQ:1234',
            rek_title: 'Title',
            rek_description: 'Description',
            rek_formatted_title: null,
            rek_formatted_abstract: 'Abstract',
        };
        const next = jest.fn();
        publicationEnhancer()(next)({ type: 'FIX_RECORD_LOADED', payload: publication });

        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: {
                    calculateOpenAccess: expect.any(Function),
                    potentiallyOpenAccessible: expect.any(Function),
                    rek_pid: 'UQ:1234',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                    rek_formatted_title: null,
                },
                type: 'FIX_RECORD_LOADED',
            }),
        );
    });

    it('should calculate open access', () => {
        const publication = {
            rek_pid: 'UQ:1234',
            rek_title: 'Title',
            rek_description: 'Description',
            rek_formatted_title: null,
            rek_formatted_abstract: 'Abstract',
        };
        const next = jest.fn(action => {
            const result = action.payload.calculateOpenAccess();
            expect(result).toEqual({
                isOpenAccess: false,
                embargoDate: null,
                openAccessStatusId: null,
            });
        });
        publicationEnhancer()(next)({ type: 'FIX_RECORD_LOADED', payload: publication });
    });

    it('should not calculate open access', () => {
        const publication = {
            rek_title: 'Title',
            rek_description: 'Description',
            rek_formatted_title: null,
            rek_formatted_abstract: 'Abstract',
        };
        const next = jest.fn(action => {
            const result = action.payload.calculateOpenAccess();
            expect(result).toBeNull();
        });
        publicationEnhancer()(next)({ type: 'FIX_RECORD_LOADED', payload: publication });
    });

    it('should not determine potentially open accessible status without rek_pid', () => {
        const publication = {
            rek_title: 'Title',
            rek_description: 'Description',
            rek_formatted_title: null,
            rek_formatted_abstract: 'Abstract',
        };
        const next = jest.fn(action => {
            const result = action.payload.potentiallyOpenAccessible();
            expect(result).toBeNull();
        });
        publicationEnhancer()(next)({ type: 'FIX_RECORD_LOADED', payload: publication });
    });

    it('should determine potentially open accessible status with rek_pid', () => {
        const publication = {
            rek_pid: 'UQ:1234',
            rek_title: 'Title',
            rek_description: 'Description',
            rek_formatted_title: null,
            rek_formatted_abstract: 'Abstract',
            rek_created_date: '2025-01-01T00:00:00Z',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453700, // Not OA
            },
            rek_display_type_lookup: 'Journal Article',
        };
        const next = jest.fn(action => {
            const result = action.payload.potentiallyOpenAccessible();
            expect(typeof result).toBe('boolean');
        });
        publicationEnhancer()(next)({ type: 'FIX_RECORD_LOADED', payload: publication });
    });

    it('should add a method to a list of publication to calculate open access', () => {
        const payload = {
            data: [
                {
                    rek_pid: 'UQ:1234',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                },
                {
                    rek_pid: 'UQ:1235',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                },
            ],
            count: 2,
        };
        const next = jest.fn();
        const expectedPayload = {
            data: [
                {
                    rek_pid: 'UQ:1234',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                    rek_formatted_title: null,
                    calculateOpenAccess: expect.any(Function),
                    potentiallyOpenAccessible: expect.any(Function),
                },
                {
                    rek_pid: 'UQ:1235',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                    rek_formatted_title: null,
                    calculateOpenAccess: expect.any(Function),
                    potentiallyOpenAccessible: expect.any(Function),
                },
            ],
            count: 2,
        };
        publicationEnhancer()(next)({ type: 'LATEST_PUBLICATIONS_LOADED', payload: payload });

        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expectedPayload,
                type: 'LATEST_PUBLICATIONS_LOADED',
            }),
        );
    });

    it('should add a method to a list of publication to calculate open access for trending publications', () => {
        const payload = {
            data: [
                {
                    rek_pid: 'UQ:1234',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                },
                {
                    rek_pid: 'UQ:1235',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                },
            ],
        };

        const next = jest.fn();
        const expectedPayload = {
            data: [
                {
                    rek_pid: 'UQ:1234',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                    rek_formatted_title: null,
                    calculateOpenAccess: expect.any(Function),
                    potentiallyOpenAccessible: expect.any(Function),
                },
                {
                    rek_pid: 'UQ:1235',
                    rek_title: 'Title',
                    rek_description: 'Description',
                    rek_formatted_abstract: 'Abstract',
                    rek_formatted_title: null,
                    calculateOpenAccess: expect.any(Function),
                    potentiallyOpenAccessible: expect.any(Function),
                },
            ],
        };
        publicationEnhancer()(next)({ type: 'TRENDING_PUBLICATIONS_LOADED@altmetric', payload: payload });

        expect(next).toBeCalledWith(
            expect.objectContaining({
                payload: expectedPayload,
                type: 'TRENDING_PUBLICATIONS_LOADED@altmetric',
            }),
        );
    });

    it('should not add anything to data if action is not on the list', () => {
        const publication = { rek_pid: 'UQ:1234' };
        const next = jest.fn();
        publicationEnhancer()(next)({
            type: 'FIX_RECORD_LOAD_FAILED',
            payload: publication,
        });

        expect(next).toBeCalledWith(
            expect.objectContaining({
                type: 'FIX_RECORD_LOAD_FAILED',
                payload: publication,
            }),
        );
    });

    it("should not add anything to data if there's no data", () => {
        const next = jest.fn();
        publicationEnhancer()(next)({
            type: 'SEARCH_LOADED',
            payload: { nothing: 'here' },
        });

        expect(next).toBeCalledWith(
            expect.objectContaining({
                type: 'SEARCH_LOADED',
                payload: { nothing: 'here' },
            }),
        );
    });

    it('should calculate OA status', () => {
        const publicationDOIOANoEmbargoDate = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 0,
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693,
            },
        };
        const publicationDOIOAWithEmbargoDate = {
            fez_record_search_key_oa_embargo_days: {
                rek_oa_embargo_days: 400,
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453693,
            },
        };
        const publicationRDMOANoEmbargoDate = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 454116,
            },
        };
        const publicationRDMOAWithEmbargoDate = {
            fez_record_search_key_embargo_to: {
                rek_embargo_to: '2050-12-31',
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 454116,
            },
        };
        const publicationRDMOAWithEmbargoDateInPast = {
            fez_record_search_key_embargo_to: {
                rek_embargo_to: '2000-12-31',
            },
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 454116,
            },
        };
        const publicationPMC = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453954,
            },
        };
        const publicationNotOA = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453700,
            },
        };
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'FezACML_UQ357538_OA.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ357538_OA.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 62,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'presmd_UQ357538_OA.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 275290,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: '2021-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1232313',
                    dsi_dsid: 'earlierFile.pdf',
                    dsi_embargo_date: '2021-11-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const publicationEmbargoMaturedOAFile = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'FezACML_UQ357538_OA.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ357538_OA.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 62,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'presmd_UQ357538_OA.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 275290,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: '2019-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const publicationMultipleOAFiles = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'FezACML_UQ357538_OA.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ357538_OA.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 62,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'presmd_UQ357538_OA.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 275290,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: '2019-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:123',
                    dsi_dsid: 'UQ357538_OAEmbargo.pdf',
                    dsi_embargo_date: '2021-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const publicationMultipleEmbargoOAFiles = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'FezACML_UQ357538_OA.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ357538_OA.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 62,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'presmd_UQ357538_OA.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 275290,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: '2022-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:123',
                    dsi_dsid: 'UQ357538_OAEmbargo.pdf',
                    dsi_embargo_date: '2023-12-01',
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const publicationNoEmbargoOAFile = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'FezACML_UQ357538_OA.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ357538_OA.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 62,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'presmd_UQ357538_OA.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 275290,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };
        const publicationOtherNoFiles = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453697,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'FezACML_UQ357538_OA.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ357538_OA.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 62,
                },
            ],
        };
        const publicationNoDataStream = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453697,
            },
        };
        const publicationOAFileWithERA = {
            rek_created_date: '2019-12-25T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695,
            },
            fez_datastream_info: [
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'FezACML_UQ357538_OA.pdf.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'FezACML security for datastream - UQ357538_OA.pdf',
                    dsi_mimetype: 'text/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 62,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'presmd_UQ357538_OA.xml',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: '',
                    dsi_mimetype: 'application/xml',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 275290,
                },
                {
                    dsi_pid: 'UQ:357538',
                    dsi_dsid: 'UQ357538_OA.pdf',
                    dsi_embargo_date: null,
                    dsi_open_access: null,
                    dsi_label: 'Full text (open access)',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
                {
                    dsi_pid: 'UQ:1234',
                    dsi_dsid: '123.pdf',
                    dsi_embargo_date: '2050-01-01',
                    dsi_open_access: null,
                    dsi_label: 'ERA restricted admins only',
                    dsi_mimetype: 'application/pdf',
                    dsi_copyright: null,
                    dsi_state: 'A',
                    dsi_size: 1526884,
                },
            ],
        };

        const expectOADoiNoEmbargoDate = { embargoDate: null, isOpenAccess: true, openAccessStatusId: 453693 };
        const expectOADoiWithEmbargoDate = {
            embargoDate: '4th February 2021',
            isOpenAccess: false,
            openAccessStatusId: 453693,
        };
        const expectOARDMNoEmbargoDate = { embargoDate: null, isOpenAccess: true, openAccessStatusId: 454116 };
        const expectOARDMWithEmbargoDate = {
            embargoDate: '31st December 2050',
            isOpenAccess: false,
            openAccessStatusId: 454116,
        };
        const expectOARDMWithEmbargoDateInPast = { embargoDate: null, isOpenAccess: true, openAccessStatusId: 454116 };
        const expectOAPMC = { embargoDate: null, isOpenAccess: true, openAccessStatusId: 453954 };
        const expectNotOA = { embargoDate: null, isOpenAccess: false, openAccessStatusId: 453700 };
        const expectEmbargoOA = {
            embargoDate: '1st November 2021',
            isOpenAccess: false,
            openAccessStatusId: 453695,
        };
        const expectOA = { embargoDate: null, isOpenAccess: true, openAccessStatusId: 453695 };
        const expectEmbargoMultipleFiles = {
            embargoDate: '1st December 2022',
            isOpenAccess: false,
            openAccessStatusId: 453695,
        };
        const expectOAOther = { embargoDate: null, isOpenAccess: true, openAccessStatusId: 453697 };
        const expectNoDataStream = { embargoDate: null, isOpenAccess: true, openAccessStatusId: 453697 };

        expect(calculateOpenAccess(publicationDOIOANoEmbargoDate)).toEqual(expectOADoiNoEmbargoDate);
        expect(calculateOpenAccess(publicationDOIOAWithEmbargoDate)).toEqual(expectOADoiWithEmbargoDate);
        expect(calculateOpenAccess(publicationRDMOANoEmbargoDate)).toEqual(expectOARDMNoEmbargoDate);
        expect(calculateOpenAccess(publicationRDMOAWithEmbargoDate)).toEqual(expectOARDMWithEmbargoDate);
        expect(calculateOpenAccess(publicationRDMOAWithEmbargoDateInPast)).toEqual(expectOARDMWithEmbargoDateInPast);
        expect(calculateOpenAccess(publicationPMC)).toEqual(expectOAPMC);
        expect(calculateOpenAccess(publicationNotOA)).toEqual(expectNotOA);
        expect(calculateOpenAccess(publicationEmbargoOAFile)).toEqual(expectEmbargoOA);
        expect(calculateOpenAccess(publicationEmbargoMaturedOAFile)).toEqual(expectOA);
        expect(calculateOpenAccess(publicationMultipleOAFiles)).toEqual(expectOA);
        expect(calculateOpenAccess(publicationNoEmbargoOAFile)).toEqual(expectOA);
        expect(calculateOpenAccess(publicationOAFileWithERA)).toEqual(expectOA);
        expect(calculateOpenAccess(publicationMultipleEmbargoOAFiles)).toEqual(expectEmbargoMultipleFiles);
        expect(calculateOpenAccess(publicationOtherNoFiles)).toEqual(expectOAOther);
        expect(calculateOpenAccess(publicationNoDataStream)).toEqual(expectNoDataStream);
    });

    it('should clean up invalid HTML in rek_title from a search list', () => {
        const publication = {
            rek_pid: 'UQ:1234',
            rek_title: '<br/>This is a <u>title</u> with <sup>sup</sup> and <sub>sub</sub>',
        };
        const next = jest.fn();
        publicationEnhancer()(next)({ type: 'SEARCH_LOADED@wos', payload: { data: [publication] } });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                type: 'SEARCH_LOADED@wos',
                payload: {
                    data: [
                        {
                            rek_pid: 'UQ:1234',
                            rek_title: 'This is a title with <sup>sup</sup> and <sub>sub</sub>',
                            rek_formatted_abstract: null,
                            rek_formatted_title: null,
                            calculateOpenAccess: expect.any(Function),
                            potentiallyOpenAccessible: expect.any(Function),
                        },
                    ],
                },
            }),
        );
    });

    it('should clean up invalid HTML in rek_title from a publication list', () => {
        const publication = {
            rek_pid: 'UQ:1234',
            rek_title: '<br/>This is a <u>title</u> with <sup>sup</sup> and <sub>sub</sub>',
            rek_formatted_abstract:
                '<test>html</test><ul><li>one</li><li>tow</li></ul><span>hello</span><p class="some-css">good bye</p>',
        };
        const next = jest.fn();
        publicationEnhancer()(next)({ type: 'LATEST_PUBLICATIONS_LOADED', payload: { data: [publication] } });
        expect(next).toBeCalledWith(
            expect.objectContaining({
                type: 'LATEST_PUBLICATIONS_LOADED',
                payload: {
                    data: [
                        {
                            rek_pid: 'UQ:1234',
                            rek_title: 'This is a title with <sup>sup</sup> and <sub>sub</sub>',
                            calculateOpenAccess: expect.any(Function),
                            potentiallyOpenAccessible: expect.any(Function),
                            rek_formatted_abstract: 'html<ul><li>one</li><li>tow</li></ul>hello<p>good bye</p>',
                            rek_formatted_title: null,
                        },
                    ],
                },
            }),
        );
    });

    it('should set rek_formatted_abstract and rek_formatted_title to null due to invalid html', () => {
        const publication = {
            rek_pid: 'UQ:1234',
            rek_title: 'Title',
            rek_formatted_title: '<b> </b>',
            rek_formatted_abstract: '<br/>',
        };
        const next = jest.fn();
        publicationEnhancer()(next)({ type: 'VIEW_RECORD_LOADED', payload: publication });

        expect(next).toBeCalledWith(
            expect.objectContaining({
                type: 'VIEW_RECORD_LOADED',
                payload: {
                    rek_pid: 'UQ:1234',
                    rek_title: 'Title',
                    rek_formatted_title: null,
                    rek_formatted_abstract: null,
                    calculateOpenAccess: expect.any(Function),
                    potentiallyOpenAccessible: expect.any(Function),
                },
            }),
        );
    });

    describe('potentiallyOpenAccessible', () => {
        it('should return true for a journal article with not open access status and no files', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
                fez_record_search_key_oa_status: {
                    rek_oa_status: OPEN_ACCESS_ID_NOT_OPEN_ACCESS,
                },
                fez_record_search_key_file_attachment_name: [],
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(true);
        });

        it('should return true for a book chapter with not open access status and no file attachment property', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_BOOK_CHAPTER,
                fez_record_search_key_oa_status: {
                    rek_oa_status: OPEN_ACCESS_ID_NOT_OPEN_ACCESS,
                },
                // No fez_record_search_key_file_attachment_name property
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(true);
        });

        it('should return false for a record with open access status', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
                fez_record_search_key_oa_status: {
                    rek_oa_status: OPEN_ACCESS_ID_NOT_OPEN_ACCESS - 1,
                },
                fez_record_search_key_file_attachment_name: [],
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(false);
        });

        it('should return false for a non-journal article or non-book chapter record', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_AUDIO_DOCUMENT, // Not PUBLICATION_TYPE_JOURNAL_ARTICLE or PUBLICATION_TYPE_BOOK_CHAPTER
                fez_record_search_key_oa_status: {
                    rek_oa_status: OPEN_ACCESS_ID_NOT_OPEN_ACCESS,
                },
                fez_record_search_key_file_attachment_name: [],
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(false);
        });

        it('should return false for a record that has file attachments', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
                fez_record_search_key_oa_status: {
                    rek_oa_status: OPEN_ACCESS_ID_NOT_OPEN_ACCESS,
                },
                fez_record_search_key_file_attachment_name: [{ rek_file_attachment_name: 'document.pdf' }],
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(false);
        });

        it('should return false for a record with no oa_status', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
                // No fez_record_search_key_oa_status property
                fez_record_search_key_file_attachment_name: [],
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(false);
        });

        it('should return false for a record with invalid oa_status', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
                fez_record_search_key_oa_status: {
                    rek_oa_status: 'invalid', // Not a finite number
                },
                fez_record_search_key_file_attachment_name: [],
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(false);
        });

        it('should return true for a journal article with not open access status and undefined file attachment name', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_JOURNAL_ARTICLE,
                fez_record_search_key_oa_status: {
                    rek_oa_status: OPEN_ACCESS_ID_NOT_OPEN_ACCESS,
                },
                fez_record_search_key_file_attachment_name: undefined,
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(true);
        });

        it('should return true for a book chapter with not open access status and empty file attachments', () => {
            const publication = {
                rek_pid: 'UQ:1234',
                rek_display_type: PUBLICATION_TYPE_BOOK_CHAPTER, // PUBLICATION_TYPE_BOOK_CHAPTER
                fez_record_search_key_oa_status: {
                    rek_oa_status: OPEN_ACCESS_ID_NOT_OPEN_ACCESS,
                },
                fez_record_search_key_file_attachment_name: [],
            };

            const result = potentiallyOpenAccessible(publication);
            expect(result).toBe(true);
        });
    });
});
