import React from 'react';
import FeedbackRecord from './FeedbackRecord';
import { mockRecordToFeedback } from 'mock/data/testing/records';
import Immutable from 'immutable';
import { render, WithReduxStore, WithRouter, userEvent, screen, assertEnabled } from 'test-utils';
import { waitFor } from '@testing-library/dom';
import forms from 'locale/forms';
import { EXISTING_RECORD_API, RECORDS_FEEDBACK_API } from '../../../repositories/routes';

const mockUseNavigate = jest.fn();
let mockParams;
/* eslint-disable react/prop-types */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => mockParams,
}));

function setup(props = {}) {
    const state = Immutable.Map({
        feedbackRecordReducer: {
            recordToFeedback: props.publication,
            loadingRecordToFeedback: props.hasOwnProperty('loadingRecordToFeedback')
                ? props.loadingRecordToFix
                : !props.publication,
        },
    });

    return render(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <FeedbackRecord />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component FeedbackRecord', () => {
    const isDebugging = false;
    const waitForOptions = { timeout: isDebugging ? 120000 : 1000 };

    const assertValidationErrorSummary = async () =>
        await waitFor(() => screen.getByText(forms.forms.feedbackRecord.validationAlert.message), waitForOptions);

    const assertNoValidationErrorSummary = () => {
        expect(screen.queryByText(forms.forms.feedbackRecord.validationAlert.message)).not.toBeInTheDocument();
    };

    const assertFeedbackRecordConfirmationMessage = async () =>
        await waitFor(() => screen.getByText(forms.forms.feedbackRecord.successAlert.message), waitForOptions);

    const assertServerErrorMessage = async () =>
        await waitFor(
            () =>
                screen.getByText(new RegExp('Error has occurred during request and request cannot be processed.', 'i')),
            waitForOptions,
        );

    const submitForm = async () => {
        assertEnabled(screen.getByTestId('feedback-submit'));
        await userEvent.click(screen.getByTestId('feedback-submit'));
        await waitFor(() => {
            expect(screen.queryByText(forms.forms.feedbackRecord.progressAlert.message))
                .not
                .toBeInTheDocument();
        }, waitForOptions);
    };

    beforeEach(() => {
        mockUseNavigate.mockReset();
        mockParams = { pid: mockRecordToFeedback.rek_pid };
    });

    it('should render loader when record is loading', async () => {
        const { container } = setup();
        expect(await screen.findByText('Loading work'));
        expect(container).toMatchSnapshot();
    });

    it('should render work not found page if record can not be loaded', async () => {
        mockApi.onGet(EXISTING_RECORD_API({ pid: mockRecordToFeedback.rek_pid }).apiUrl).replyOnce(404);
        const { getByText } = setup();
        await waitFor(() => getByText('Work not found'), waitForOptions);
    });

    it('should render record citation, general fields and a cancel button and a submit button', async () => {
        const { container, getByRole, getByText, getByTestId } = setup({ publication: mockRecordToFeedback });
        await waitFor(() => getByText('Feedback Form'), waitForOptions);

        expect(getByTestId('publication-citation-parent-UQ:41878')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render feedback fields', async () => {
        const { container, getByRole, getByTestId } = setup({ publication: mockRecordToFeedback });

        await assertValidationErrorSummary();
        await userEvent.click(
            getByRole('checkbox', { name: 'Provide feedback / suggestion /information for this record' }),
        );
        expect(getByTestId('community-info')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render story fields', async () => {
        const { container, getByRole, getByTestId } = setup({ publication: mockRecordToFeedback });

        await assertValidationErrorSummary();
        await userEvent.click(getByRole('checkbox', { name: 'Share a story about this material' }));
        expect(getByTestId('story')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('should render takedown fields', async () => {
        const { container, getByRole, getByTestId } = setup({ publication: mockRecordToFeedback });

        await assertValidationErrorSummary();
        await userEvent.click(
            getByRole('checkbox', { name: 'Advise of cultural sensitivity / make a takedown request' }),
        );
        expect(container).toMatchSnapshot();
    });

    it('should display confirmation box after successful feedback and go back to view page', async () => {
        mockApi.onPost(RECORDS_FEEDBACK_API({ pid: mockRecordToFeedback.rek_pid }).apiUrl).replyOnce(201);

        const { getByRole, getByTestId } = setup({ publication: mockRecordToFeedback });

        await assertValidationErrorSummary();
        expect(getByTestId('feedback-submit')).toBeDisabled();
        await userEvent.click(getByRole('radio', { name: 'I’d like to share my feedback anonymously' }));
        expect(getByTestId('feedback-submit')).toBeEnabled();
        assertNoValidationErrorSummary();
        await userEvent.type(getByTestId('first-name-input'), 'first name');
        await userEvent.type(getByTestId('last-name-input'), 'last name');
        await submitForm();
        await assertFeedbackRecordConfirmationMessage();

        await userEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith(`/view/${mockRecordToFeedback.rek_pid}`);
    });

    it('should display confirmation box after successful feedback and go to my works', async () => {
        mockApi.onPost(RECORDS_FEEDBACK_API({ pid: mockRecordToFeedback.rek_pid }).apiUrl).replyOnce(201);

        const { getByTestId } = setup({ publication: mockRecordToFeedback });

        await assertValidationErrorSummary();
        await userEvent.type(getByTestId('last-name-input'), 'name');
        await userEvent.type(getByTestId('contact-no-input'), '12345');

        assertNoValidationErrorSummary();
        await submitForm();
        await assertFeedbackRecordConfirmationMessage();

        await userEvent.click(getByTestId('confirm-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/records/mine');
        expect(mockUseNavigate).toBeCalledTimes(1);
    });

    it('should handle server error when feedback record', async () => {
        mockApi.onPost(RECORDS_FEEDBACK_API({ pid: mockRecordToFeedback.rek_pid }).apiUrl).replyOnce(500);

        const { getByRole, getByTestId } = setup({ publication: mockRecordToFeedback });

        await assertValidationErrorSummary();
        await userEvent.click(getByRole('radio', { name: 'I’d like to share my feedback anonymously' }));

        assertNoValidationErrorSummary();
        await submitForm();

        await assertServerErrorMessage();
        expect(getByTestId('feedback-submit')).toBeEnabled();
    });

    it('should handle allow retries after a server error when feedback record', async () => {
        mockApi
            .onPost(RECORDS_FEEDBACK_API({ pid: mockRecordToFeedback.rek_pid }).apiUrl)
            .replyOnce(500)
            .onPost(RECORDS_FEEDBACK_API({ pid: mockRecordToFeedback.rek_pid }).apiUrl)
            .replyOnce(201);

        const { getByRole, getByTestId } = setup({ publication: mockRecordToFeedback });

        await assertValidationErrorSummary();
        await userEvent.click(getByRole('radio', { name: 'I’d like to share my feedback anonymously' }));

        assertNoValidationErrorSummary();
        await submitForm();

        await assertServerErrorMessage();
        expect(getByTestId('feedback-submit')).toBeEnabled();

        await submitForm();
        await assertFeedbackRecordConfirmationMessage();
    });
});
