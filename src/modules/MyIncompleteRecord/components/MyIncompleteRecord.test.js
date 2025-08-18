import React from 'react';
import { default as locale } from 'locale/global';
import { default as pageLocale } from '../locale';
import { default as alertLocale } from 'locale/publicationForm';
import {
    render,
    WithReduxStore,
    WithRouter,
    screen,
    assertEnabled,
    userEvent,
    mockUseForm,
    waitForTextToBeRemoved,
    waitForText,
    waitToBeDisabled,
    waitToBeEnabled,
    assertDisabled,
    addFilesToFileUploader,
    setFileUploaderFilesToClosedAccess,
    api,
    expectApiRequestToMatchSnapshot,
    assertInstanceOfFile,
} from 'test-utils';
import { waitFor } from '@testing-library/dom';

jest.mock('../../../context');

import MyIncompleteRecord from './MyIncompleteRecord';
import { incompleteNTRORecordUQ352045 } from '../../../mock/data';
import validationErrors from '../../../locale/validationErrors';
import { pathConfig } from '../../../config';

const mockUseNavigate = jest.fn();
let mockParams;
/* eslint-disable react/prop-types */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => mockParams,
}));

function setup(props = {}) {
    props.author = props.hasOwnProperty('author') ? props.author : { aut_id: 79324 };
    const state = {
        fixRecordReducer: {
            recordToFix: props.publication,
            loadingRecordToFix: props.hasOwnProperty('loadingRecordToFix')
                ? props.loadingRecordToFix
                : !props.publication,
        },
        accountReducer: {
            author: props.author,
            accountAuthorLoading: props.hasOwnProperty('accountAuthorLoading')
                ? props.accountAuthorLoading
                : !props.author,
        },
    };

    return render(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <MyIncompleteRecord
                    disableDeleteAllGrants={props.disableDeleteAllGrants}
                    disableInitialGrants={props.disableInitialGrants}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('MyIncompleteRecord', () => {
    const isDebugging = false;
    const waitForOptions = { timeout: isDebugging ? 120000 : 2000 };
    const cancelButtonId = 'incomplete-record-button-cancel';
    const submitButtonId = 'incomplete-record-button-submit';

    const mockRichEditorFieldValues = impactStatement =>
        mockUseForm((props, original) => {
            props.values.impactStatement = impactStatement !== undefined ? impactStatement : 'impact statement';
            return original(props);
        });

    const assertValidationErrorSummary = async () => {
        await waitForText(/Form cannot be submitted until all fields are valid/, waitForOptions);
        assertEnabled(cancelButtonId);
        await waitToBeDisabled(submitButtonId);
    };

    const assertNoValidationErrorSummary = async () => {
        await waitForTextToBeRemoved(alertLocale.validationAlert.message, waitForOptions);
        assertEnabled(cancelButtonId);
        await waitToBeEnabled(submitButtonId);
    };

    const fillUpForm = async ({ waitForFieldErrorToBeCleared, waitForValidationSummaryRemoval }) => {
        await userEvent.click(screen.getByTestId('rek-significance-select'));
        await userEvent.click(screen.queryByText('Major'));
        waitForFieldErrorToBeCleared && (await waitForTextToBeRemoved('Scale/Significance of work is required'));

        await userEvent.click(screen.getByTestId('rek-audience-size-select'));
        await userEvent.click(screen.queryByText('100 - 500'));
        waitForFieldErrorToBeCleared && (await waitForTextToBeRemoved('Audience size is required'));

        await userEvent.click(screen.getByTestId('rek-quality-indicator-select'));
        await userEvent.click(screen.queryByText('Disseminated via nationally recognised outlet or entity'));
        await userEvent.tab();
        waitForFieldErrorToBeCleared && (await waitForTextToBeRemoved('Quality indicator is required'));

        await userEvent.click(screen.getByTestId('rek-author-list-row-0-edit'));
        await userEvent.click(screen.getByTestId('org-affiliation-select'));
        await userEvent.click(screen.queryByText('UQ'));
        await userEvent.click(screen.getByRole('button', { name: 'Change Details' }));
        waitForFieldErrorToBeCleared &&
            (await waitForTextToBeRemoved('Author affiliation rows marked with red are required'));

        const mockFile = ['myTestImage.png'];
        await addFilesToFileUploader(mockFile);
        await setFileUploaderFilesToClosedAccess(mockFile);
        waitForFieldErrorToBeCleared && (await waitForTextToBeRemoved('File submission to be completed'));

        waitForValidationSummaryRemoval && (await assertNoValidationErrorSummary());
    };

    const submitForm = async () => await userEvent.click(screen.getByTestId(submitButtonId));

    let mockRecordToFix = incompleteNTRORecordUQ352045;
    beforeEach(() => {
        mockParams = { pid: mockRecordToFix.rek_pid };
        mockRecordToFix = {
            ...incompleteNTRORecordUQ352045,
            fez_record_search_key_author: [
                {
                    ...incompleteNTRORecordUQ352045.fez_record_search_key_author[1],
                    rek_author_order: 1,
                },
            ],
            fez_record_search_key_author_id: [
                {
                    ...incompleteNTRORecordUQ352045.fez_record_search_key_author_id[1],
                    rek_author_id_order: 1,
                },
            ],
            fez_datastream_info: [],
            fez_record_search_key_file_attachment_name: [],
        };

        jest.restoreAllMocks();
        mockSessionApi.resetHandlers();
        mockApi.resetHandlers();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        mockSessionApi.resetHandlers();
        mockApi.resetHandlers();
    });

    describe('rendering', () => {
        it('should render 404 page for unexisting record', async () => {
            jest.spyOn(require('actions/fixRecord'), 'loadRecordToFix').mockImplementationOnce(() => ({
                type: 'FIX_RECORD_LOAD_FAILED',
            }));
            setup();
            await waitForText(/Work not found/i, waitForOptions);
        });

        it('should render loader when author is loading', async () => {
            setup({ author: null });
            await waitForText(pageLocale.loadingMessage, waitForOptions);
        });

        it('should render loader when record is loading', async () => {
            setup();
            await waitForText(pageLocale.loadingMessage, waitForOptions);
        });

        it('should redirect if author not linked', () => {
            setup({ publication: mockRecordToFix, author: { aut_id: 404 } });
            expect(mockUseNavigate).toHaveBeenCalledWith(-1);
        });
    });

    describe('navigation', () => {
        it('should navigate to my incomplete records page', async () => {
            const { getByTestId } = setup({
                publication: {
                    ...mockRecordToFix,
                    // for cc
                    fez_record_search_key_author_affiliation_name: [
                        {
                            rek_author_affiliation_name: locale.global.orgTitle,
                            rek_author_affiliation_name_order: 1,
                        },
                    ],
                    fez_record_search_key_author_affiliation_type: [
                        {
                            rek_author_affiliation_type: 453989,
                            rek_author_affiliation_type_order: 1,
                        },
                    ],
                    fez_record_search_key_language: [],
                },
            });
            await userEvent.click(getByTestId(cancelButtonId));

            expect(!!pathConfig.records.incomplete.length).toBeTruthy();
            expect(mockUseNavigate).toHaveBeenCalledWith(pathConfig.records.incomplete);
        });
    });

    describe('validation', () => {
        it('should display error summary according to invalid fields', async () => {
            setup({ publication: mockRecordToFix });
            await assertValidationErrorSummary();

            await waitForText('Scale/Significance of work is required');
            await waitForText('Creator research statement is required');
            await waitForText('Audience size is required');
            await waitForText('Quality indicator is required');
            await waitForText('Author affiliation rows marked with red are required');

            await fillUpForm({ waitForFieldErrorToBeCleared: true });
        });

        it('should display error summary according to invalid rich editor fields', async () => {
            mockRichEditorFieldValues();
            const { queryByText } = setup({ publication: mockRecordToFix });
            await assertValidationErrorSummary();

            expect(queryByText('Creator research statement is required')).not.toBeInTheDocument();
        });

        it('should display grant editor field error in error summary', async () => {
            const { getByTestId, getAllByText } = setup({ publication: mockRecordToFix });
            await assertValidationErrorSummary();

            await userEvent.type(getByTestId('rek-grant-agency-input'), 'grant');
            await waitFor(() => getAllByText(validationErrors.validationErrorsSummary.grants)[0], waitForOptions);
        });

        it('should hide Scale/Significance field when already set together with creator contribution statement != "Missing"', async () => {
            const { queryByText } = setup({
                publication: {
                    ...mockRecordToFix,
                    rek_formatted_abstract: undefined,
                    fez_record_search_key_significance: [
                        {
                            rek_significance: 454026,
                            rek_significance_lookup: 'Major',
                            rek_significance_order: 1,
                        },
                    ],
                    fez_record_search_key_creator_contribution_statement: [
                        {
                            rek_creator_contribution_statement: 'other',
                            rek_creator_contribution_statement_order: 1,
                        },
                    ],
                    // for cc
                    fez_record_search_key_grant_agency: [
                        {
                            rek_grant_agency: 'SERB, Department of Science and Technology, Government of India',
                        },
                        {
                            rek_grant_agency: 'ARDC',
                        },
                    ],
                    fez_record_search_key_grant_id: [
                        {
                            rek_grant_id: 'MC_UU_12013/4',
                        },
                        {
                            rek_grant_id: null,
                        },
                    ],
                    fez_record_search_key_grant_agency_type: [
                        {
                            rek_grant_agency_type: 454045,
                        },
                        {
                            rek_grant_agency_type: null,
                        },
                    ],
                    fez_datastream_info: [
                        {
                            dsi_dsid: 'test.mp3',
                            dsi_mimetype: 'audio/mpeg',
                            dsi_state: 'A',
                            dsi_size: 21457982,
                        },
                    ],
                    fez_record_search_key_file_attachment_name: [
                        {
                            rek_file_attachment_name: 'test.mp3',
                            rek_file_attachment_name_order: 1,
                        },
                    ],
                },
            });
            await assertValidationErrorSummary();

            expect(queryByText('Scale/Significance of work is required')).not.toBeInTheDocument();
        });
    });

    describe('form submission', () => {
        describe('payload', () => {
            it('all fields data', async () => {
                const pid = mockRecordToFix.rek_pid;
                api.mock.records
                    .update({ pid })
                    .issues({ pid })
                    .files.upload();

                mockRichEditorFieldValues();
                const { getByTestId } = setup({ publication: mockRecordToFix });
                await assertValidationErrorSummary();
                await fillUpForm({ waitForValidationSummaryRemoval: true });
                await userEvent.type(getByTestId('comments-input'), 'comments');
                await submitForm();
                assertDisabled(submitButtonId);
                await waitForText(pageLocale.successWorkflowConfirmation.confirmationTitle, waitForOptions);

                expectApiRequestToMatchSnapshot('patch', api.url.records.update(pid));
                expectApiRequestToMatchSnapshot('post', api.url.records.issues(pid));
                expectApiRequestToMatchSnapshot('put', api.url.files.put, assertInstanceOfFile);
            });
        });

        describe('post submission', () => {
            it('should navigate to dashboard after form submission', async () => {
                const pid = mockRecordToFix.rek_pid;
                api.mock.records
                    .update({ pid })
                    .issues({ pid })
                    .files.upload();

                mockRichEditorFieldValues();
                const { getByTestId } = setup({ publication: mockRecordToFix });
                await fillUpForm({ waitForValidationSummaryRemoval: true });
                await submitForm();
                await waitForText(pageLocale.successWorkflowConfirmation.confirmationTitle, waitForOptions);

                await userEvent.click(getByTestId('confirm-submit-succeeded'));
                expect(!!pathConfig.dashboard.length).toBeTruthy();
                expect(mockUseNavigate).toHaveBeenCalledWith(pathConfig.dashboard);
            });
        });

        describe('error handling', () => {
            it('should display server error when it fails to save the record', async () => {
                const pid = mockRecordToFix.rek_pid;
                api.mock.records.update({ pid, status: 500 });

                mockRichEditorFieldValues();
                setup({ publication: mockRecordToFix });
                await assertValidationErrorSummary();
                await fillUpForm({ waitForValidationSummaryRemoval: true });
                await submitForm();
                assertDisabled(submitButtonId);

                await waitForText(/Error has occurred/i, waitForOptions);
                assertEnabled(submitButtonId);
            });

            it('should display server error when it fails to upload file', async () => {
                const pid = mockRecordToFix.rek_pid;
                api.mock.records
                    .update({ pid })
                    .issues({ pid })
                    .files.presignedUrl({ status: 500, once: false });

                mockRichEditorFieldValues();
                setup({ publication: mockRecordToFix });
                await assertValidationErrorSummary();
                await fillUpForm({ waitForValidationSummaryRemoval: true });
                await submitForm();
                assertDisabled(submitButtonId);

                await waitForText(/Error has occurred/i, waitForOptions);
                assertEnabled(submitButtonId);
            });
        });
    });
});
