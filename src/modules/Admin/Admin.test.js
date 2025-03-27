import React from 'react';
import AdminContainer from './components/AdminContainer';
import * as mock from 'mock/data';
import { record } from 'mock/data/records';
import Immutable from 'immutable';
import locale from 'locale/pages';

import {
    rtlRender,
    WithReduxStore,
    WithRouter,
    userEvent,
    addFilesToFileUploader,
    setFileUploaderFilesSecurityPolicy,
    screen,
    waitForElementToBeRemoved,
    expectApiRequestToMatchSnapshot,
    api,
    assertInstanceOfFile,
    waitFor,
    selectDropDownOption,
    clearAndType,
    sortObjectProps,
} from 'test-utils';

function setup(testProps = {}, testState = {}, renderer = rtlRender) {
    const props = {
        createMode: false,
        ...testProps,
    };
    const state = {
        accountReducer: {
            account: {
                account: mock.accounts.uqstaff,
            },
            author: {
                aut_id: 111,
            },
            authorDetails: {
                username: 'Test User',
            },
        },
        viewRecordReducer: {
            recordToView: record,
            loadingRecordToView: false,
            recordToViewError: null,
            isRecordLocked: false,
            isDeleted: false,
            isDeletedVersion: false,
            isJobCreated: false,
            error: null,
            ...testState.viewRecordReducer,
        },
        organisationalUnitsReducer: {
            organisationUnits: [
                {
                    org_id: 1062,
                    org_extdb_name: 'hr',
                    org_extdb_id: null,
                    org_ext_table: null,
                    org_title: '!NON-HERDC',
                    org_is_current: 1,
                    org_desc: null,
                    org_image_filename: null,
                },
                {
                    org_id: 877,
                    org_extdb_name: 'hr',
                    org_extdb_id: 319,
                    org_ext_table: null,
                    org_title: 'Aboriginal and Torres Strait Islander Studies Unit',
                    org_is_current: 1,
                    org_desc: null,
                    org_image_filename: null,
                },
            ],
            organisationUnitsLoaded: true,
            organisationUnitsLoading: false,
            organisationUnitsFailed: false,
        },
        suggestedOrganisationalUnitsReducer: {
            suggestedAuthorId: 7626877,
            suggestedOrganisationUnits: [],
            suggestedOrganisationUnitsLoaded: true,
            suggestedOrganisationUnitsLoading: false,
            suggestedOrganisationUnitsFailed: false,
        },
        ...testState,
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map({ ...state })}>
            <WithRouter>
                <AdminContainer {...props} />
            </WithRouter>
            ,
        </WithReduxStore>,
    );
}
// global.console.error = jest.fn();
// global.console.warn = jest.fn();

describe('form submission', () => {
    const timeout = 60000 * 5;
    const pid = record.rek_pid;
    const fileMock = ['myTestImage.png'];

    const submitForm = async () => {
        await userEvent.click(screen.getByTestId('submit-admin'));
        screen.queryByText(locale.pages.edit.alerts.progressAlert.message) &&
            (await waitForElementToBeRemoved(() => screen.queryByText(locale.pages.edit.alerts.progressAlert.message)));
    };

    beforeEach(() => {
        api.request.history.reset();
    });
    afterEach(() => {
        api.mock.reset();
    });

    describe('payload', () => {
        it(
            'create a journal article',
            async () => {
                // Note, although the FE will consider this record as being edited, when it is submitted,
                // the submit handler will determine it to be a create action. This does not matter for this test.
                // The purpose of the test is only to ensure the API request matches the snapshot that was
                // originally taken on Master before RHF went live.
                api.mock.records
                    .create({
                        pid,
                        data: record,
                        once: false,
                    })
                    .update({
                        pid,
                        data: record,
                        once: false,
                    })
                    .files.upload();

                // update base record with additional field values
                const recordToView = {
                    ...record,
                    fez_record_search_key_advisory_statement: {
                        rek_advisory_statement_id: 1,
                        rek_advisory_statement_pid: pid,
                        rek_advisory_statement_xsdmf_id: null,
                        rek_advisory_statement: '<p>Test advisory statement</p>',
                    },
                    fez_internal_notes: {
                        ain_id: 1,
                        ain_pid: pid,
                        ain_detail: '<p>Test admin notes</p>',
                    },
                    fez_record_search_key_notes: {
                        rek_notes_id: 1,
                        rek_notes_pid: pid,
                        rek_notes_xsdmf_id: null,
                        rek_notes: '<p>Test public notes</p>',
                    },
                    fez_record_search_key_author: [
                        ...record.fez_record_search_key_author,
                        {
                            rek_author_id: 37743157,
                            rek_author_pid: pid,
                            rek_author_xsdmf_id: null,
                            rek_author: 'Test author',
                            rek_author_order: 7,
                        },
                    ],
                    fez_record_search_key_author_id: [
                        ...record.fez_record_search_key_author_id,
                        {
                            rek_author_id_id: 37944514,
                            rek_author_id_pid: pid,
                            rek_author_id_xsdmf_id: null,
                            rek_author_id: 7626877,
                            rek_author_id_order: 7,
                            author: {
                                aut_id: 7626877,
                                aut_orcid_id: null,
                                aut_scopus_id: null,
                                aut_researcher_id: null,
                                aut_title: 'Mr',
                                aut_org_username: 'uqaabuay',
                                aut_student_username: null,
                            },
                            rek_author_id_lookup: 'Abu-Aysha, Ahmad',
                        },
                    ],
                };

                const { getByTestId } = setup(
                    {},
                    {
                        viewRecordReducer: {
                            recordToView,
                        },
                    },
                );

                // ADMIN
                await selectDropDownOption('rek-herdc-code-select', 'A1 Authored Book (Research)');
                await selectDropDownOption('rek-herdc-status-select', 'Confirmed Code');
                await selectDropDownOption('rek-refereed-source-select', 'Thomson Reuters');
                await selectDropDownOption('rek-oa-status-select', 'Link (no DOI)');
                await selectDropDownOption('rek-oa-status-type-select', 'Green');

                // add a license
                await selectDropDownOption('rek-license-select', 'Permitted Re-use with Acknowledgement');

                // BIBLIOGRAPHIC
                await userEvent.type(getByTestId('rek-journal-name-input'), ' test');
                await userEvent.type(getByTestId('rek-place-of-publication-input'), ' test');
                await userEvent.type(getByTestId('rek-publisher-input'), ' test');

                await userEvent.type(getByTestId('rek-volume-number-input'), '1');
                await userEvent.type(getByTestId('rek-issue-number-input'), '1');
                await userEvent.type(getByTestId('rek-article-number-input'), '1');

                await userEvent.type(getByTestId('rek-start-page-input'), '1');
                await userEvent.type(getByTestId('rek-end-page-input'), '1');
                await userEvent.type(getByTestId('rek-total-pages-input'), '1');

                // some branches, for some reason, won't reliably clear rek-date-day-input
                // when using 'clearAndType' alone. Seems to work if we manually clear once,
                // and then run 'clearAndType' again.
                await userEvent.clear(screen.getByTestId('rek-date-day-input'));
                await clearAndType('rek-date-day-input', '1');
                await selectDropDownOption('rek-date-month-select', 'January');
                await clearAndType('rek-date-year-input', '2011');
                await clearAndType('rek-date-available-input', '2011');

                // add an ISBN
                await userEvent.type(getByTestId('rek-isbn-input'), '978-3-16-148410-0{enter}');

                // adjust order of an ISSN
                await userEvent.click(getByTestId('rek-issn-list-row-1-move-up'));

                // adjust order of a keyword
                await userEvent.click(getByTestId('rek-keywords-list-row-1-move-up'));
                // delete 3rd keyword
                await userEvent.click(getByTestId('rek-keywords-list-row-2-delete'));
                await userEvent.click(getByTestId('confirm-rek-keywords-list-row-2-delete'));

                // adjust order of a subject
                await userEvent.click(getByTestId('rek-subjects-list-row-0-move-down'));
                // delete 3rd subject
                await userEvent.click(getByTestId('rek-subjects-list-row-2-delete'));
                await userEvent.click(getByTestId('confirm-rek-subjects-list-row-2-delete'));

                // AUTHORS
                // update affiliation
                await userEvent.click(getByTestId('expandPanelIcon-7626877'));
                await waitFor(() => expect(getByTestId('detailPanel-7626877')).toBeInTheDocument());
                await userEvent.click(getByTestId('affiliationEditBtn-7626877'));
                await waitFor(() => expect(getByTestId('orgSelect-add-input')).toBeInTheDocument());

                await selectDropDownOption('orgSelect-add-input', '!NON-HERDC');

                await waitFor(() => expect(getByTestId('affiliationSaveBtn')).not.toBeDisabled());
                await userEvent.click(getByTestId('affiliationSaveBtn'));

                // IDENTIFIERS
                await userEvent.type(getByTestId('rek-doi-input'), '1');
                await userEvent.type(getByTestId('rek-isi-loc-input'), '1');
                await userEvent.type(getByTestId('rek-scopus-id-input'), '1');
                await userEvent.type(getByTestId('rek-pubmed-id-input'), '1');
                await userEvent.type(getByTestId('rek-pubmed-central-id-input'), '1');
                await selectDropDownOption('rek-wok-doc-type-select', '7 - Bibliography');
                await selectDropDownOption('rek-scopus-doc-type-select', 'ab - Abstract Report');
                await selectDropDownOption('rek-pubmed-doc-type-select', 'Editorial');

                // adjust order of a link
                await userEvent.click(getByTestId('rek-link-list-row-1-move-up'));

                // GRANTS
                // adjust order of a grant
                await userEvent.click(getByTestId('grant-list-move-down=0'));

                // NOTES
                // tick attribution checkbox
                await userEvent.click(getByTestId('attributionIncomplete-input'));

                // FILES
                // adjust order of am existing attachment
                await userEvent.click(getByTestId('order-down-file-0'));

                // add new file
                await addFilesToFileUploader(fileMock);
                await setFileUploaderFilesSecurityPolicy(fileMock, 'Administrators');

                // select a sensitive handling note
                await selectDropDownOption(
                    'rek-sensitive-handling-note-id-select',
                    'Indigenous/First Nations people should be aware that this output is about men’s business.',
                );

                // SECURITY
                // override security
                await userEvent.click(getByTestId('rek-security-inherited-input'));

                // select a work override
                await selectDropDownOption('rek-security-policy-select', 'Administrators');

                // change security of a file to test
                await selectDropDownOption('dsi-security-policy-5-select', 'Public');

                await submitForm();
                expectApiRequestToMatchSnapshot('post', api.url.files.create, null, data =>
                    sortObjectProps(JSON.parse(data)),
                );
                expectApiRequestToMatchSnapshot('put', api.url.files.put, assertInstanceOfFile);
                expectApiRequestToMatchSnapshot('patch', api.url.records.get(pid), data => data.includes(fileMock[0])); // datastream updates
            },
            timeout,
        );
    });
});
