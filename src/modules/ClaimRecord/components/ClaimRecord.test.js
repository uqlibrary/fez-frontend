import ClaimRecord, { getAlertProps } from './ClaimRecord';
import Immutable from 'immutable';
import { dataCollection, journalArticle, mockRecordToDelete } from 'mock/data/testing/records';
import validationErrors from 'locale/validationErrors';
import { CLAIM_PRE_CHECK, EXISTING_RECORD_API, FILE_UPLOAD_API } from 'repositories/routes';
import React from 'react';
import { render, WithReduxStore, WithRouter, fireEvent, preview, waitForElementToBeRemoved } from 'test-utils';
import * as hooks from '../../../hooks';
import { waitFor } from '@testing-library/dom';
import * as repositories from '../../../repositories';
import locale from 'locale/forms';

const mockUseNavigate = jest.fn();
/* eslint-disable react/prop-types */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

const mockClearNewRecord = jest.fn();
const mockClearRedirectPath = jest.fn();
const mockLoadFullRecordToClaim = jest.fn();
const mockClearClaimPublication = jest.fn();

/* eslint-disable react/prop-types */
jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    clearNewRecord: () => mockClearNewRecord,
    clearRedirectPath: () => mockClearRedirectPath,
    clearClaimPublication: () => mockClearClaimPublication,
    loadFullRecordToClaim: () => mockLoadFullRecordToClaim,
}));

function setup(props = {}, renderMethod = render) {
    const state = Immutable.Map({
        accountReducer: {
            author: props.hasOwnProperty('author') ? props.author : { aut_id: 410 },
        },
        claimPublicationReducer: {
            publicationToClaim: props.publication || journalArticle,
            fullPublicationToClaim: props.fullPublicationToClaim || false,
            fullPublicationToClaimLoading: props.fullPublicationToClaimLoading || false,
            publicationToClaimFileUploadingError: props.publicationToClaimFileUploadingError || false,
        },
    });

    return renderMethod(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <ClaimRecord />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component ClaimRecord ', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render claim publication form', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it(
        'should render publication citation, error message if publication has PID and ' +
            'it was claimed by current author already',
        () => {
            const props = {
                publication: {
                    ...journalArticle,
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id: 410,
                            rek_author_id_order: 1,
                        },
                        {
                            rek_author_id: 0,
                            rek_author_id_order: 2,
                        },
                    ],
                    fez_record_search_key_author: [
                        {
                            rek_author_id: null,
                            rek_author_pid: 'UQ:111111',
                            rek_author: 'Smith, A',
                            rek_author_order: 1,
                        },
                        {
                            rek_author_id: null,
                            rek_author_pid: 'UQ:222222',
                            rek_author: 'Smith, J',
                            rek_author_order: 2,
                        },
                    ],
                },
            };

            const { container } = setup(props);
            expect(container).toMatchSnapshot();
        },
    );

    it(
        "should render claim form if publication doesn't have a PID but current author " +
            'was assigned (author linking component should not be rendered)',
        () => {
            const testArticle = {
                ...journalArticle,
                rek_pid: null,
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 410,
                        rek_author_id_order: 1,
                    },
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 2,
                    },
                ],
                fez_record_search_key_author: [
                    {
                        rek_author_id: null,
                        rek_author_pid: 'UQ:111111',
                        rek_author: 'Smith, A',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: null,
                        rek_author_pid: 'UQ:222222',
                        rek_author: 'Smith, J',
                        rek_author_order: 2,
                    },
                ],
            };

            const { container } = setup({ publication: testArticle });
            expect(container).toMatchSnapshot();
        },
    );

    it('should render claim form, contributor linking component should not be rendered for Journal Article', () => {
        const { container } = setup({
            publication: journalArticle,
        });
        expect(container).toMatchSnapshot();
    });

    it(
        "should render claim form, author linking component should be rendered even if there's" +
            ' only one author on a publication',
        () => {
            const testArticle = {
                ...journalArticle,
                rek_pid: null,
                fez_record_search_key_author_id: [],
                fez_record_search_key_author: [
                    {
                        rek_author_id: null,
                        rek_author_pid: 'UQ:10000',
                        rek_author: 'Smith, J',
                        rek_author_order: 1,
                    },
                ],
            };

            const { container } = setup({
                publication: testArticle,
            });

            expect(container).toMatchSnapshot();
        },
    );

    it(
        "should render claim form, contributor linking component should be rendered even if there's" +
            ' only one contributor on a publication',
        () => {
            const testArticle = {
                ...dataCollection,
                rek_pid: null,
                fez_record_search_key_author: [],
                fez_record_search_key_author_id: [],
                fez_record_search_key_contributor_id: [],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor_id: null,
                        rek_contributor_pid: 'UQ:10000',
                        rek_contributor: 'Smith, J',
                        rek_contributor_order: 1,
                    },
                ],
            };

            const { container } = setup({
                publication: testArticle,
            });

            expect(container).toMatchSnapshot();
        },
    );

    it(
        'should render claim form, author linking component and contributor linking component should be' +
            ' rendered even if there are only one author and one contributor on a publication',
        () => {
            const testArticle = {
                ...dataCollection,
                rek_pid: null,
                fez_record_search_key_author_id: [],
                fez_record_search_key_author: [
                    {
                        rek_author_id: null,
                        rek_author_pid: 'UQ:10000',
                        rek_author: 'Smith, J',
                        rek_author_order: 1,
                    },
                ],
                fez_record_search_key_contributor_id: [],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor_id: null,
                        rek_contributor_pid: 'UQ:10000',
                        rek_contributor: 'Smith, J',
                        rek_contributor_order: 1,
                    },
                ],
            };

            const { container } = setup({
                publication: testArticle,
            });

            expect(container).toMatchSnapshot();
        },
    );

    it('should show contributor as linked', () => {
        const props = {
            publication: {
                ...journalArticle,
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id: 410,
                        rek_contributor_id_order: 1,
                    },
                    {
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 2,
                    },
                ],
            },
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    // it('should return and render alert message depending on form status', () => {
    //     const testCases = [
    //         {
    //             parameters: {
    //                 isSubmitting: true,
    //                 alertLocale: {
    //                     progressAlert: {
    //                         title: 'submitting',
    //                         message: 'submitting',
    //                         type: 'info',
    //                         showLoader: true,
    //                     },
    //                 },
    //             },
    //         },
    //         {
    //             parameters: {
    //                 submitSucceeded: true,
    //                 alertLocale: {
    //                     successAlert: {
    //                         title: 'submitSucceeded',
    //                         message: 'submitSucceeded',
    //                         type: 'done',
    //                     },
    //                 },
    //             },
    //         },
    //         {
    //             parameters: {
    //                 submitFailed: true,
    //                 error: 'This is an error',
    //                 alertLocale: {
    //                     errorAlert: {
    //                         title: 'submitFailed',
    //                         message: jest.fn(),
    //                         type: 'error',
    //                     },
    //                 },
    //             },
    //         },
    //         {
    //             parameters: {
    //                 dirty: true,
    //                 invalid: true,
    //                 error: null,
    //                 formErrors: {
    //                     rek_title: 'one',
    //                     rek_date: 'two',
    //                 },
    //                 alertLocale: {
    //                     validationAlert: {
    //                         title: 'validationError',
    //                         message: 'validationError',
    //                         type: 'warning',
    //                     },
    //                 },
    //             },
    //         },
    //         {
    //             parameters: {
    //                 error: 'The given data was invalid.',
    //                 alertLocale: {
    //                     publicationFailedToClaimAlert: {
    //                         title: 'External pub api error',
    //                         message: 'External pub api error',
    //                         type: 'error',
    //                     },
    //                 },
    //             },
    //         },
    //     ];
    //
    //     testCases.forEach(testCase => {
    //         expect(getAlertProps(testCase.parameters)).toMatchSnapshot();
    //     });
    // });

    it('should show the loader', () => {
        const props = {
            publication: null,
            fullPublicationToClaimLoading: true,
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('should render default server error message', () => {
        const testArticle = {
            ...journalArticle,
            rek_pid: null,
        };

        const { getByText } = setup({
            publication: testArticle,
        });

        expect(getByText(locale.forms.claimPublicationForm.errorAlert.incompleteData)).toBeInTheDocument();
    });

    it('should render custom error message when the pre check request failed', () => {
        const customErrorMessage = 'custom error message';
        const props = {
            publication: {
                ...journalArticle,
                rek_pid: undefined,
                fez_record_search_key_author_id: [
                    {
                        rek_author_id: 0,
                        rek_author_id_order: 1,
                    },
                ],
                fez_record_search_key_author: [
                    {
                        rek_author_id: null,
                        rek_author_pid: 'UQ:111111',
                        rek_author: 'Smith, A',
                        rek_author_order: 1,
                    },
                ],
            },
        };

        const { getByText } = setup({ ...props });
        expect(getByText(customErrorMessage)).toBeInTheDocument();
    });

    it('should render when claiming from "Add missing record" page', () => {
        const { getByTestId, rerender } = setup();

        setup(
            {
                // submitSucceeded: true,
            },
            rerender,
        );

        expect(getByTestId('cancel-dialog-box')).toHaveTextContent(
            locale.forms.claimPublicationForm.successWorkflowConfirmation.addRecordButtonLabel,
        );
    });

    it('should display confirmation box after successful submission', () => {
        const { getByTestId, rerender } = setup();
        const mockClearNewRecord = jest.fn();
        const mockClearRedirectPath = jest.fn();

        setup(
            {
                submitSucceeded: true,
                redirectPath: '/test',
            },
            rerender,
        );

        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/records/mine');
        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/test');
        expect(mockClearNewRecord).toBeCalled();
        expect(mockClearRedirectPath).toBeCalled();
    });

    it('should display confirmation box after successful submission and go back to previous page', () => {
        const { getByTestId, rerender } = setup();

        setup(
            {
                submitSucceeded: true,
            },
            rerender,
        );

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith(-1);
    });

    it('should render the confirm dialog with an alert due to a file upload error', async () => {
        mockApi
            .onGet(repositories.routes.EXISTING_RECORD_API({ pid: '.*' }).apiUrl)
            .replyOnce(200, {
                data: journalArticle,
            })
            .onPost(FILE_UPLOAD_API().apiUrl)
            .replyOnce(500, {
                message: locale.forms.claimPublicationForm.errorAlert.fileUploadError,
            });

        const { getByTestId, getByText, queryByText, rerender } = setup({ publicationToClaimFileUploadingError: true });

        fireEvent.click(getByTestId('rek-author-id-1'));
        fireEvent.click(getByTestId('author-accept-declaration-input'));
        fireEvent.click(getByTestId('claim-record-submit'));
        await waitForElementToBeRemoved(() => queryByText(locale.forms.claimPublicationForm.progressAlert.message));
        // setup({ publicationToClaimFileUploadingError: true }, rerender);
        //
        // dd(debug(null, 10000000));
        // await waitFor(() => getByText(/File upload and\/or edits\/changes\/comments post failed/i));
        preview.debug();
        // waitFor(() => getByText(/File upload and\/or edits\/changes\/comments post failed/i));
        // fireEvent.click(getByTestId('alternate-dialog-box'));
        //
        // expect(mockUseNavigate).toBeCalledWith('/records/UQ:676287/fix');
        // expect(container).toMatchSnapshot();
    });

    it('should go back to previous page on cancel', () => {
        const { getByText } = setup({});

        fireEvent.click(getByText('Cancel this claim'));

        expect(mockClearNewRecord).toBeCalled();
        expect(mockUseNavigate).toBeCalledWith(-1);
    });

    it('should redirect if no author or record set', () => {
        setup({ author: null });
        expect(mockUseNavigate).toHaveBeenCalled();
    });

    it('should validate contributor with contributor only', () => {
        const testArticle = {
            ...dataCollection,
            rek_pid: null,
            fez_record_search_key_author: [],
            fez_record_search_key_author_id: [],
            fez_record_search_key_contributor_id: [],
            fez_record_search_key_contributor: [
                {
                    rek_contributor_pid: 'UQ:10000',
                    rek_contributor: 'Smith, J',
                    rek_contributor_order: 1,
                },
            ],
        };

        setup({
            publication: testArticle,
        });

        const contributorLinking = { authors: [], valid: false };
        // expect(mockContributorValidation(contributorLinking)).toEqual(
        //     validationErrors.validationErrors.contributorLinking,
        // );
    });

    it('should validate contributor with authors and contributors', () => {
        const testArticle = {
            ...dataCollection,
            rek_pid: null,
            fez_record_search_key_contributor_id: [],
            fez_record_search_key_contributor: [
                {
                    rek_contributor_pid: 'UQ:10000',
                    rek_contributor: 'Smith, J',
                    rek_contributor_order: 1,
                },
            ],
        };

        setup({
            publication: testArticle,
        });

        const contributorLinking = { authors: [], valid: true };
        // expect(mockContributorValidation(contributorLinking)).toEqual('');
    });
});
