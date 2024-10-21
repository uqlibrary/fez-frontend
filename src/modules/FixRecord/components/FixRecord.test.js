import React from 'react';
import FixRecord from './FixRecord';
import { mockRecordToFix } from 'mock/data/testing/records';
import Immutable from 'immutable';
import { render, WithReduxStore, WithRouter, fireEvent, screen, assertEnabled, assertDisabled } from 'test-utils';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import validationErrors from '../../../locale/validationErrors';
import forms from '../../../locale/forms';

const mockUseNavigate = jest.fn();
let mockParams;
/* eslint-disable react/prop-types */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => mockParams,
}));

let mockFixRecord = jest.fn();
const mockUnclaimRecord = jest.fn();
const mockClearFixRecord = jest.fn();
const mockLoadRecordToFix = jest.fn();

/* eslint-disable react/prop-types */
jest.mock('actions', () => ({
    ...jest.requireActual('actions'),

    fixRecord: () => mockFixRecord,
    unclaimRecord: () => mockUnclaimRecord,
    clearFixRecord: () => mockClearFixRecord,
    loadRecordToFix: () => mockLoadRecordToFix,
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

describe('Component FixRecord', () => {
    const switchToUnclaimMode = () => {
        fireEvent.mouseDown(screen.getByTestId('fix-action-select'));
        fireEvent.click(screen.getByText(/I am not the author/i));
    };
    const switchToFixMode = () => {
        fireEvent.mouseDown(screen.getByTestId('fix-action-select'));
        fireEvent.click(screen.getByText(/I am the author/i));
    };

    const assertValidationErrorSummary = async () => {
        await waitFor(() => screen.getByText(forms.forms.fixPublicationForm.validationAlert.message));
    };

    const assertNoValidationErrorSummary = async () => {
        await waitForElementToBeRemoved(() => screen.getByText(forms.forms.fixPublicationForm.validationAlert.message));
        assertEnabled(screen.getByTestId('fix-submit'));
    };

    const assertFixedRecordConfirmationMessage = async () => {
        await waitFor(() => screen.getByText(forms.forms.fixPublicationForm.successAlert.message));
    };

    const submitForm = async () => {
        assertEnabled(screen.getByTestId('fix-submit'));
        fireEvent.click(screen.getByTestId('fix-submit'));
        await waitForElementToBeRemoved(() => screen.getByText(forms.forms.fixPublicationForm.progressAlert.message));
    };

    beforeEach(() => {
        mockUseNavigate.mockReset();
        mockParams = { pid: mockRecordToFix.rek_pid };
        mockFixRecord.mockReset();
        mockUnclaimRecord.mockReset();
        mockClearFixRecord.mockReset();
        mockLoadRecordToFix.mockReset();
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
        const { getByText } = setup({ loadingRecordToFix: false });
        expect(getByText('Work not found')).toBeInTheDocument();
    });

    it('should render record citation, two actions in select field and a cancel button', () => {
        const { container } = setup({ publication: mockRecordToFix });
        expect(container).toMatchSnapshot();
    });

    it('should load record if record is not loaded', () => {
        setup();
        expect(mockLoadRecordToFix).toBeCalled();
    });

    it('should render fix record form', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render unclaim form', async () => {
        const { container } = setup({ publication: mockRecordToFix });

        await assertValidationErrorSummary();
        switchToUnclaimMode();
        await assertNoValidationErrorSummary();

        expect(container).toMatchSnapshot();
    });

    it('should display confirmation box after successful unclaim and go back to previous page', async () => {
        const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

        await assertValidationErrorSummary();
        switchToUnclaimMode();
        await assertNoValidationErrorSummary();
        await submitForm();

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUnclaimRecord).toBeCalledTimes(1);
        expect(mockFixRecord).toBeCalledTimes(0);
        expect(mockUseNavigate).toBeCalledTimes(1);
    });

    it('should display confirmation box after successful unclaim and go to my works', async () => {
        const { getByTestId } = setup({ publication: mockRecordToFix });

        await assertValidationErrorSummary();
        switchToUnclaimMode();
        await assertNoValidationErrorSummary();
        await submitForm();

        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(mockUnclaimRecord).toBeCalledTimes(1);
        expect(mockFixRecord).toBeCalledTimes(0);
        expect(mockUseNavigate).toBeCalledWith('/records/mine');
        expect(mockUseNavigate).toBeCalledTimes(1);
    });

    it('should display confirmation box after successful submission', async () => {
        const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

        await assertValidationErrorSummary();
        switchToFixMode();

        expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
        assertDisabled(getByTestId('fix-submit'));

        fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
        await assertNoValidationErrorSummary();

        await submitForm();
        await assertFixedRecordConfirmationMessage();

        expect(mockUnclaimRecord).toBeCalledTimes(0);
        expect(mockFixRecord).toBeCalledTimes(1);
    });

    it('should display confirmation box after successful submission and go to dashboard', async () => {
        const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

        await assertValidationErrorSummary();
        switchToFixMode();

        expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
        assertDisabled(getByTestId('fix-submit'));

        fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
        await assertNoValidationErrorSummary();

        await submitForm();
        await assertFixedRecordConfirmationMessage();

        fireEvent.click(getByTestId('cancel-dialog-box'));

        expect(mockUnclaimRecord).toBeCalledTimes(0);
        expect(mockFixRecord).toBeCalledTimes(1);
        expect(mockUseNavigate).toBeCalledWith('/dashboard');
    });

    it('should display server error', async () => {
        const serverError = 'Custom Server Error!';
        mockFixRecord = () => Promise.reject({ status: 500, message: serverError });
        const { getByTestId, getByText } = setup({ publication: mockRecordToFix });

        await assertValidationErrorSummary();
        switchToFixMode();

        expect(getByText(validationErrors.validationErrorsSummary.fixRecordAnyField)).toBeInTheDocument();
        assertDisabled(getByTestId('fix-submit'));

        fireEvent.change(getByTestId('comments-input'), { target: { value: 'my comments' } });
        await assertNoValidationErrorSummary();

        await submitForm();
        await waitFor(() => getByText(new RegExp(serverError, 'i')));
    });
});
