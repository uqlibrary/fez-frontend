import React from 'react';
import { shallow } from 'enzyme';

import { Doi, getErrorMessage, getWarningMessage, isArrayValid } from './Doi';

import publicationTypeListConferencePaper from 'mock/data/records/publicationTypeListConferencePaper';
import publicationTypeListJournalArticle from 'mock/data/records/publicationTypeListJournalArticle';
import publicationTypeListResearchReport from 'mock/data/records/publicationTypeListResearchReport';
import collectionRecord from 'mock/data/records/collectionRecord';
import publicationTypeListBookChapter from 'mock/data/records/publicationTypeListBookChapter';
import {
    DOI_CROSSREF_NAME,
    DOI_CROSSREF_PREFIX,
    DOI_DATACITE_NAME,
    PUBLICATION_TYPE_DATA_COLLECTION,
    UQ_FULL_NAME,
} from 'config/general';
import { rccDatasetCollection } from 'config/doi';

const confPaperRecord = {
    ...publicationTypeListConferencePaper.data[0],
    fez_record_search_key_doi: {
        rek_doi: DOI_CROSSREF_PREFIX,
    },
    fez_record_search_key_publisher: {
        rek_publisher: `Test Publisher, ${UQ_FULL_NAME}`,
    },
};
const journalArticleRecord = publicationTypeListJournalArticle.data[0];
const mockRecord = {
    ...publicationTypeListResearchReport.data[0],
    fez_record_search_key_publisher: {
        rek_publisher: `Test Publisher, ${UQ_FULL_NAME}`,
    },
};
const bookChapterRecord = {
    ...publicationTypeListBookChapter.data[0],
    fez_record_search_key_doi: {
        rek_doi: DOI_CROSSREF_PREFIX,
    },
    fez_record_search_key_publisher: {
        rek_publisher: `Test Publisher, ${UQ_FULL_NAME}`,
    },
};

jest.mock('react-router', () => ({
    useParams: jest.fn(() => ({ pid: mockRecord.rek_pid })),
}));

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        record: mockRecord,
        ...testProps,
    };

    return getElement(Doi, props, args);
};

describe('DOI component', () => {
    it('should render title with DOI', () => {
        const wrapper = setup({
            record: {
                ...mockRecord,
                fez_record_search_key_doi: {
                    rek_doi: 'Testing',
                },
            },
        });
        expect(wrapper.find('[data-testid="doi-page-title"]').text()).toBe(
            `Update DOI for ${mockRecord.rek_display_type_lookup} - ${mockRecord.rek_title}: ${mockRecord.rek_pid}`,
        );
    });

    it('should render title and enable submit button without DOI', () => {
        const wrapper = setup({});
        expect(wrapper.find('[data-testid="doi-page-title"]').text()).toBe(
            `Create DOI for ${mockRecord.rek_display_type_lookup} - ${mockRecord.rek_title}: ${mockRecord.rek_pid}`,
        );
        expect(wrapper.find('#rek-doi-submit').props().disabled).toBe(false);
    });

    it('should show loading message when record is loading', () => {
        const wrapper = setup({
            loadingRecordToView: true,
            record: null,
        });
        expect(wrapper.find('WithStyles(InlineLoader)').props().message).toBe('Loading work');
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
        expect(testFn1).toHaveBeenCalledWith(mockRecord.rek_pid);

        while (cleanupFns.length > 0) {
            cleanupFns.pop()();
        }

        expect(testFn2).toHaveBeenCalledTimes(1);
        mockUseEffect.mockRestore();
    });

    it('should render error for unsupported subtype', () => {
        const wrapper = setup({
            record: {
                ...confPaperRecord,
                rek_subtype: 'Published abstract',
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            'Error:Sorry, only the following subytypes are supported for Conference Paper: Fully published paper',
        );
    });

    it('should render error for book chapter without a parent book', () => {
        const wrapper = setup({
            record: {
                ...bookChapterRecord,
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            "Error:Sorry, this book chapter doesn't seem to belong to a existing book",
        );
    });

    it('should render error for book chapter with parent with missing nested relation', () => {
        const wrapper = setup({
            record: {
                ...bookChapterRecord,
                fez_record_search_key_isderivationof: [
                    {
                        rek_isderivationof_pid: 'UQ:173575',
                        rek_isderivationof: 'UQ:123456',
                        rek_isderivationof_order: 1,
                        rek_isderivationof_lookup: 'A Book',
                    },
                ],
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            "Error:Sorry, this book chapter doesn't seem to belong to a existing book",
        );
    });

    it('should render error for book chapter with parent with missing UQ DOI and UQ Publisher', () => {
        const wrapper = setup({
            record: {
                ...bookChapterRecord,
                fez_record_search_key_isderivationof: [
                    {
                        rek_isderivationof_pid: 'UQ:173575',
                        rek_isderivationof: 'UQ:123456',
                        rek_isderivationof_order: 1,
                        rek_isderivationof_lookup: 'A Book',
                        parent: {
                            rek_pid: 'UQ:123456',
                            rek_subtype: 'Edited Book',
                        },
                    },
                ],
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            'Error:The parent Book does not appear to be have an UQ DOI' +
                `The parent Book's Publisher should contain "${UQ_FULL_NAME}".`,
        );
    });

    it('should render error for book chapter with parent with missing UQ DOI and UQ Publisher', () => {
        const wrapper = setup({
            record: {
                ...bookChapterRecord,
                fez_record_search_key_isderivationof: [
                    {
                        rek_isderivationof_pid: 'UQ:173575',
                        rek_isderivationof: 'UQ:123456',
                        rek_isderivationof_order: 1,
                        rek_isderivationof_lookup: 'A Book',
                        parent: {
                            rek_pid: 'UQ:123456',
                            rek_subtype: 'Other',
                        },
                    },
                ],
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            'Error:Sorry, only the following subytypes are supported for the parent Book: Edited book' +
                'The parent Book does not appear to be have an UQ DOI' +
                `The parent Book's Publisher should contain "${UQ_FULL_NAME}".`,
        );
    });

    it('should render error for book chapter with parent with missing missing UQ DOI', () => {
        const wrapper = setup({
            record: {
                ...bookChapterRecord,
                fez_record_search_key_isderivationof: [
                    {
                        rek_isderivationof_pid: 'UQ:173575',
                        rek_isderivationof: 'UQ:123456',
                        rek_isderivationof_order: 1,
                        rek_isderivationof_lookup: 'A Book',
                        parent: {
                            rek_pid: 'UQ:123456',
                            rek_subtype: 'Edited Book',
                            fez_record_search_key_publisher: {
                                rek_publisher_pid: 'UQ:123456',
                                rek_publisher: `Test Publisher, ${UQ_FULL_NAME}`,
                            },
                        },
                    },
                ],
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe('Error:The parent Book does not appear to be have an UQ DOI');
    });

    it('should render error for book chapter with parent with missing missing UQ Publisher', () => {
        const wrapper = setup({
            record: {
                ...bookChapterRecord,
                fez_record_search_key_isderivationof: [
                    {
                        rek_isderivationof_pid: 'UQ:173575',
                        rek_isderivationof: 'UQ:123456',
                        rek_isderivationof_order: 1,
                        rek_isderivationof_lookup: 'A Book',
                        parent: {
                            rek_pid: 'UQ:123456',
                            rek_subtype: 'Edited Book',
                            fez_record_search_key_doi: {
                                rek_doi_pid: 'UQ:123456',
                                rek_doi: `${DOI_CROSSREF_PREFIX}/12345`,
                            },
                        },
                    },
                ],
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            `Error:The parent Book's Publisher should contain "${UQ_FULL_NAME}".`,
        );
    });

    it('should render error for RCC datasets', () => {
        const wrapper = setup({
            record: {
                ...mockRecord,
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                fez_record_search_key_ismemberof: [
                    {
                        rek_ismemberof: rccDatasetCollection,
                        rek_ismemberof_order: 1,
                    },
                ],
            },
        });

        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe('Error:RCC Datasets are not allowed.');
    });

    it('should flag required field with no data', () => {
        const testRecord = {
            ...confPaperRecord,
            fez_record_search_key_proceedings_title: {
                rek_proceedings_title: '',
            },
        };
        const renderedError = shallow(getErrorMessage(testRecord).errorMessage);
        expect(renderedError.text()).toBe('Error:Required field Proceedings title is either missing or invalid.');
    });

    it('should flag required field with empty array', () => {
        const record = {
            fez_record_search_key_issn: [],
        };
        const fieldConfig = {
            field: 'fez_record_search_key_issn',
            isRequired: true,
        };
        expect(isArrayValid(record, fieldConfig, () => {})).toBe(false);
    });

    it('should render error for missing full name of UQ', () => {
        const testRecord = {
            ...mockRecord,
            fez_record_search_key_publisher: {
                rek_publisher: 'UQ',
            },
        };
        const renderedError = shallow(getErrorMessage(testRecord).errorMessage);
        expect(renderedError.text()).toBe('Error:Publisher should contain "The University of Queensland".');
    });

    it('should render warning for invalid preview field', () => {
        const wrapper = setup({
            record: {
                ...mockRecord,
                fez_record_search_key_edition: {
                    rek_edition: '3rd',
                },
            },
        });
        const renderedWarningMessage = shallow(wrapper.find('Alert').props().message);
        expect(renderedWarningMessage.text()).toBe(
            'Please note:Field Edition has an invalid value, e.g. 3rd or 3rd edn instead of 3; it will be omitted from submission.',
        );
    });

    it('should not generate unnecessary warnings', () => {
        expect(getWarningMessage(mockRecord)).toBe('');
    });

    it('should render error for unsupported types', () => {
        const wrapper1 = setup({
            record: journalArticleRecord,
        });
        const renderedError1 = shallow(wrapper1.find('Alert').props().message);
        expect(renderedError1.text()).toBe('Error:Sorry, type Journal Article is not currently supported.');

        const wrapper2 = setup({
            record: {
                ...collectionRecord,
                rek_display_type_lookup: null,
            },
        });
        const renderedError2 = shallow(wrapper2.find('Alert').props().message);
        expect(renderedError2.text()).toBe('Error:Sorry, type Collection is not currently supported.');
    });

    it('should disable submit button for existing non-UQ DOI', () => {
        const wrapper = setup({
            record: {
                ...confPaperRecord,
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
                ...mockRecord,
                fez_record_search_key_doi: {
                    rek_doi: `${DOI_CROSSREF_PREFIX}/uql.2004.1`,
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
        expect(window.location.assign).toBeCalledWith(`http://localhost/view/${mockRecord.rek_pid}`);

        window.location = location;
    });

    it('should call handleSubmit on form submit', () => {
        const testFn = jest.fn();
        const record = {
            rek_pid: 'UQ:1234567',
            rek_display_type: 174,
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

    it('should show request progress dialogue for Crossref DOI', () => {
        const wrapper = setup({
            doiRequesting: true,
        });
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().testId).toBe('rek-doi-submit-status');
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().message).toEqual(
            `Upload to ${DOI_CROSSREF_NAME} is being queued.`,
        );
    });

    it('should show request completed dialogue for Crossref DOI', () => {
        const wrapper = setup({
            doiUpdated: true,
        });
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().testId).toBe('rek-doi-submit-status');
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().message).toEqual(
            `Upload to ${DOI_CROSSREF_NAME} has been queued successfully.`,
        );
    });

    it('should contain a Crossref related confirmation message', () => {
        const wrapper = setup({
            doiUpdated: true,
        });
        expect(wrapper.find('[testId="rek-doi-confirmation-box"]').props().locale.confirmationMessage).toEqual(
            `The request to create/update DOI has been submitted to ${DOI_CROSSREF_NAME}. You will receive an email indicating whether the DOI is successfully generated.`,
        );
    });

    it('should show request progress dialogue for DataCite DOI', () => {
        const wrapper = setup({
            doiRequesting: true,
            record: {
                ...confPaperRecord,
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
        });
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().testId).toBe('rek-doi-submit-status');
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().message).toEqual(
            `Upload to ${DOI_DATACITE_NAME} is being submitted.`,
        );
    });

    it('should show request completed dialogue for DataCite DOI', () => {
        const wrapper = setup({
            doiUpdated: true,
            record: {
                ...confPaperRecord,
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
        });
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().testId).toBe('rek-doi-submit-status');
        expect(wrapper.find('[testId="rek-doi-submit-status"]').props().message).toEqual(
            `Upload to ${DOI_DATACITE_NAME} has been submitted successfully.`,
        );
    });

    it('should contain a DataCite related confirmation message', () => {
        const wrapper = setup({
            doiUpdated: true,
            record: {
                ...confPaperRecord,
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
            },
        });
        expect(wrapper.find('[testId="rek-doi-confirmation-box"]').props().locale.confirmationMessage).toEqual(
            `The DOI has been created/updated in ${DOI_DATACITE_NAME}`,
        );
    });
});
