import PublicationForm from './PublicationForm';
import React from 'react';
import {
    addAndSelectContributorsEditorItem,
    addFilesToFileUploader,
    assertDisabled,
    assertInstanceOfFile,
    expectApiRequestToMatchSnapshot,
    expectApiRequestHistoryToBeEmpty,
    render,
    selectDropDownOption,
    setFileUploaderFilesToClosedAccess,
    setRichTextEditorValue,
    userEvent,
    waitForText,
    waitForTextToBeRemoved,
    waitToBeEnabled,
    WithReduxStore,
    WithRouter,
    expectApiRequestCountToBe,
    api,
} from 'test-utils';
import { screen } from '@testing-library/react';
import publicationForm from '../../../../locale/publicationForm';
import { SEARCH_KEY_LOOKUP_API } from '../../../../repositories/routes';
import validationErrors from '../../../../locale/validationErrors';

function setup(props = {}, renderMethod = render) {
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <PublicationForm {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('PublicationForm', () => {
    afterEach(() => {
        expect(screen.queryByText(/Unexpected Application Error!/i)).not.toBeInTheDocument();
    });
    const selectDisplayType = async option => selectDropDownOption('rek-display-type-select', option);
    const selectSubtype = async option => selectDropDownOption('rek-subtype-select', option);

    const selectTypeCombo = async (option, expectedAutoSelectedDisplayType) => {
        await selectDisplayType(option);
        expect(screen.getByTestId('rek-display-type-select')).toHaveTextContent(expectedAutoSelectedDisplayType);
    };

    const assertValidationErrorSummary = async (expectedErrors = []) => {
        await waitForText(publicationForm.validationAlert.message);
        for (const error of expectedErrors) {
            await waitForText(error);
        }
    };
    const assertMissingValidationErrorSummary = async unexpectedErrors => {
        for (const error of unexpectedErrors) {
            await waitForTextToBeRemoved(error);
        }
    };
    const assertDisabledSubmitButton = () => assertDisabled(screen.getByTestId('submit-work'));

    describe('work type selection', () => {
        it('should allow selecting work type without a subtype and load a validated form', async () => {
            setup();
            await selectDisplayType('Image');

            await assertValidationErrorSummary([
                'Title is required',
                'Publication date is required',
                'Author/creator names are required',
                'Editor/contributor names are required',
            ]);
            assertDisabledSubmitButton();
        });

        it('should allow selecting work type with a subtype and load a validated form', async () => {
            setup();
            await selectDisplayType('Journal Article');
            await selectSubtype('Article (original research)');

            await assertValidationErrorSummary([
                'Title is required',
                'Journal name is required',
                'Publication date is required',
                'Author/creator names are required',
                'Editor/contributor names are required',
            ]);
            assertDisabledSubmitButton();
        });

        it('should allow selecting work type with a subtype via a predefined option and load a validated form', async () => {
            setup();
            await selectTypeCombo('Creative Work - Design/Architectural', 'Design');

            await assertValidationErrorSummary([
                'Title is required',
                'Total page is required',
                'Place of publication is required',
                'Publisher is required',
                'File submission to be completed',
                'Abstract/Description is required',
                'Quality indicator is required',
                'Project start date is required',
                'Author/creator names are required',
                'Editor/contributor names are required',
            ]);
            assertDisabledSubmitButton();
        });

        it('should allow changing work type selection', async () => {
            setup();
            await selectDisplayType('Image');
            await assertValidationErrorSummary(['Title is required']);
            assertDisabledSubmitButton();

            const journalArticleOnlyFieldValidationError = 'Journal name is required';
            await selectDisplayType('Journal Article');
            await selectSubtype('Article (original research)');
            await assertValidationErrorSummary([journalArticleOnlyFieldValidationError]);
            assertDisabledSubmitButton();

            const ntroOnlyFieldValidationError = 'Quality indicator is required';
            await selectTypeCombo('Creative Work - Design/Architectural', 'Design');
            await assertValidationErrorSummary([ntroOnlyFieldValidationError]);
            // make sure previous selected form's fields are removed
            expect(screen.queryByText(journalArticleOnlyFieldValidationError)).not.toBeInTheDocument();
            assertDisabledSubmitButton();

            await selectDisplayType('Image');
            await assertValidationErrorSummary(['Title is required']);
            // make sure previous selected form's fields are removed
            expect(screen.queryByText(ntroOnlyFieldValidationError)).not.toBeInTheDocument();
            assertDisabledSubmitButton();
        });

        it('should persist initial value across work type selection change', async () => {
            setup({ initialValues: { rek_title: 'test' } });
            await selectDisplayType('Image');
            await assertValidationErrorSummary();
            await assertMissingValidationErrorSummary(['Title is required']);

            await selectDisplayType('Journal Article');
            await selectSubtype('Article (original research)');
            await assertValidationErrorSummary();
            await assertMissingValidationErrorSummary(['Title is required']);
        });
    });

    describe('navigation', () => {
        it('should call given onCancel callback', async () => {
            const mockOnFormCancel = jest.fn();
            setup({ onFormCancel: mockOnFormCancel });
            await selectDisplayType('Image');
            await userEvent.click(screen.getByText(publicationForm.cancel));
            expect(mockOnFormCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('validation', () => {
        it('should require at least one editor for edited books', async () => {
            setup();
            await selectDisplayType('Book');
            await selectSubtype('Edited book');

            const editorValidationError = ['Editor/contributor names are required'];
            await assertValidationErrorSummary(editorValidationError);
            await addAndSelectContributorsEditorItem('rek-contributor');
            await assertMissingValidationErrorSummary(editorValidationError);
        });

        it('should validate start and end pages range', async () => {
            setup();
            await selectDisplayType('Book Chapter');
            await selectSubtype('Other');

            const pageRangeError = ['Please provide a valid start/end page range'];
            await userEvent.type(screen.getByTestId('fez_record_search_key_start_page.rek_start_page-input'), '20');
            await userEvent.type(screen.getByTestId('fez_record_search_key_end_page.rek_end_page-input'), '10');
            await assertValidationErrorSummary(pageRangeError);
            await userEvent.clear(screen.getByTestId('fez_record_search_key_start_page.rek_start_page-input'));
            await userEvent.type(screen.getByTestId('fez_record_search_key_start_page.rek_start_page-input'), '9');
            await assertMissingValidationErrorSummary(pageRangeError);
        });

        it('should validate date ranges for Design', async () => {
            setup();
            await selectDisplayType('Design');

            const pageRangeError = ['Publication start/end dates are invalid'];
            await assertMissingValidationErrorSummary(pageRangeError);
            await userEvent.type(screen.getByTestId('rek-project-start-date-year-input'), '80');
            await assertMissingValidationErrorSummary(pageRangeError);
            await userEvent.type(screen.getByTestId('rek-end-date-year-input'), '70');
            await assertValidationErrorSummary(pageRangeError);
            await userEvent.clear(screen.getByTestId('rek-project-start-date-year-input'));
            await userEvent.type(screen.getByTestId('rek-project-start-date-year-input'), '60');
            await assertMissingValidationErrorSummary(pageRangeError);
        });

        it('should validate date ranges for Creative Work', async () => {
            setup();
            await selectDisplayType('Creative Work');
            await selectSubtype('Live Performance of Creative Work - Music');

            const pageRangeError = ['Publication start/end dates are invalid'];
            await assertMissingValidationErrorSummary(pageRangeError);
            await userEvent.type(screen.getByTestId('rek-date-year-input'), '80');
            await assertMissingValidationErrorSummary(pageRangeError);
            await userEvent.type(screen.getByTestId('rek-end-date-year-input'), '70');
            await assertValidationErrorSummary(pageRangeError);
            await userEvent.clear(screen.getByTestId('rek-date-year-input'));
            await userEvent.type(screen.getByTestId('rek-date-year-input'), '60');
            await assertMissingValidationErrorSummary(pageRangeError);
        });

        it('should validate added fields upon selecting an author', async () => {
            setup();
            await selectDisplayType('Design');

            const expectedError = ['Scale/Significance of work is required', 'Creator research statement is required'];
            await assertMissingValidationErrorSummary(expectedError);
            await addAndSelectContributorsEditorItem('authors');
            await assertValidationErrorSummary(expectedError);
        });
    });

    describe('form submission', () => {
        const pid = 'UQ:1';
        const fileMock = ['test.pdf'];

        beforeEach(() => api.reset());
        afterEach(() => api.reset());

        const submitForm = async () => {
            await waitToBeEnabled('submit-work');
            await userEvent.click(screen.getByTestId('submit-work'));
        };
        const assertSavingMessage = async () => {
            await waitForText(new RegExp(publicationForm.progressAlert.message, 'i'));
            await waitForTextToBeRemoved(new RegExp(publicationForm.progressAlert.message, 'i'));
        };

        it('should submit form with expected payload', async () => {
            const pid = 'UQ:1';
            const mockOnFormSubmitSuccess = jest.fn();
            api.mock.records
                .create({ pid })
                .update({ pid })
                .issues({ pid })
                .files.upload();

            setup({ onFormSubmitSuccess: mockOnFormSubmitSuccess });
            await selectTypeCombo('Creative Work - Design/Architectural', 'Design');

            await assertValidationErrorSummary([
                'Title is required',
                'Total page is required',
                'Place of publication is required',
                'Publisher is required',
                'File submission to be completed',
                'Abstract/Description is required',
                'Quality indicator is required',
                'Project start date is required',
                'Author/creator names are required',
                'Editor/contributor names are required',
            ]);

            // fill up form
            await userEvent.type(screen.getByTestId('rek_title-input'), 'title');
            await userEvent.type(
                screen.getByTestId('fez_record_search_key_publisher.rek_publisher-input'),
                'publisher',
            );
            await userEvent.type(
                screen.getByTestId('fez_record_search_key_place_of_publication.rek_place_of_publication-input'),
                'place of publication',
            );
            await userEvent.type(screen.getByTestId('rek-project-start-date-year-input'), '1980');
            await addAndSelectContributorsEditorItem('authors');
            await userEvent.type(screen.getByTestId('rek-total-pages-input'), '123');
            await selectDropDownOption(
                'rek-quality-indicator-select',
                'Disseminated via nationally recognised outlet or entity',
            );
            await selectDropDownOption('rek-significance-select', 'Minor');
            await setRichTextEditorValue('rek-creator-contribution-statement', 'statement');
            await setRichTextEditorValue('rek-description', 'abstract');
            await addFilesToFileUploader(fileMock);
            await setFileUploaderFilesToClosedAccess(fileMock);

            await submitForm();
            await assertSavingMessage();
            expect(mockOnFormSubmitSuccess).toHaveBeenCalledTimes(1);
            expectApiRequestToMatchSnapshot('post', api.url.records.create, v => JSON.parse(v).isNtro === true);
            expectApiRequestToMatchSnapshot('put', api.url.files.put, assertInstanceOfFile);
        });

        it('should perform async on submit', async () => {
            const doiSearchUrl = SEARCH_KEY_LOOKUP_API({ searchKey: 'doi', searchQuery: '' }).apiUrl;
            api.mock.records
                .create({ pid })
                // doi async validation
                .instance.onGet(doiSearchUrl)
                .replyOnce(200, { total: 1 })
                .onGet(doiSearchUrl)
                .replyOnce(200, { total: 0 });

            setup({ onFormSubmitSuccess: jest.fn() });
            await selectDisplayType('Image');

            // fill up form
            await userEvent.type(screen.getByTestId('rek_title-input'), 'title');
            await userEvent.type(screen.getByTestId('rek-date-year-input'), '1980');
            await addAndSelectContributorsEditorItem('creators');
            // fill up DOI
            // invalid
            const doiValidationError = ['DOI is invalid'];
            await assertMissingValidationErrorSummary(doiValidationError);
            await userEvent.type(screen.getByTestId('rek-doi-input'), 'abc');
            await assertValidationErrorSummary(doiValidationError);
            // valid
            await userEvent.clear(screen.getByTestId('rek-doi-input'));
            await userEvent.type(screen.getByTestId('rek-doi-input'), '10.1037/neu0000');
            await assertMissingValidationErrorSummary(doiValidationError);
            expectApiRequestHistoryToBeEmpty();
            await userEvent.type(screen.getByTestId('rek-doi-input'), '5');
            await assertMissingValidationErrorSummary(doiValidationError);
            expectApiRequestHistoryToBeEmpty();

            // should fail on async existing doi validation
            await submitForm();
            await assertValidationErrorSummary([validationErrors.validationErrors.doiExists]);
            expectApiRequestToMatchSnapshot('get', doiSearchUrl);
            expectApiRequestHistoryToBeEmpty();
            // fix doi and retry
            await userEvent.clear(screen.getByTestId('rek-doi-input'));
            await userEvent.type(screen.getByTestId('rek-doi-input'), '10.1037/neu0000575');
            await assertMissingValidationErrorSummary([validationErrors.validationErrors.doiExists]);
            expectApiRequestHistoryToBeEmpty();

            await submitForm();
            await assertSavingMessage();
            expectApiRequestToMatchSnapshot('post', api.url.records.create, v => !JSON.parse(v).isNtro);
            expectApiRequestToMatchSnapshot('get', doiSearchUrl);
            expectApiRequestCountToBe('get', doiSearchUrl, 0);
        });

        describe('error handling', () => {
            it('should render server error', async () => {
                setup();
                await selectDisplayType('Image');

                // fill up form
                await userEvent.type(screen.getByTestId('rek_title-input'), 'title');
                await userEvent.type(screen.getByTestId('rek-date-year-input'), '1980');
                await addAndSelectContributorsEditorItem('creators');

                await submitForm();
                await waitForText(/Error has occurred during request and request cannot be processed/i);
            });
        });
    });
});
