import React from 'react';
import FixRecord from './FixRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
import Immutable from 'immutable';
import {
    render,
    WithReduxStore,
    WithRouter,
    fireEvent,
    screen,
    assertEnabled,
    assertDisabled,
    expectApiRequestToMatchSnapshot,
    addFilesToFileUploader,
    setFileUploaderFilesToClosedAccess,
    api,
    assertInstanceOfFile,
} from 'test-utils';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import validationErrors from '../../../locale/validationErrors';
import forms from '../../../locale/forms';
import { HIDE_POSSIBLE_RECORD_API } from '../../../repositories/routes';
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
    props.publication = props.publication || null;
    props.author = props.hasOwnProperty('author') ? props.author : { aut_id: 410 };
    const state = Immutable.Map({
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
    });

    return render(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <FixRecord />
            </WithRouter>
        </WithReduxStore>,
    );
}

/**
 * Given the complex nature of the actions that handle the data that get submitted by the form
 * being tested, the tests below takes a functional approach, relying on real action methods
 * instead of mocks. This is to minimise false test positives, ensure payload correctness, etc.
 */
describe('Component FixRecord', () => {
    const isDebugging = false;
    const waitForOptions = { timeout: isDebugging ? 120000 : 1000 };
    const switchToUnclaimMode = () => {
        fireEvent.mouseDown(screen.getByTestId('fix-action-select'));
        fireEvent.click(screen.getByText(/I am not the author/i));
    };
    const switchToFixMode = () => {
        fireEvent.mouseDown(screen.getByTestId('fix-action-select'));
        fireEvent.click(screen.getByText(/I am the author/i));
    };

    const assertValidationErrorSummary = async () =>
        await waitFor(() => screen.getByText(forms.forms.fixPublicationForm.validationAlert.message), waitForOptions);

    const assertNoValidationErrorSummary = async () => {
        await waitForElementToBeRemoved(
            () => screen.getByText(forms.forms.fixPublicationForm.validationAlert.message),
            waitForOptions,
        );
        assertEnabled(screen.getByTestId('fix-submit'));
    };

    const assertFixedRecordConfirmationMessage = async () =>
        await waitFor(() => screen.getByText(forms.forms.fixPublicationForm.successAlert.message), waitForOptions);

    const assertServerErrorMessage = async () =>
        await waitFor(
            () =>
                screen.getByText(new RegExp('Error has occurred during request and request cannot be processed.', 'i')),
            waitForOptions,
        );

    const submitForm = async () => {
        assertEnabled(screen.getByTestId('fix-submit'));
        fireEvent.click(screen.getByTestId('fix-submit'));
        await waitForElementToBeRemoved(
            () => screen.getByText(forms.forms.fixPublicationForm.progressAlert.message),
            waitForOptions,
        );
    };

    beforeEach(() => {
        mockUseNavigate.mockReset();
        mockParams = { pid: mockRecordToFix.rek_pid };
    });

    it('should render loader when author is loading', () => {
        const { container } = setup({ author: null });
        expect(container).toMatchSnapshot();
    });

    it('should render loader when record is loading', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should redirect if author not linked', () => {
        setup({ publication: mockRecordToFix, author: { aut_id: 1001 } });
        expect(mockUseNavigate).toHaveBeenCalled();
    });

    it('should render work not found page if record can not be loaded', async () => {
        const { getByText } = setup();
        await waitFor(() => getByText('Work not found'), waitForOptions);
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const { container } = setup({ publication: mockRecordToFix });
        expect(container).toMatchSnapshot();
    });

    it('should render fix record form', () => {
        const { container } = setup({ publication: mockRecordToFix });
        expect(container).toMatchSnapshot();
    });

    it('should render unclaim form', async () => {
        const { container } = setup({ publication: mockRecordToFix });

        await assertValidationErrorSummary();
        switchToUnclaimMode();
        await assertNoValidationErrorSummary();

        expect(container).toMatchSnapshot();
    });

    describe('form submission', () => {
        const pid = mockRecordToFix.rek_pid;
        const fileMock = ['test.png'];
        const existingRecordUrl = api.url.records.get(pid);
        const recordIssuesUrl = api.url.records.issues(pid);
        const hideRecordUrl = HIDE_POSSIBLE_RECORD_API().apiUrl;

        const mockPatchRecordApiCall = () => api.mock.records.update({ pid });
        const mockUnclaimApiCalls = () => {
            mockPatchRecordApiCall()
                .instance.onPost(hideRecordUrl)
                .replyOnce(200);
        };
        const mockFixRecordApiCall = () => api.mock.records.issues({ pid });

        beforeEach(() => api.reset());
        afterEach(() => api.reset());

        describe('payload', () => {
            it('should submit unclaim data', async () => {
                mockUnclaimApiCalls();
                setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToUnclaimMode();
                await assertNoValidationErrorSummary();
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                expectApiRequestToMatchSnapshot('patch', existingRecordUrl);
                expectApiRequestToMatchSnapshot('post', hideRecordUrl);
            });

            it('should submit fix record data', async () => {
                mockFixRecordApiCall();
                const { getByTestId, getByText } = setup({
                    publication: { ...mockRecordToFix, fez_record_search_key_content_indicator: null },
                });

                await assertValidationErrorSummary();
                switchToFixMode();
                expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
                assertDisabled('fix-submit');
                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await assertNoValidationErrorSummary();
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                expectApiRequestToMatchSnapshot('post', recordIssuesUrl);
            });

            it('should submit fix record data with new content indicator and file', async () => {
                const newContentIndicator = 'Case Study';
                mockPatchRecordApiCall();
                mockFixRecordApiCall().files.upload();
                const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToFixMode();
                expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
                assertDisabled('fix-submit');
                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                fireEvent.mouseDown(getByTestId('rek-content-indicator-select'));
                fireEvent.click(getByText(newContentIndicator));
                addFilesToFileUploader(fileMock);
                await setFileUploaderFilesToClosedAccess(fileMock);
                await assertNoValidationErrorSummary();
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                expectApiRequestToMatchSnapshot('post', recordIssuesUrl);
                expectApiRequestToMatchSnapshot('patch', existingRecordUrl);
                expectApiRequestToMatchSnapshot('put', api.url.files.put, assertInstanceOfFile);
            });
        });

        describe('post submission', () => {
            it('should display confirmation box after successful unclaim and go back to previous page', async () => {
                mockUnclaimApiCalls();
                const { getByTestId } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToUnclaimMode();
                await assertNoValidationErrorSummary();
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                fireEvent.click(getByTestId('cancel-dialog-box'));
                expect(mockUseNavigate).toBeCalledTimes(1);
                expect(mockUseNavigate).toBeCalledWith(pathConfig.records.mine);
            });

            it('should display confirmation box after successful unclaim and go to my works', async () => {
                mockUnclaimApiCalls();
                const { getByTestId } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToUnclaimMode();
                await assertNoValidationErrorSummary();
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                fireEvent.click(getByTestId('confirm-dialog-box'));
                expect(mockUseNavigate).toBeCalledTimes(1);
                expect(mockUseNavigate).toBeCalledWith(pathConfig.records.mine);
            });

            it('should display confirmation box after fix work successful submission and go to dashboard', async () => {
                mockFixRecordApiCall();
                const { getByTestId, getByText } = setup({
                    publication: { ...mockRecordToFix, fez_record_search_key_content_indicator: null },
                });

                await assertValidationErrorSummary();
                switchToFixMode();
                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await assertNoValidationErrorSummary();
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                fireEvent.click(getByTestId('cancel-dialog-box'));
                expect(mockUseNavigate).toBeCalledWith(pathConfig.dashboard);
            });
        });

        describe('error handling', () => {
            it('should handle server error when unclaiming record', async () => {
                mockApi.onPatch(existingRecordUrl).replyOnce(500);

                setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToUnclaimMode();

                await assertNoValidationErrorSummary();
                await submitForm();

                await assertServerErrorMessage();
                assertEnabled('fix-submit');
            });

            it('should handle allow retries after a server error when unclaiming record', async () => {
                mockApi
                    .onPatch(existingRecordUrl)
                    .replyOnce(500)
                    .onPatch(existingRecordUrl)
                    .replyOnce(200)
                    .onPost(HIDE_POSSIBLE_RECORD_API().apiUrl)
                    .replyOnce(200);

                setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToUnclaimMode();

                await assertNoValidationErrorSummary();
                await submitForm();

                await assertServerErrorMessage();
                assertEnabled('fix-submit');

                await submitForm();
                await assertFixedRecordConfirmationMessage();
            });

            it('should handle server error when fixing record', async () => {
                mockApi.onPatch(existingRecordUrl).replyOnce(500);

                const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToFixMode();

                expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
                assertDisabled('fix-submit');

                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await assertNoValidationErrorSummary();

                await submitForm();
                await assertServerErrorMessage();
                assertEnabled('fix-submit');
            });

            it('should allow retries after a server error when fixing record', async () => {
                mockApi
                    .onPost(recordIssuesUrl)
                    .replyOnce(500)
                    .onPost(recordIssuesUrl)
                    .replyOnce(200);

                const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                switchToFixMode();

                expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
                assertDisabled('fix-submit');

                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await assertNoValidationErrorSummary();

                await submitForm();
                await assertServerErrorMessage();

                await submitForm();
                await assertFixedRecordConfirmationMessage();
            });
        });
    });
});
