import ClaimRecord from './ClaimRecord';
import Immutable from 'immutable';
import { dataCollection, journalArticle } from 'mock/data/testing/records';
import locale from 'locale/forms';
import validationErrors from 'locale/validationErrors';
import { CLAIM_PRE_CHECK } from 'repositories/routes';
import React from 'react';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        navigate: testProps.navigate || jest.fn(),
        dirty: true,
        form: 'form',
        initialized: false,
        invalid: false,
        submitFailed: false,
        submitSucceeded: false,
        valid: true,
        pure: true,
        submitAsSideEffect: false,
        pristine: true,
        submitting: false,
        initialValues:
            testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(journalArticle),
                author: Immutable.Map({ aut_id: 410 }),
            }),
        handleSubmit: testProps.handleSubmit || jest.fn(),
        actions: testProps.actions || { loadFullRecordToClaim: jest.fn(), clearClaimPublication: jest.fn() },
        publicationToClaimFileUploadingError: testProps.publicationToClaimFileUploadingError || false,
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <ClaimRecord {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component ClaimRecord ', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let contributorValidationMock;
    beforeEach(() => {
        ReduxFormMock.Field.mockImplementation(
            ({ name, title, required, disable, label, floatingLabelText, validate }) => {
                if (name === 'contributorLinking') contributorValidationMock = validate;
                return (
                    <field
                        is="mock"
                        name={name}
                        title={title}
                        required={required}
                        disabled={disable}
                        label={label || floatingLabelText}
                    />
                );
            },
        );
    });

    it('should render claim publication form', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(5);
        expect(container).toMatchSnapshot();
    });

    it(
        'should render publication citation, error message if publication has PID and ' +
            'it was claimed by current author already',
        () => {
            const props = {
                initialValues: Immutable.Map({
                    author: Immutable.Map({ aut_id: 410 }),
                    publication: Immutable.Map({
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
                    }),
                }),
            };

            const { container } = setup({ ...props });
            expect(container.getElementsByTagName('field').length).toEqual(0);
            // // expect(wrapper.find('Alert').length).toEqual(1);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
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

            const { container } = setup({
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(container.getElementsByTagName('field').length).toEqual(4);
            // // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

            expect(container).toMatchSnapshot();
        },
    );

    it('should render claim form, contributor linking component should not be rendered for Journal Article', () => {
        const { container } = setup({
            initialValues: Immutable.Map({
                publication: Immutable.Map(journalArticle),
                author: Immutable.Map({ aut_id: 410 }),
            }),
        });

        expect(container.getElementsByTagName('field').length).toEqual(5);
        // // expect(wrapper.find('Alert').length).toEqual(0);
        // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

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
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(container.getElementsByTagName('field').length).toEqual(5);
            // // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

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
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(container.getElementsByTagName('field').length).toEqual(4);
            // // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

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
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(container.getElementsByTagName('field').length).toEqual(5);
            // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

            expect(container).toMatchSnapshot();
        },
    );

    it('should show contributor as linked', () => {
        const props = {
            initialValues: Immutable.Map({
                author: Immutable.Map({ aut_id: 410 }),
                publication: Immutable.Map({
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
                }),
            }),
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('should return and render alert message depending on form status', () => {
        const testCases = [
            {
                parameters: {
                    submitting: true,
                    alertLocale: {
                        progressAlert: {
                            title: 'submitting',
                            message: 'submitting',
                            type: 'info',
                            showLoader: true,
                        },
                    },
                },
            },
            {
                parameters: {
                    submitSucceeded: true,
                    alertLocale: {
                        successAlert: {
                            title: 'submitSucceeded',
                            message: 'submitSucceeded',
                            type: 'done',
                        },
                    },
                },
            },
            {
                parameters: {
                    submitFailed: true,
                    error: 'This is an error',
                    alertLocale: {
                        errorAlert: {
                            title: 'submitFailed',
                            message: jest.fn(),
                            type: 'error',
                        },
                    },
                },
            },
            {
                parameters: {
                    dirty: true,
                    invalid: true,
                    error: null,
                    formErrors: {
                        rek_title: 'one',
                        rek_date: 'two',
                    },
                    alertLocale: {
                        validationAlert: {
                            title: 'validationError',
                            message: 'validationError',
                            type: 'warning',
                        },
                    },
                },
            },
            {
                parameters: {
                    error: 'The given data was invalid.',
                    initialValues: Immutable.Map({
                        publication: Immutable.Map({ rek_pid: null }),
                        author: Immutable.Map({ aut_id: 410 }),
                    }),
                    alertLocale: {
                        publicationFailedToClaimAlert: {
                            title: 'External pub api error',
                            message: 'External pub api error',
                            type: 'error',
                        },
                    },
                },
            },
        ];

        testCases.forEach(testCase => {
            const { container } = setup({ ...testCase.parameters });
            expect(container).toMatchSnapshot();
        });
    });

    it('should show the loader', () => {
        const props = {
            fullPublicationToClaimLoading: true,
            actions: {
                loadFullRecordToClaim: jest.fn(() => null),
                clearClaimPublication: jest.fn(),
            },
            initialValues: Immutable.Map({
                author: Immutable.Map({ aut_id: 410 }),
                publication: null,
            }),
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('should render default message error', () => {
        const testArticle = {
            ...journalArticle,
            rek_pid: null,
        };

        const { getByText } = setup({
            submitFailed: true,
            initialValues: Immutable.Map({
                publication: Immutable.Map(testArticle),
                author: Immutable.Map({ aut_id: 410 }),
            }),
            error: { message: 'test' },
        });

        expect(getByText(locale.forms.claimPublicationForm.errorAlert.incompleteData)).toBeInTheDocument();
    });

    it('should render custom error message when the pre check request failed', () => {
        const customErrorMessage = 'custom error message';
        const props = {
            submitFailed: true,
            error: {
                message: 'test',
                original: {
                    data: customErrorMessage,
                },
                request: {
                    responseURL: CLAIM_PRE_CHECK().apiUrl,
                },
            },
            initialValues: Immutable.Map({
                author: Immutable.Map({ aut_id: 410 }),
                publication: Immutable.Map({
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
                }),
            }),
        };

        const { getByText } = setup({ ...props });
        expect(getByText(customErrorMessage)).toBeInTheDocument();
    });

    it('should render when claiming from "Add missing record" page', () => {
        const { getByTestId, rerender } = setup({
            initialValues: {
                get: () => ({
                    toJS: () => ({
                        sources: {},
                    }),
                }),
            },
        });

        setup(
            {
                submitSucceeded: true,
                initialValues: {
                    get: () => ({
                        toJS: () => ({
                            sources: {},
                        }),
                    }),
                },
            },
            rerender,
        );

        expect(getByTestId('cancel-dialog-box')).toHaveTextContent(
            locale.forms.claimPublicationForm.successWorkflowConfirmation.addRecordButtonLabel,
        );
    });

    it('should display confirmation box after successful submission', () => {
        const { getByTestId, rerender } = setup();
        const clearNewRecordMock = jest.fn();
        const clearRedirectPathMock = jest.fn();
        const mockUseNavigate = jest.fn();
        setup(
            {
                submitSucceeded: true,
                redirectPath: '/test',
                actions: {
                    clearNewRecord: clearNewRecordMock,
                    clearRedirectPath: clearRedirectPathMock,
                    clearClaimPublication: jest.fn(),
                },
                navigate: mockUseNavigate,
            },
            rerender,
        );

        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/records/mine');
        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/test');
        expect(clearNewRecordMock).toBeCalled();
        expect(clearRedirectPathMock).toBeCalled();
    });

    it('should display confirmation box after successful submission and go back to previous page', () => {
        const { getByTestId, rerender } = setup();
        const mockUseNavigate = jest.fn();
        setup(
            {
                submitSucceeded: true,
                navigate: mockUseNavigate,
            },
            rerender,
        );

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith(-1);
    });

    it('should render the confirm dialog with an alert due to a file upload error', () => {
        const { container, getByTestId, getByText, rerender } = setup();
        const mockUseNavigate = jest.fn();
        setup(
            {
                submitSucceeded: true,
                publicationToClaimFileUploadingError: true,
                navigate: mockUseNavigate,
            },
            rerender,
        );

        expect(getByText(/File upload and\/or edits\/changes\/comments post failed/i)).toBeInTheDocument();
        fireEvent.click(getByTestId('alternate-dialog-box'));

        expect(mockUseNavigate).toBeCalledWith('/records/UQ:676287/fix');
        expect(container).toMatchSnapshot();
    });

    it('should go back to previous page on cancel', () => {
        const clearNewRecordMock = jest.fn();
        const mockUseNavigate = jest.fn();
        const { getByText } = setup({
            actions: {
                loadFullRecordToClaim: jest.fn(),
                clearNewRecord: clearNewRecordMock,
                clearClaimPublication: jest.fn(),
            },
            navigate: mockUseNavigate,
        });

        fireEvent.click(getByText('Cancel this claim'));
        expect(clearNewRecordMock).toBeCalled();
        expect(mockUseNavigate).toBeCalledWith(-1);
    });

    it('should redirect if no author or record set', () => {
        const mockUseNavigate = jest.fn();
        setup({ initialValues: Immutable.Map({ author: null }), navigate: mockUseNavigate });
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
            initialValues: Immutable.Map({
                publication: Immutable.Map(testArticle),
                author: Immutable.Map({ aut_id: 410 }),
            }),
        });

        const contributorLinking = { authors: [], valid: false };
        expect(contributorValidationMock(contributorLinking)).toEqual(
            validationErrors.validationErrors.contributorLinking,
        );
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
            initialValues: Immutable.Map({
                publication: Immutable.Map(testArticle),
                author: Immutable.Map({ aut_id: 410 }),
            }),
        });

        const contributorLinking = { authors: [], valid: true };
        expect(contributorValidationMock(contributorLinking)).toEqual('');
    });
});
