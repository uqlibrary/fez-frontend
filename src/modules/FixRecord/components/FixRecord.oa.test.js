import React from 'react';
import FixRecord from './FixRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
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
import { pathConfig } from '../../../config';

const mockUseNavigate = jest.fn();
let mockParams;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => mockParams,
}));

function setup(props = {}) {
    props.publication = props.publication || null;
    props.author = props.hasOwnProperty('author') ? props.author : { aut_id: 410 };
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
                <FixRecord openAccess />
            </WithRouter>
        </WithReduxStore>,
    );
}

/**
 * Given the complex nature of the actions that handle the data that get submitted by the form
 * being tested, the tests below takes a functional approach, relying on real action methods
 * instead of mocks. This is to minimise false test positives, ensure payload correctness, etc.
 */
describe('Component FixRecord for non-compliant Open Access', () => {
    const isDebugging = false;
    const waitForOptions = { timeout: isDebugging ? 120000 : 2000 };

    const assertValidationErrorSummary = async () =>
        await waitFor(
            () => screen.getByText(forms.forms.openAccessComplianceForm.validationAlert.message),
            waitForOptions,
        );

    const assertNoValidationErrorSummary = async () => {
        if (screen.queryByText(forms.forms.openAccessComplianceForm.validationAlert.message)) {
            await waitForElementToBeRemoved(
                () => screen.getByText(forms.forms.openAccessComplianceForm.validationAlert.message),
                waitForOptions,
            );
        }
        assertEnabled(screen.getByTestId('fix-submit'));
    };

    const assertFixedRecordConfirmationMessage = async () =>
        await waitFor(
            () => screen.getByText(forms.forms.openAccessComplianceForm.successAlert.message),
            waitForOptions,
        );

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
            () => screen.getByText(forms.forms.openAccessComplianceForm.progressAlert.message),
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

    describe('form submission', () => {
        const pid = mockRecordToFix.rek_pid;
        const fileMock = ['test.png'];
        const existingRecordUrl = api.url.records.get(pid);
        const recordIssuesUrl = api.url.records.issues(pid);

        const mockPatchRecordApiCall = () => api.mock.records.update({ pid });

        const mockFixRecordApiCall = () => api.mock.records.issues({ pid });

        beforeEach(() => api.reset());
        afterEach(() => api.reset());

        describe('payload', () => {
            it('should submit fix record data', async () => {
                mockFixRecordApiCall();
                const { getByTestId, getByText, queryByText } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
                assertDisabled('fix-submit');
                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await assertNoValidationErrorSummary(queryByText);
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                expectApiRequestToMatchSnapshot('post', recordIssuesUrl);
            });

            it('should submit fix record data with new file', async () => {
                mockPatchRecordApiCall();
                mockFixRecordApiCall().files.upload();
                const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();
                expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
                assertDisabled('fix-submit');
                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await addFilesToFileUploader(fileMock);
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
            it('should display confirmation box after fix work successful submission and go to dashboard', async () => {
                mockFixRecordApiCall();
                const { getByTestId } = setup({
                    publication: { ...mockRecordToFix, fez_record_search_key_content_indicator: null },
                });

                await assertValidationErrorSummary();
                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await assertNoValidationErrorSummary();
                await submitForm();

                await assertFixedRecordConfirmationMessage();
                fireEvent.click(getByTestId('cancel-dialog-box'));
                expect(mockUseNavigate).toBeCalledWith(pathConfig.dashboard);
            });
        });

        describe('error handling', () => {
            it('should handle server error when fixing record', async () => {
                mockApi.onPatch(existingRecordUrl).replyOnce(500);

                const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();

                expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
                assertDisabled('fix-submit');

                fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
                await assertNoValidationErrorSummary();

                await submitForm();
                await assertServerErrorMessage();
                assertEnabled('fix-submit');
            });

            it('should allow retries after a server error when fixing record', async () => {
                mockApi.onPost(recordIssuesUrl).replyOnce(500).onPost(recordIssuesUrl).replyOnce(200);

                const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

                await assertValidationErrorSummary();

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
