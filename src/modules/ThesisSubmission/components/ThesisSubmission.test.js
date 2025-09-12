import React from 'react';
import { default as formLocale } from 'locale/publicationForm';
import * as config from 'config/general';
import {
    render,
    WithReduxStore,
    WithRouter,
    fireEvent,
    screen,
    assertEnabled,
    assertDisabled,
    userEvent,
    mockUseForm,
    addFilesToFileUploader,
    waitForTextToBeRemoved,
    waitForText,
    expectApiRequestToMatchSnapshot,
    api,
    assertInstanceOfFile,
} from 'test-utils';
import { useAccountContext } from 'context';
import { waitFor } from '@testing-library/dom';
import { FIELD_OF_RESEARCH_VOCAB_ID } from 'config/general';
import { vocabulariesList } from '../../../mock/data';
import * as repositories from '../../../repositories';

jest.mock('../../../context');

import ThesisSubmission, { getFormConstants } from './ThesisSubmission';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

const defaultAuthor = { aut_display_name: 'Brown, James', aut_org_student_id: 's2222222' };

function setup(props = {}) {
    props.author = props.author || defaultAuthor;
    useAccountContext.mockImplementation(() => ({
        account: {
            id: props.author.aut_org_student_id,
        },
    }));

    const state = {
        accountReducer: {
            author: props.author,
            isSessionExpired: props.isSessionExpired,
        },
        createRecordReducer: {
            newRecord: props.publication,
            newRecordFileUploadingOrIssueError: props.newRecordFileUploadingOrIssueError,
        },
        fileUploadReducer: {
            fullyUploadedFiles: props.fullyUploadedFiles,
            isUploadInProgress: props.isUploadInProgress,
        },
    };

    return render(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <ThesisSubmission isHdrThesis={!!props.isHdrThesis} />
            </WithRouter>
        </WithReduxStore>,
    );
}

/**
 * These tests are intentionally extensive, as they are functional tests of the ThesisSubmission component — a critical
 * feature of the application. This approach was deliberately chosen to ensure comprehensive coverage of the component's
 * functionality.
 */
describe('ThesisSubmission', () => {
    const fileMock = ['myTestImage.png'];
    const isDebugging = false;
    const waitForOptions = { timeout: isDebugging ? 120000 : 4000 };

    const mockRichEditorFieldValues = values => {
        mockUseForm((props, original) => {
            props.values.thesisTitle = values?.hasOwnProperty('thesisTitle') ? values.thesisTitle : 'thesis title';
            props.values.thesisAbstract = values?.hasOwnProperty('thesisAbstract')
                ? values.thesisAbstract
                : 'thesis thesisAbstract';
            return original(props);
        });
    };

    const assertValidationErrorSummary = async () => {
        await waitForText(formLocale.validationAlert.message, waitForOptions);
        assertEnabled(screen.getByTestId('cancel-deposit-thesis'));
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
        await addFilesToFileUploader(fileMock);
        await assertNoValidationErrorSummary();
    };

    const submitForm = async () => fireEvent.click(await screen.getByTestId('deposit-thesis'));

    const assertConfirmationMessage = async () =>
        await waitFor(
            () => screen.getByText(formLocale.thesisSubmission.depositConfirmation.confirmationMessage),
            waitForOptions,
        );

    const confirmDeposit = async () => {
        await assertConfirmationMessage();
        await userEvent.click(screen.getByText(formLocale.thesisSubmission.depositConfirmation.confirmButtonLabel));
    };

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
        jest.restoreAllMocks();
        mockSessionApi.resetHandlers();
        api.reset();

        config.THESIS_UPLOAD_RETRIES = 1;
        mockSessionApi.onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl).reply(200);
        mockApi
            .onGet(repositories.routes.VOCABULARIES_API({ id: FIELD_OF_RESEARCH_VOCAB_ID }).apiUrl)
            .reply(200, vocabulariesList[FIELD_OF_RESEARCH_VOCAB_ID]);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        mockSessionApi.resetHandlers();
        api.reset();
    });

    describe('HDR submission', () => {
        describe('form', () => {
            it('should display error summary according to invalid fields', async () => {
                mockRichEditorFieldValues({ thesisTitle: undefined, thesisAbstract: undefined });
                const { getByTestId, queryByText, getByRole } = setup({ isHdrThesis: true });
                await assertValidationErrorSummary();

                await waitForText('Thesis title is required');
                await waitForText('Thesis type is required');
                await waitForText('Enrolling unit is required');
                await waitForText('Thesis abstract is required');
                await waitForText('Supervisor names are required');
                await waitForText('Field of research (FoR) codes are required');
                await waitForText('Keywords are required');
                await waitForText('File submission to be completed');

                await userEvent.click(getByTestId('rek-genre-type-select'));
                await userEvent.click(queryByText('PhD Thesis'));
                await waitForTextToBeRemoved('Thesis type is required');

                await userEvent.type(getByTestId('rek-org-unit-name-input'), 'Art, Design and Architecture');
                await waitForTextToBeRemoved('Enrolling unit is required');

                await userEvent.type(getByTestId('rek-supervisor-input'), 'J.Smith');
                await userEvent.click(getByRole('button', { name: 'Add supervisor' }));
                await waitForTextToBeRemoved('Supervisor names are required');

                await userEvent.type(getByTestId('rek-subject-input'), '01');
                await waitForText('0101 Pure Mathematics');
                await userEvent.click(queryByText('0101 Pure Mathematics'));
                await waitForTextToBeRemoved('Field of research (FoR) codes are required');

                await userEvent.type(getByTestId('rek-keywords-input'), 'keyword');
                await userEvent.click(getByTestId('rek-keywords-add'));
                await waitForTextToBeRemoved('Keywords are required');

                await addFilesToFileUploader(fileMock);
                await waitForTextToBeRemoved('File submission to be completed');
            });

            it('should display error summary according to invalid rich editor fields', async () => {
                mockRichEditorFieldValues({ thesisTitle: 'abc' });
                const { queryByText } = setup();
                await assertValidationErrorSummary();

                expect(queryByText('Thesis title is required')).not.toBeInTheDocument();
            });

            it('should display error summary according to invalid rich editor fields', async () => {
                mockRichEditorFieldValues({ thesisAbstract: 'abc' });
                const { queryByText } = setup();
                await assertValidationErrorSummary();

                expect(queryByText('Thesis abstract is required')).not.toBeInTheDocument();
            });

            it('should show alert message not the thesis submission form to students not in the transition cohort', () => {
                const { getByText } = setup({ author: { aut_org_student_id: 's333333' }, isHdrThesis: true });
                expect(getByText(/HDR theses are now submitted via the UQ Research Data Manager/i)).toBeInTheDocument();
            });

            it('should display confirmation message and successful submission screen after proceeding with form submission', async () => {
                api.mock.records.create({ pid: 'UQ:123456' }).files.upload();

                mockRichEditorFieldValues();
                setup({ isHdrThesis: true });
                await assertValidationErrorSummary();
                await fillUpForm();
                await submitForm();
                await confirmDeposit();

                await waitForText(formLocale.thesisSubmission.afterSubmitTitle, waitForOptions);
                expectApiRequestToMatchSnapshot('post', api.url.records.create);
                expectApiRequestToMatchSnapshot('post', api.url.files.presignedUrl);
                expectApiRequestToMatchSnapshot('put', api.url.files.put, assertInstanceOfFile);
            });

            it('should display file upload error and successfully upload after a retry', async () => {
                const pid = 'UQ:123456';
                api.mock.records
                    .create({ pid })
                    .files.presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .records.issues({ pid })
                    .files.upload();

                mockRichEditorFieldValues();
                const { queryByText, getByTestId } = setup({ isHdrThesis: true });
                await assertValidationErrorSummary();
                await fillUpForm();
                await submitForm();
                await confirmDeposit();

                await waitFor(() => expect(getByTestId('alert-message')).toHaveTextContent('Graduate School'));
                expect(queryByText('UQ eSpace')).not.toBeInTheDocument();
                await retryUpload();

                await waitForText(new RegExp('File upload retry succeeded', 'i'), waitForOptions);
            });

            it('should display file upload error and show error message after failed retry', async () => {
                const pid = 'UQ:123456';
                api.mock.records
                    .create({ pid })
                    .files.presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .records.issues({ pid });

                mockRichEditorFieldValues();
                const { getByText } = setup({ isHdrThesis: true });
                await assertValidationErrorSummary();
                await fillUpForm();
                await submitForm();
                await confirmDeposit();
                await retryUpload();

                // assert error message
                await waitFor(() => getByText(new RegExp('Not all files were uploaded', 'i')), waitForOptions);
            });

            it('should show server error while trying to create the thesis', async () => {
                api.mock.records.create({ status: 500 });

                mockRichEditorFieldValues();
                setup({ isHdrThesis: true });
                await assertValidationErrorSummary();
                await fillUpForm();
                await submitForm();
                await confirmDeposit();

                await waitForText(formLocale.thesisSubmission.depositFailedMessage, waitForOptions);
                assertEnabled('deposit-thesis');
            });
        });

        describe('redirections', () => {
            const { location } = window;

            beforeAll(() => {
                delete window.location;
                window.location = { assign: jest.fn(), reload: jest.fn() };
            });

            afterEach(() => {
                window.location.assign.mockClear();
                window.location.reload.mockClear();
            });

            afterAll(() => {
                window.location = location;
            });

            it('should redirect to cancel page', () => {
                const { cancelSubmit } = getFormConstants({}, {}, true);
                cancelSubmit();
                expect(window.location.assign).toBeCalledWith(
                    expect.stringContaining(formLocale.thesisSubmission.cancelLink),
                );
            });

            it('should redirect to after submit page', () => {
                const { afterSubmit } = getFormConstants({}, {}, true);
                afterSubmit();
                expect(window.location.assign).toBeCalledWith(
                    expect.stringContaining(formLocale.thesisSubmission.afterSubmitLink),
                );
            });
        });
    });

    describe('SBS submission', () => {
        const fillUpSbsForm = async () => {
            await userEvent.type(screen.getByTestId('comments-input'), 'comments');
            await fillUpForm();
        };
        describe('form', () => {
            it('should display error summary according to invalid fields', async () => {
                mockRichEditorFieldValues({ thesisTitle: undefined, thesisAbstract: undefined });
                const { getByTestId, queryByText, getByRole } = setup();
                await assertValidationErrorSummary();

                await waitForText('Thesis title is required');
                await waitForText('Enrolling unit is required');
                await waitForText('Thesis abstract is required');
                await waitForText('Supervisor names are required');
                await waitForText('Field of research (FoR) codes are required');
                await waitForText('File submission to be completed');

                await userEvent.type(getByTestId('rek-org-unit-name-input'), 'Art, Design and Architecture');
                await waitForTextToBeRemoved('Enrolling unit is required');

                await userEvent.type(getByTestId('rek-supervisor-input'), 'J.Smith');
                await userEvent.click(getByRole('button', { name: 'Add supervisor' }));
                await waitForTextToBeRemoved('Supervisor names are required');

                await userEvent.type(getByTestId('rek-subject-input'), '01');
                await waitForText('0101 Pure Mathematics');
                await userEvent.click(queryByText('0101 Pure Mathematics'));
                await waitForTextToBeRemoved('Field of research (FoR) codes are required');

                await addFilesToFileUploader(fileMock);
                await waitForTextToBeRemoved('File submission to be completed');
            });

            it('should display error summary according to invalid rich editor fields', async () => {
                mockRichEditorFieldValues({ thesisTitle: 'abc' });
                const { queryByText } = setup();
                await assertValidationErrorSummary();

                expect(queryByText('Thesis title is required')).not.toBeInTheDocument();
            });

            it('should display error summary according to invalid rich editor fields', async () => {
                mockRichEditorFieldValues({ thesisAbstract: 'abc' });
                const { queryByText } = setup();
                await assertValidationErrorSummary();

                expect(queryByText('Thesis abstract is required')).not.toBeInTheDocument();
            });

            it('should display confirmation message and successful submission screen after proceeding with form submission', async () => {
                api.mock.records.create({ pid: 'UQ:123456' }).files.upload();

                mockRichEditorFieldValues();
                setup();
                await assertValidationErrorSummary();
                await fillUpSbsForm();
                await submitForm();
                await confirmDeposit();

                await waitForText(formLocale.thesisSubmission.afterSubmitTitle, waitForOptions);
                expectApiRequestToMatchSnapshot('post', api.url.records.create);
                expectApiRequestToMatchSnapshot('post', api.url.files.presignedUrl);
                expectApiRequestToMatchSnapshot('put', api.url.files.put, assertInstanceOfFile);
            });

            it('should display file upload error and successfully upload after a retry', async () => {
                const pid = 'UQ:123456';
                api.mock.records
                    .create({ pid })
                    .files.presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .records.issues({ pid })
                    .files.upload();

                mockRichEditorFieldValues();
                const { getByTestId } = setup();
                await assertValidationErrorSummary();
                await fillUpSbsForm();
                await submitForm();
                await confirmDeposit();

                await waitForTextToBeRemoved(/saving/i);
                await waitForText('UQ eSpace');
                expect(getByTestId('alert-message')).not.toHaveTextContent('Graduate School');
                await retryUpload();

                await waitForText(new RegExp('File upload retry succeeded', 'i'), waitForOptions);
            });

            it('should display file upload error and show error message after failed retry', async () => {
                const pid = 'UQ:123456';
                api.mock.records
                    .create({ pid })
                    .files.presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .presignedUrl({ status: 500 })
                    .records.issues({ pid });

                mockRichEditorFieldValues();
                const { getByText } = setup();
                await assertValidationErrorSummary();
                await fillUpSbsForm();
                await submitForm();
                await confirmDeposit();
                await retryUpload();

                // assert error message
                await waitFor(() => getByText(new RegExp('Not all files were uploaded', 'i')), waitForOptions);
            });

            it('should show server error while trying to create the thesis', async () => {
                api.mock.records.create({ status: 500 });

                mockRichEditorFieldValues();
                setup();
                await assertValidationErrorSummary();
                await fillUpSbsForm();
                await submitForm();
                await confirmDeposit();

                await waitForText(formLocale.thesisSubmission.depositFailedMessage, waitForOptions);
                assertEnabled('deposit-thesis');
            });
        });

        describe('redirections', () => {
            const { location } = window;

            beforeAll(() => {
                delete window.location;
                window.location = { assign: jest.fn(), reload: jest.fn() };
            });

            afterEach(() => {
                window.location.assign.mockClear();
                window.location.reload.mockClear();
            });

            afterAll(() => {
                window.location = location;
            });

            it('should reload after cancel', () => {
                const { cancelSubmit } = getFormConstants({}, {});
                cancelSubmit();
                expect(window.location.reload).toBeCalled();
            });

            it('should reload after submit', () => {
                const { afterSubmit } = getFormConstants({}, {});
                afterSubmit();
                expect(window.location.reload).toBeCalled();
            });
        });
    });
});
