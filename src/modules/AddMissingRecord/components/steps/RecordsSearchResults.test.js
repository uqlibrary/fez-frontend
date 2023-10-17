import React from 'react';
import RecordsSearchResults from './RecordsSearchResults';
import { accounts } from 'mock/data/account';
import { render, WithReduxStore, WithRouter, waitFor, fireEvent } from 'test-utils';
import { SEARCH_EXTERNAL_RECORDS_API } from 'repositories/routes';

function setup(testProps = {}, renderMethod = render) {
    const props = {
        history: {},
        account: accounts.uqresearcher || testProps.account || {},
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <RecordsSearchResults {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Search record results', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should render stepper and no results', () => {
        const { container } = setup({
            history: {},
        });
        expect(container).toMatchSnapshot();
    });

    it('should render spinner', () => {
        const { container } = setup({
            history: {},
            searchLoading: true,
        });
        expect(container).toMatchSnapshot();
    });

    it(
        'should call componentDidUpdate lifecycle method and focus on ' +
            'create new record button if no publications found',
        () => {
            const pushFn = jest.fn();
            const { getByRole, rerender } = setup({
                publicationList: [],
                history: { push: pushFn },
            });
            setup({ publicationList: [], history: { push: pushFn } }, rerender);

            expect(getByRole('button', { name: 'Create a new eSpace work' })).toHaveFocus();
            fireEvent.click(getByRole('button', { name: 'Create a new eSpace work' }));

            expect(pushFn).toHaveBeenCalled();
        },
    );

    it('should navigate to find on cancel workflow', () => {
        const cancelWorkflow = jest.fn();
        const history = {
            push: cancelWorkflow,
        };

        const { getByRole } = setup({
            history: history,
        });

        fireEvent.click(getByRole('button', { name: 'Abandon and search again' }));
        expect(cancelWorkflow).toBeCalled();
    });

    it(
        'should render a single claimable item with no authors on the record ' +
            '(record should appear in publicationsList prop)',
        async () => {
            const navigateToClaimPublication = jest.fn();
            const setClaimPublication = jest.fn();
            const setRedirectPath = jest.fn();
            const actions = {
                setClaimPublication: setClaimPublication,
                setRedirectPath: setRedirectPath,
            };
            const history = {
                push: navigateToClaimPublication,
            };
            const publicationsList = [
                {
                    rek_pid: 'UQ:795469',
                    rek_title: 'Early Onset Scoliosis - this is an edited book with editors only',
                    rek_description: null,
                    rek_display_type: 174,
                    rek_status: 2,
                    rek_date: '2018-01-01T00:00:00Z',
                    rek_object_type: 3,
                    rek_depositor: 6230,
                    rek_created_date: '2018-03-07T23:30:00Z',
                    rek_updated_date: '2018-03-07T23:30:00Z',
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_doi: {
                        rek_doi_id: 1706187,
                        rek_doi_pid: 'UQ:795469',
                        rek_doi: '10.1007/978-3-319-71580-3',
                    },
                    fez_record_search_key_isbn: [
                        {
                            rek_isbn_id: 1115631,
                            rek_isbn_pid: 'UQ:795469',
                            rek_isbn: '9783319715797',
                            rek_isbn_order: 1,
                        },
                        {
                            rek_isbn_id: 1115632,
                            rek_isbn_pid: 'UQ:795469',
                            rek_isbn: '9783319715803',
                            rek_isbn_order: 2,
                        },
                    ],
                    fez_record_search_key_ismemberof: [
                        {
                            rek_ismemberof_id: 12232758,
                            rek_ismemberof_pid: 'UQ:795469',
                            rek_ismemberof: 'UQ:218198',
                            rek_ismemberof_order: 1,
                            rek_ismemberof_lookup: 'Unprocessed Records',
                        },
                    ],
                    fez_record_search_key_oa_status: {
                        rek_oa_status_id: 531834,
                        rek_oa_status_pid: 'UQ:795469',
                        rek_oa_status: 453692,
                        rek_oa_status_lookup: 'Not yet assessed',
                    },
                    fez_record_search_key_place_of_publication: {
                        rek_place_of_publication_id: 4368221,
                        rek_place_of_publication_pid: 'UQ:795469',
                        rek_place_of_publication: 'Cham',
                    },
                    fez_record_search_key_publisher: {
                        rek_publisher_id: 4678387,
                        rek_publisher_pid: 'UQ:795469',
                        rek_publisher: 'Springer International Publishing',
                    },
                    rek_status_lookup: 'Published',
                    rek_object_type_lookup: 'Record',
                    rek_wok_doc_type_lookup: null,
                    rek_display_type_lookup: 'Book',
                    rek_scopus_doc_type_lookup: null,
                    rek_pubmed_doc_type_lookup: null,
                    sources: [
                        {
                            source: 'espace',
                            id: 'UQ:795469',
                        },
                        {
                            source: 'crossref',
                            id: '10.1007/978-3-319-71580-3',
                        },
                    ],
                    currentSource: 'espace',
                },
            ];

            const { getByTestId, getByRole, container } = setup({
                history: history,
                actions: actions,
                publicationsList: publicationsList,
            });

            await waitFor(() => getByTestId('publication-citation-parent-UQ:795469'), { timeout: 2000, delay: 1000 });

            fireEvent.click(getByRole('button', { name: 'Claim this work' }));

            expect(setClaimPublication).toBeCalledWith(publicationsList[0]);
            expect(navigateToClaimPublication).toBeCalledWith('/records/claim');
            expect(setRedirectPath).toBeCalledWith('/records/add/find');
            expect(container).toMatchSnapshot();
        },
    );

    it(
        'should render a single unclaimable item with no authors on the record ' +
            '(record should appear in publicationsListSubset prop)',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:795469',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id: 111,
                            rek_contributor_id_order: 1,
                        },
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id: 222,
                            rek_contributor_id_order: 2,
                        },
                    ],
                    fez_record_search_key_doi: {
                        rek_doi_id: 1706187,
                        rek_doi_pid: 'UQ:795469',
                        rek_doi: '10.1007/978-3-319-71580-3',
                    },
                    sources: [
                        {
                            source: 'espace',
                            id: 'UQ:795469',
                        },
                        {
                            source: 'crossref',
                            id: '10.1007/978-3-319-71580-3',
                        },
                    ],
                    currentSource: 'espace',
                },
            ];

            const { container } = setup({
                publicationsList: publicationsList,
            });
            expect(container).toMatchSnapshot();
        },
    );

    it(
        'should render a single unclaimable item with no authors on the record ' +
            '(record should appear in publicationsListSubset prop) with full mount',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:795469',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id: 111,
                            rek_contributor_id_order: 1,
                        },
                        {
                            rek_contributor_id_id: 28581254,
                            rek_contributor_id_pid: 'UQ:70915',
                            rek_contributor_id: 222,
                            rek_contributor_id_order: 2,
                        },
                    ],
                    fez_record_search_key_doi: {
                        rek_doi_id: 1706187,
                        rek_doi_pid: 'UQ:795469',
                        rek_doi: '10.1007/978-3-319-71580-3',
                    },
                    sources: [
                        {
                            source: 'espace',
                            id: 'UQ:795469',
                        },
                        {
                            source: 'crossref',
                            id: '10.1007/978-3-319-71580-3',
                        },
                    ],
                    currentSource: 'espace',
                },
            ];

            const { container } = setup({ publicationsList: publicationsList });
            expect(container).toMatchSnapshot();
        },
    );

    it(
        'should render publications list with one publication to be able to claim ' +
            '(record should not appear in publicationsListSubset prop)',
        () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:255472',
                    fez_record_search_key_author: [
                        {
                            rek_author_id: 29052679,
                            rek_author_pid: 'UQ:255472',
                            rek_author: 'Jory, Patrick',
                            rek_author_order: 1,
                        },
                        {
                            rek_author_id: 29052680,
                            rek_author_pid: 'UQ:255472',
                            rek_author: 'Montesano, Michael J.',
                            rek_author_order: 2,
                        },
                    ],
                    fez_record_search_key_author_id: [
                        {
                            rek_author_id_id: 28420647,
                            rek_author_id_pid: 'UQ:255472',
                            rek_author_id: 86825,
                            rek_author_id_order: 1,
                            rek_author_id_lookup: 'Patrick Jory',
                        },
                        {
                            rek_author_id_id: 28420648,
                            rek_author_id_pid: 'UQ:255472',
                            rek_author_id: 0,
                            rek_author_id_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor: [],
                    fez_record_search_key_contributor_id: [],
                },
            ];

            const { container } = setup({
                publicationsList: publicationsList,
            });
            expect(container).toMatchSnapshot();
        },
    );

    it('should not return unclaimablePublicationsList (no pid)', async () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_author_id_id: 28420648,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 0,
                        rek_author_id_order: 2,
                    },
                ],
            },
        ];
        mockApi.onPost(SEARCH_EXTERNAL_RECORDS_API({}).apiUrl).replyOnce(200, {
            data: publicationsList,
        });

        const { getByTestId, getByRole } = setup();
        await waitFor(() => getByTestId('standard-card-no-matching-works-found-header'));
        expect(getByRole('heading', { name: 'No matching works found' }));
    });

    it('should not return unclaimablePublicationsList (number of authors !== number of author_ids)', async () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                ],
            },
        ];

        mockApi.onPost(SEARCH_EXTERNAL_RECORDS_API({}).apiUrl).replyOnce(200, {
            data: publicationsList,
        });

        const { getByTestId, getByRole } = setup();
        await waitFor(() => getByTestId('standard-card-no-matching-works-found-header'));
        expect(getByRole('heading', { name: 'No matching works found' }));
    });

    it(
        'should not return unclaimablePublicationsList (number of authors === 0 ' +
            'AND number of contributors !== number of contributor_id)',
        async () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:255472',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 3210380,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'El-Hawary, Ron',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 3210381,
                            rek_contributor_pid: 'UQ:795469',
                            rek_contributor_xsdmf_id: null,
                            rek_contributor: 'Eberson, Craig P.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [],
                },
            ];

            mockApi.onPost(SEARCH_EXTERNAL_RECORDS_API({}).apiUrl).replyOnce(200, {
                data: publicationsList,
            });

            const { getByTestId, getByRole } = setup();
            await waitFor(() => getByTestId('standard-card-no-matching-works-found-header'));
            expect(getByRole('heading', { name: 'No matching works found' }));
        },
    );

    it('should not return unclaimablePublicationsList (found author ids, but one of them is 0)', async () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_author_id_id: 28420648,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 0,
                        rek_author_id_order: 2,
                    },
                ],
                fez_record_search_key_contributor: [],
                fez_record_search_key_contributor_id: [],
            },
        ];

        mockApi.onPost(SEARCH_EXTERNAL_RECORDS_API({}).apiUrl).replyOnce(200, {
            data: publicationsList,
        });

        const { getByTestId, getByRole } = setup();
        await waitFor(() => getByTestId('standard-card-no-matching-works-found-header'));
        expect(getByRole('heading', { name: 'No matching works found' }));
    });

    it('should not return unclaimablePublicationsList (found author ids, but one of them is null)', async () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [
                    {
                        rek_author_id: 29052679,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Jory, Patrick',
                        rek_author_order: 1,
                    },
                    {
                        rek_author_id: 29052680,
                        rek_author_pid: 'UQ:255472',
                        rek_author_xsdmf_id: 7049,
                        rek_author: 'Montesano, Michael J.',
                        rek_author_order: 2,
                    },
                ],
                fez_record_search_key_author_id: [
                    {
                        rek_author_id_id: 28420647,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: 86825,
                        rek_author_id_order: 1,
                        rek_author_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_author_id_id: 28420648,
                        rek_author_id_pid: 'UQ:255472',
                        rek_author_id_xsdmf_id: 7044,
                        rek_author_id: null,
                        rek_author_id_order: 2,
                    },
                ],
                fez_record_search_key_contributor: [],
                fez_record_search_key_contributor_id: [],
            },
        ];

        mockApi.onPost(SEARCH_EXTERNAL_RECORDS_API({}).apiUrl).replyOnce(200, {
            data: publicationsList,
        });

        const { getByTestId, getByRole } = setup();
        await waitFor(() => getByTestId('standard-card-no-matching-works-found-header'));
        expect(getByRole('heading', { name: 'No matching works found' }));
    });

    it('should not return unclaimablePublicationsList (found contributor ids, but one of them is 0)', async () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [],
                fez_record_search_key_author_id: [],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor_id: 29052679,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Jory, Patrick',
                        rek_contributor_order: 1,
                    },
                    {
                        rek_contributor_id: 29052680,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Montesano, Michael J.',
                        rek_contributor_order: 2,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id_id: 28420647,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: 86825,
                        rek_contributor_id_order: 1,
                        rek_contributor_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_contributor_id_id: 28420648,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: 0,
                        rek_contributor_id_order: 2,
                    },
                ],
            },
        ];

        mockApi.onPost(SEARCH_EXTERNAL_RECORDS_API({}).apiUrl).replyOnce(200, {
            data: publicationsList,
        });

        const { getByTestId, getByRole } = setup();
        await waitFor(() => getByTestId('standard-card-no-matching-works-found-header'));
        expect(getByRole('heading', { name: 'No matching works found' }));
    });

    it('should not return unclaimablePublicationsList (found contributor ids, but one of them is null)', async () => {
        // const navigateToClaimPublication = jest.fn();
        // const setClaimPublication = jest.fn();
        // const actions = {
        //     setClaimPublication: setClaimPublication,
        // };
        // const history = {
        //     push: navigateToClaimPublication,
        // };
        const publicationsList = [
            {
                rek_pid: 'UQ:111111',
                fez_record_search_key_author: [],
                fez_record_search_key_author_id: [],
                fez_record_search_key_contributor: [
                    {
                        rek_contributor_id: 29052679,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Jory, Patrick',
                        rek_contributor_order: 1,
                    },
                    {
                        rek_contributor_id: 29052680,
                        rek_contributor_pid: 'UQ:255472',
                        rek_contributor_xsdmf_id: 7049,
                        rek_contributor: 'Montesano, Michael J.',
                        rek_contributor_order: 2,
                    },
                ],
                fez_record_search_key_contributor_id: [
                    {
                        rek_contributor_id_id: 28420647,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: 86825,
                        rek_contributor_id_order: 1,
                        rek_contributor_id_lookup: 'Patrick Jory',
                    },
                    {
                        rek_contributor_id_id: 28420648,
                        rek_contributor_id_pid: 'UQ:255472',
                        rek_contributor_id_xsdmf_id: 7044,
                        rek_contributor_id: null,
                        rek_contributor_id_order: 2,
                    },
                ],
            },
        ];

        mockApi.onPost(SEARCH_EXTERNAL_RECORDS_API({}).apiUrl).replyOnce(200, {
            data: publicationsList,
        });

        const { getByTestId, getByRole } = setup();
        await waitFor(() => getByTestId('standard-card-no-matching-works-found-header'));
        expect(getByRole('heading', { name: 'No matching works found' }));
    });

    it(
        'should return one publication in unclaimablePublicationsList (has rek_pid, number of ' +
            'authors === number of author ids, number of contributors === number of contributos ids, ' +
            'all author ids > 0, all contributor ids > 0)',
        async () => {
            // const navigateToClaimPublication = jest.fn();
            // const setClaimPublication = jest.fn();
            // const actions = {
            //     setClaimPublication: setClaimPublication,
            // };
            // const history = {
            //     push: navigateToClaimPublication,
            // };
            const publicationsList = [
                {
                    rek_pid: 'UQ:255472',
                    fez_record_search_key_author: [],
                    fez_record_search_key_author_id: [],
                    fez_record_search_key_contributor: [
                        {
                            rek_contributor_id: 29052679,
                            rek_contributor_pid: 'UQ:255472',
                            rek_contributor_xsdmf_id: 7049,
                            rek_contributor: 'Jory, Patrick',
                            rek_contributor_order: 1,
                        },
                        {
                            rek_contributor_id: 29052680,
                            rek_contributor_pid: 'UQ:255472',
                            rek_contributor_xsdmf_id: 7049,
                            rek_contributor: 'Montesano, Michael J.',
                            rek_contributor_order: 2,
                        },
                    ],
                    fez_record_search_key_contributor_id: [
                        {
                            rek_contributor_id_id: 28420647,
                            rek_contributor_id_pid: 'UQ:255472',
                            rek_contributor_id_xsdmf_id: 7044,
                            rek_contributor_id: 86825,
                            rek_contributor_id_order: 1,
                            rek_contributor_id_lookup: 'Patrick Jory',
                        },
                        {
                            rek_contributor_id_id: 28420648,
                            rek_contributor_id_pid: 'UQ:255472',
                            rek_contributor_id_xsdmf_id: 7044,
                            rek_contributor_id: 5481,
                            rek_contributor_id_order: 2,
                        },
                    ],
                },
            ];

            const { getByTestId, getByText } = setup({ publicationsList: publicationsList });
            await waitFor(() => getByTestId('publication-citation-parent-UQ:255472'));
            expect(getByText('All authors have been assigned')).toBeInTheDocument();
        },
    );

    it('should not show WSoD if no authors/contributors present on the record', async () => {
        const publicationsList = [
            {
                rek_pid: 'UQ:255472',
            },
        ];

        const { getByTestId, getByText } = setup({ publicationsList: publicationsList });
        await waitFor(() => getByTestId('publication-citation-parent-UQ:255472'));
        expect(getByText('All authors have been assigned')).toBeInTheDocument();
    });
});
