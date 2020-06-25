import ClaimRecord from './ClaimRecord';
import Immutable from 'immutable';
import { journalArticle, dataCollection } from 'mock/data/testing/records';
import { validation } from 'config';
import locale from 'locale/forms';

function setup(testProps = {}) {
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
        actions: testProps.actions || { loadFullRecordToClaim: jest.fn() },
        history: testProps.history || {
            push: jest.fn(),
            go: jest.fn(),
        },
        publicationToClaimFileUploadingError: testProps.publicationToClaimFileUploadingError || false,
        ...testProps,
    };
    return getElement(ClaimRecord, props);
}

describe('Component ClaimRecord ', () => {
    it('should render claim publication form', () => {
        const wrapper = setup();
        expect(wrapper.find('Field').length).toEqual(5);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render when claiming from "Add missing record" page', () => {
        const wrapper = setup({
            initialValues: {
                get: () => ({
                    toJS: () => ({
                        sources: {},
                    }),
                }),
            },
        });
        expect(wrapper.find('WithStyles(ConfirmDialogBox)').props().locale.cancelButtonLabel).toBe(
            locale.forms.claimPublicationForm.successWorkflowConfirmation.addRecordButtonLabel,
        );
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

            const wrapper = setup({ ...props });
            expect(wrapper.find('Field').length).toEqual(0);
            // // expect(wrapper.find('Alert').length).toEqual(1);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);
            expect(toJson(wrapper)).toMatchSnapshot();
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

            const wrapper = setup({
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(wrapper.find('Field').length).toEqual(4);
            // // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

            expect(toJson(wrapper)).toMatchSnapshot();
        },
    );

    it('should render claim form, contributor linking component should not be rendered for Journal Article', () => {
        const wrapper = setup({
            initialValues: Immutable.Map({
                publication: Immutable.Map(journalArticle),
                author: Immutable.Map({ aut_id: 410 }),
            }),
        });

        expect(wrapper.find('Field').length).toEqual(5);
        // // expect(wrapper.find('Alert').length).toEqual(0);
        // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

        expect(toJson(wrapper)).toMatchSnapshot();
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

            const wrapper = setup({
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(wrapper.find('Field').length).toEqual(5);
            // // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

            expect(toJson(wrapper)).toMatchSnapshot();
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

            const wrapper = setup({
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(wrapper.find('Field').length).toEqual(4);
            // // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

            expect(toJson(wrapper)).toMatchSnapshot();
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

            const wrapper = setup({
                initialValues: Immutable.Map({
                    publication: Immutable.Map(testArticle),
                    author: Immutable.Map({ aut_id: 410 }),
                }),
            });

            expect(wrapper.find('Field').length).toEqual(5);
            // expect(wrapper.find('Alert').length).toEqual(0);
            // expect(wrapper.find('withRouter(Connect(PublicationCitation))').length).toEqual(1);

            expect(toJson(wrapper)).toMatchSnapshot();
        },
    );

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
            const wrapper = setup({ ...testCase.parameters });
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    it('should set local variables', () => {
        const wrapper = setup();
        wrapper.setState({ selectedRecordAction: 'unclaim' });
        wrapper.instance()._setSuccessConfirmation('successBox');
        wrapper.update();
        expect(wrapper.instance().successConfirmationBox).toEqual('successBox');
    });

    it('should redirect if no author or record set', () => {
        const testMethod = jest.fn();
        setup({ initialValues: Immutable.Map({ author: null }), history: { go: testMethod } });
        expect(testMethod).toHaveBeenCalled();
    });

    it('should display confirmation box after successful submission', () => {
        const testMethod = jest.fn();
        const wrapper = setup();
        wrapper.instance().successConfirmationBox = { showConfirmation: testMethod };
        wrapper.instance().UNSAFE_componentWillReceiveProps({ submitSucceeded: true });
        expect(testMethod).toHaveBeenCalled();
    });

    it('should clear record to fix when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ actions: { clearClaimPublication: actionFunction, loadFullRecordToClaim: jest.fn() } });
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });

    it('should redirect to other pages', () => {
        const testMethod = jest.fn();
        const goBack = jest.fn();

        const wrapper = setup({ history: { push: testMethod, goBack: goBack } });

        wrapper.instance()._navigateToMyResearch();
        expect(testMethod).toHaveBeenCalledWith('/records/mine');

        wrapper.instance()._cancelClaim();
        expect(goBack).toHaveBeenCalled();

        wrapper.instance()._navigateToFixRecord();
        expect(testMethod).toHaveBeenCalledWith('/records/UQ:676287/fix');
    });

    it('should redirect back to previous location on claim more publications', () => {
        const testMethod = jest.fn();
        const goBack = jest.fn();

        const wrapper = setup({ history: { push: testMethod, goBack: goBack } });

        wrapper.instance()._claimAnother();
        expect(goBack).toHaveBeenCalled();
    });

    it('should redirect to specified location on add another missing record', () => {
        const testMethod = jest.fn();
        const goBack = jest.fn();
        const clearRedirectPath = jest.fn();

        const wrapper = setup({
            history: { push: testMethod, goBack: goBack },
            redirectPath: '/records/add/find',
            actions: {
                clearRedirectPath: clearRedirectPath,
                loadFullRecordToClaim: jest.fn(),
            },
        });

        wrapper.instance()._claimAnother();
        expect(testMethod).toHaveBeenCalledWith('/records/add/find');
    });

    it('should render navigation prompt', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.setProps({ dirty: true });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render the confirm dialog with an alert due to a file upload error', () => {
        const wrapper = setup({ publicationToClaimFileUploadingError: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render the confirm dialog without an alert due to file upload success', () => {
        const wrapper = setup({ publicationToClaimFileUploadingError: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle default form submit', () => {
        const preventDefaultFn = jest.fn();
        const wrapper = setup();
        wrapper
            .find('form')
            .props()
            .onSubmit({ preventDefault: preventDefaultFn });
        expect(preventDefaultFn).toHaveBeenCalled();
    });

    it('should validate contributor', () => {
        const validateFunction = jest.spyOn(validation, 'isValidContributorLink');
        const getInitialValues = authorArray => ({
            get: () => ({
                toJS: () => ({
                    fez_record_search_key_author: authorArray,
                }),
            }),
        });
        const wrapper = setup({
            initialValues: getInitialValues(['test']),
        });
        const testLink = 'http://test.com';
        wrapper.instance()._contributorValidation(testLink);
        expect(validateFunction).toBeCalledWith(testLink);

        wrapper.setProps({
            initialValues: getInitialValues([]),
        });
        wrapper.instance()._contributorValidation(testLink);
        expect(validateFunction).toBeCalledWith(testLink, true);
    });

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

        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show alert if submit failed and PID not found', () => {
        const { journalArticleWithoutPid } = journalArticle;
        const props = {
            initialValues: Immutable.Map({
                author: Immutable.Map({ aut_id: 410 }),
                publication: Immutable.Map({
                    ...journalArticleWithoutPid,
                }),
            }),
            submitFailed: true,
        };

        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should show the loader', () => {
        const props = {
            fullPublicationToClaimLoading: true,
            actions: {
                loadFullRecordToClaim: jest.fn(() => null),
            },
            initialValues: Immutable.Map({
                author: Immutable.Map({ aut_id: 410 }),
                publication: null,
            }),
        };

        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
