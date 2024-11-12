import React from 'react';
import { default as formLocale } from 'locale/publicationForm';
import {
    render,
    WithReduxStore,
    WithRouter,
    fireEvent,
    screen,
    assertEnabled,
    assertDisabled,
    userEvent,
    mockUseValidatedForm,
    addFilesToFileUploader,
    waitForTextToBeRemoved,
    waitForText,
} from 'test-utils';
import Immutable from 'immutable';
import { waitFor } from '@testing-library/dom';
import * as repositories from '../../../repositories';

jest.mock('../../../context');

import { MyIncompleteRecord } from './MyIncompleteRecord';

const mockUseNavigate = jest.fn();
/* eslint-disable react/prop-types */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

const defaultAuthor = { aut_display_name: 'Brown, James', aut_org_student_id: 's2222222' };

function setup(props = {}) {
    props.author = props.author || defaultAuthor;

    const state = Immutable.Map({
        accountReducer: {
            author: props.author,
            isSessionExpired: props.isSessionExpired,
        },
    });

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

describe('ThesisSubmission', () => {
    const fileMock = ['myTestImage.png'];
    const isDebugging = false;
    const waitForOptions = { timeout: isDebugging ? 120000 : 1000 };

    const mockRichEditorFieldValues = values => {
        mockUseValidatedForm((props, original) => {
            props.values.thesisTitle = values?.hasOwnProperty('thesisTitle') ? values.thesisTitle : 'thesis title';
            props.values.thesisAbstract = values?.hasOwnProperty('thesisAbstract')
                ? values.thesisAbstract
                : 'thesis thesisAbstract';
            return original(props);
        });
    };

    const assertValidationErrorSummary = async () => {
        await waitForText(formLocale.validationAlert.message, waitForOptions);
        assertDisabled(screen.getByTestId('cancel-deposit-thesis'));
        assertDisabled(screen.getByTestId('deposit-thesis'));
    };

    const assertNoValidationErrorSummary = async () => {
        await waitForTextToBeRemoved(formLocale.validationAlert.message, waitForOptions);
        assertEnabled(screen.getByTestId('cancel-deposit-thesis'));
        assertEnabled(screen.getByTestId('deposit-thesis'));
    };

    const fillUpForm = async () => {
        expect(defaultAuthor.aut_display_name.length).toBeGreaterThan(0);
        expect(screen.getByTestId('rek-author-input')).toHaveValue(defaultAuthor.aut_display_name);
        await userEvent.click(screen.getByTestId('rek-genre-type-select'));
        await userEvent.click(screen.getByText('PhD Thesis'));
        await userEvent.type(screen.getByTestId('rek-org-unit-name-input'), 'Art, Design and Architecture');
        await userEvent.type(screen.getByTestId('rek-supervisor-input'), 'J.Smith');
        await userEvent.click(screen.getByRole('button', { name: 'Add supervisor' }));
        await userEvent.type(screen.getByTestId('rek-subject-input'), '01');
        await waitForText('0101 Pure Mathematics');
        await userEvent.click(screen.getByText('0101 Pure Mathematics'));
        await userEvent.type(screen.getByTestId('rek-keywords-input'), 'keyword');
        await userEvent.click(screen.getByTestId('rek-keywords-add'));
        addFilesToFileUploader(fileMock);
        await assertNoValidationErrorSummary();
    };

    const submitForm = async () => fireEvent.click(await screen.getByTestId('deposit-thesis'));

    const retryUpload = async () => {
        await waitFor(
            () => screen.getByText(new RegExp(formLocale.thesisSubmission.fileUpload.failedAlertLocale.title, 'i')),
            waitForOptions,
        );
        await userEvent.click(
            screen.getByText(formLocale.thesisSubmission.fileUpload.failedAlertLocale.actionButtonLabel),
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionApi.resetHandlers();
        mockApi.resetHandlers();

        mockSessionApi.onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl).reply(200);
    });

    afterEach(() => {
        jest.clearAllMocks();

        mockSessionApi.resetHandlers();
        mockApi.resetHandlers();
    });
});
