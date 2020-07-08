import React from 'react';
import { shallow } from 'enzyme';

import { Doi, getWarningMessage } from './Doi';

import { DOI_ORG_PREFIX } from 'config/doi';
import { openAccessFiles } from 'config/openAccess';

import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
import publicationTypeListJournalArticle from 'mock/data/records/publicationTypeListJournalArticle';
import collectionRecord from 'mock/data/records/collectionRecord';

const record = publicationTypeListResearchReport.data[0];

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        match: {
            params: {
                pid: record.rek_pid,
            },
        },
        record,
        ...testProps,
    };

    return getElement(Doi, props, args);
};

describe('DOI component', () => {
    it('should render title with DOI', () => {
        const wrapper = setup({
            record: {
                ...record,
                fez_record_search_key_doi: {
                    rek_doi: 'Testing',
                },
            },
        });
        expect(wrapper.find('[data-testid="doi-page-title"]').text()).toBe(
            `Update DOI for ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`,
        );
    });

    it('should render title and enable submit button without DOI', () => {
        const wrapper = setup({});
        expect(wrapper.find('[data-testid="doi-page-title"]').text()).toBe(
            `Create DOI for ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`,
        );
        expect(wrapper.find('#rek-doi-submit').props().disabled).toBe(false);
    });

    it('should show loading message when record is loading', () => {
        const wrapper = setup({
            loadingRecordToView: true,
            record: null,
        });
        expect(wrapper.find('WithStyles(InlineLoader)').props().message).toBe('Loading record');
    });

    it('should show empty div and call loader if record is not found', () => {
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        const cleanupFns = [];

        mockUseEffect.mockImplementation(f => {
            const hookReturn = f();
            if (typeof hookReturn === 'function') {
                cleanupFns.push(hookReturn);
            }
        });

        const testFn1 = jest.fn();
        const testFn2 = jest.fn();
        const wrapper = setup({
            record: {},
            loadRecordToView: testFn1,
            resetDoi: testFn2,
        });
        expect(wrapper.find('div').props().className).toBe('empty');
        expect(testFn1).toHaveBeenCalledWith(record.rek_pid);

        while (cleanupFns.length > 0) {
            cleanupFns.pop()();
        }

        expect(testFn2).toHaveBeenCalledTimes(1);
    });

    it('should render warnings when required', () => {
        const wrapper = setup({
            record: {
                ...record,
                fez_record_search_key_org_name: {
                    rek_org_name: 'Organisation',
                },
                fez_datastream_info: [],
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            'Please note:No open access datastreams are attached; DOI will be for metadata only.',
        );
    });

    it('should not generate unnecessary warnings', () => {
        const testRecord = {
            ...record,
            fez_record_search_key_org_name: {
                rek_org_name: 'The University of Queensland',
            },
            fez_record_search_key_oa_status: {
                rek_oa_status: openAccessFiles[0],
            },
            fez_datastream_info: [
                {
                    dsi_open_access: 1,
                    dsi_embargo_date: '2017-01-01',
                },
            ],
        };
        expect(getWarningMessage(testRecord)).toBe('');
    });

    it('should render error for unsupported types', () => {
        const wrapper1 = setup({
            record: publicationTypeListJournalArticle.data[0],
        });
        const renderedWarningMessage1 = shallow(wrapper1.find('Alert').props().message);
        expect(renderedWarningMessage1.text()).toBe('Error:Sorry, type Journal Article is not currently supported.');

        const wrapper2 = setup({
            record: {
                ...collectionRecord,
                rek_display_type_lookup: null,
            },
        });
        const renderedWarningMessage2 = shallow(wrapper2.find('Alert').props().message);
        expect(renderedWarningMessage2.text()).toBe('Error:Sorry, type Collection is not currently supported.');
    });

    it('should disable submit button for existing non-UQ DOI', () => {
        const wrapper = setup({
            record: {
                ...record,
                fez_record_search_key_doi: {
                    rek_doi: 'something',
                },
            },
        });
        expect(wrapper.find('#rek-doi-submit').props().disabled).toBe(true);
    });

    it('should enable submit button for existing UQ DOI', () => {
        const wrapper = setup({
            record: {
                ...record,
                fez_record_search_key_doi: {
                    rek_doi: `${DOI_ORG_PREFIX}/uql.2004.1`,
                },
            },
        });
        expect(wrapper.find('#rek-doi-submit').props().disabled).toBe(false);
    });

    it('should redirect to view page on form cancel', () => {
        const { location } = window;
        delete window.location;
        window.location = { assign: jest.fn(), reload: jest.fn() };

        const wrapper = setup({});
        wrapper
            .find('#rek-doi-cancel')
            .props()
            .onClick();
        expect(window.location.assign).toBeCalledWith(`http://localhost/view/${record.rek_pid}`);

        window.location = location;
    });

    it('should call handleSubmit on form submit', () => {
        const testFn = jest.fn();
        const record = {
            rek_pid: 'UQ:1234567',
        };
        const wrapper = setup({
            handleSubmit: testFn,
            record,
        });
        wrapper
            .find('#rek-doi-submit')
            .props()
            .onClick();
        expect(testFn).toHaveBeenCalledWith(record);
    });

    it('should show request progress dialogue', () => {
        const wrapper = setup({
            doiRequesting: true,
        });
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().testId).toBe('rek-doi-submit-status');
    });
});
