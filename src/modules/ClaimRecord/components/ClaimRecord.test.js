import ClaimRecord from './ClaimRecord';
import Immutable from 'immutable';
import { dataCollection, journalArticle } from 'mock/data/testing/records';
import validationErrors from 'locale/validationErrors';
import { CLAIM_PRE_CHECK, EXISTING_RECORD_API, FILE_UPLOAD_API, NEW_RECORD_API } from 'repositories/routes';
import React from 'react';
import {
    render,
    WithReduxStore,
    WithRouter,
    fireEvent,
    waitFor,
    waitForElementToBeRemoved,
    addFilesToFileUploader,
    setFileUploaderFilesToClosedAccess,
    screen,
} from 'test-utils';
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

let mockContributorValidation;

jest.mock('../../SharedComponents/Toolbox/ReactHookForm/components/Field', () => {
    const OriginalField = jest.requireActual('../../SharedComponents/Toolbox/ReactHookForm/components/Field').default;

    return function MockField({ name, validate = [], ...props }) {
        // Capture the first validator when the name is 'contributorLinking'
        if (name === 'contributorLinking' && validate.length > 0) {
            mockContributorValidation = validate[0];
        }
        // Render the original Field component with the rest of the props
        return <OriginalField name={name} validate={validate} {...props} />;
    };
});

function setup(props = {}, renderMethod = render) {
    const defaultRecord = {
        ...journalArticle,
        fez_record_search_key_content_indicator: [
            {
                rek_content_indicator_id: 1,
                rek_content_indicator_pid: 'UQ:41878',
                rek_content_indicator: 454079,
                rek_content_indicator_order: 1,
                rek_content_indicator_lookup: 'Scholarship of Teaching and Learning',
            },
            {
                rek_content_indicator_id: 2,
                rek_content_indicator_pid: 'UQ:41878',
                rek_content_indicator: 454080,
                rek_content_indicator_order: 2,
                rek_content_indicator_lookup: 'Protocol',
            },
        ],
    };
    const pid = (props.publication || defaultRecord).rek_pid;
    const state = Immutable.Map({
        appReducer: {
            redirectPath: props.redirectPath,
        },
        accountReducer: {
            author: props.hasOwnProperty('author') ? props.author : { aut_id: 410 },
        },
        claimPublicationReducer: {
            publicationToClaim: { rek_pid: pid },
            fullPublicationToClaim: props.publication || defaultRecord,
            fullPublicationToClaimLoading: props.fullPublicationToClaimLoading || false,
            publicationsClaimedInProgress: props.publicationsClaimedInProgress || [],
            publicationToClaimFileUploadingError: props.publicationToClaimFileUploadingError || false,
        },
    });

    mockApi.onGet(EXISTING_RECORD_API({ pid: pid }).apiUrl).reply(200, { data: props.publication || defaultRecord });
    return renderMethod(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <ClaimRecord />
            </WithRouter>
        </WithReduxStore>,
    );
}
describe('Component ClaimRecord ', () => {
    const fileMock = ['myTestImage.png'];
    const selectAuthor = () => {
        fireEvent.click(screen.getByTestId('rek-author-id-1'));
        fireEvent.click(screen.getByTestId('author-accept-declaration-input'));
    };
    const submitForm = async () => {
        fireEvent.click(screen.getByTestId('claim-record-submit'));
        await waitForElementToBeRemoved(() =>
            screen.queryByText(locale.forms.claimPublicationForm.progressAlert.message),
        );
    };
    beforeEach(() => {
        mockUseNavigate.mockReset();
        mockClearNewRecord.mockReset();
        mockClearRedirectPath.mockReset();
        mockLoadFullRecordToClaim.mockReset();
        mockClearClaimPublication.mockReset();
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

    it('should show the loader', () => {
        const props = {
            publication: null,
            fullPublicationToClaimLoading: true,
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('should render server error', async () => {
        mockApi.onPatch(EXISTING_RECORD_API({ pid: journalArticle.rek_pid }).apiUrl).replyOnce(500);

        const { queryByText, getByTestId, getByText } = setup();

        selectAuthor();
        await submitForm();

        await waitFor(() =>
            queryByText(
                locale.forms.claimPublicationForm.errorAlert.message(
                    'Error has occurred during request and request cannot be processed. Please contact eSpace administrators or try again later.',
                ),
            ),
        );
    });

    it('should render incomplete data error message when trying to claim an incomplete external (non-eSpace) record', async () => {
        mockApi
            .onPost(CLAIM_PRE_CHECK().apiUrl)
            .reply(200, { data: '' })
            .onPost(NEW_RECORD_API().apiUrl)
            .reply(422);

        const { getByText } = setup({
            publication: {
                ...journalArticle,
                rek_pid: null,
            },
        });

        selectAuthor();
        await submitForm();

        expect(getByText(locale.forms.claimPublicationForm.errorAlert.incompleteData)).toBeInTheDocument();
    });

    it('should render custom error message when the pre check request failed', async () => {
        const customErrorMessage = 'Unexpected field rek_pid : UQ:123456';
        mockApi.onPost(CLAIM_PRE_CHECK().apiUrl).reply(() => {
            return [
                500,
                {
                    data: customErrorMessage,
                    request: {
                        responseURL: 'https://api.library.uq.edu.au/staging/external/records/claim/pre-check',
                    },
                },
            ];
        });

        const { getByText } = setup({
            publication: {
                ...journalArticle,
                rek_pid: null,
            },
        });

        selectAuthor();
        await submitForm();

        expect(getByText(customErrorMessage)).toBeInTheDocument();
    });

    it('should display confirmation box after successful submission', async () => {
        mockApi.onPatch(EXISTING_RECORD_API({ pid: journalArticle.rek_pid }).apiUrl).replyOnce(200, {
            data: journalArticle,
        });
        const { getByTestId } = setup({
            redirectPath: '/test',
        });

        selectAuthor();
        await submitForm();
        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/records/mine');
        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/test');
        expect(mockClearNewRecord).toBeCalled();
        expect(mockClearRedirectPath).toBeCalled();
    });

    it('should display confirmation box after successful submission and go back to previous page', async () => {
        mockApi.onPatch(EXISTING_RECORD_API({ pid: journalArticle.rek_pid }).apiUrl).replyOnce(200, {
            data: journalArticle,
        });
        const { getByTestId } = setup();

        selectAuthor();
        await submitForm();

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith(-1);
    });

    it('should render the confirm dialog with an alert due to a file upload error', async () => {
        mockApi
            .onPatch(EXISTING_RECORD_API({ pid: journalArticle.rek_pid }).apiUrl)
            .replyOnce(200, {
                data: journalArticle,
            })
            .onPost(FILE_UPLOAD_API().apiUrl)
            .reply(500);

        const { container, getByText, getByTestId, queryByTestId } = setup();

        selectAuthor();
        addFilesToFileUploader(fileMock);
        await setFileUploaderFilesToClosedAccess(fileMock);
        await waitForElementToBeRemoved(() => queryByTestId('validation-warning-0'));
        await submitForm();
        // assert a file upload error
        await waitFor(() => getByText(/File upload and\/or edits\/changes\/comments post failed/i));
        // navigate to fix page
        fireEvent.click(getByTestId('alternate-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/records/UQ:676287/fix');

        expect(container).toMatchSnapshot();
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
        expect(mockContributorValidation(contributorLinking)).toEqual(
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
            publication: testArticle,
        });

        const contributorLinking = { authors: [], valid: true };
        expect(mockContributorValidation(contributorLinking)).toEqual('');
    });
});
