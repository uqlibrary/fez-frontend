import React from 'react';
import DeleteRecord from './DeleteRecord';
import { mockRecordToDelete } from 'mock/data/testing/records';
import Immutable from 'immutable';
import { DELETED, DOI_DATACITE_PREFIX, PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';
import {
    assertLastApiRequest,
    render,
    waitForTextToBeRemoved,
    waitToBeEnabled,
    WithReduxStore,
    WithRouter,
} from 'test-utils';
import userEvent from '@testing-library/user-event';
import { clearLastRequest } from '../../../config/axios';
import { screen } from '@testing-library/react';
import * as repositories from '../../../repositories';
import { deletedRecord } from '../../../mock/data';
import { escapeRegExp } from '../../../mock';
import { publicationTypeListThesis, recordWithRDM } from '../../../mock/data/records';
const recordWithCrossrefDoi = publicationTypeListThesis.data[0];
const recordWithDataCiteDoi = recordWithRDM;

const mockUseNavigate = jest.fn();
let mockParams = { pid: mockRecordToDelete.rek_pid };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => mockParams,
}));

function setup(props = {}, renderMethod = render) {
    const state = {
        accountReducer: {
            accountAuthorLoading: props.accountAuthorLoading || false,
        },
        deleteRecordReducer: {
            loadingRecordToDelete: props.loadingRecordToDelete || false,
            recordToDelete: { ...props.recordToDelete },
        },
    };

    return renderMethod(
        <WithReduxStore initialState={Immutable.Map(state)}>
            <WithRouter>
                <DeleteRecord />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component DeleteRecord', () => {
    afterEach(() => {
        mockParams = {};
        jest.restoreAllMocks();
    });

    it('should render loader when current author info is not loaded', () => {
        const { getByText } = setup({ accountAuthorLoading: true });
        expect(getByText('Loading work')).toBeVisible();
    });

    it('should render loader when record is loading', () => {
        const { getByText } = setup({ loadingRecordToDelete: true });
        expect(getByText('Loading work')).toBeVisible();
    });

    it('should render delete record form with deleted record citation', () => {
        const { container } = setup({ recordToDelete: { ...mockRecordToDelete, rek_status: DELETED } });
        expect(container).toMatchSnapshot();
    });

    it('should render delete record form with data collection citation', () => {
        const { container } = setup({
            recordToDelete: {
                ...mockRecordToDelete,
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                fez_record_search_key_doi: { rek_doi: `${DOI_DATACITE_PREFIX}12345` },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render delete record form with deleted data collection citation', () => {
        const { container } = setup({
            recordToDelete: {
                ...mockRecordToDelete,
                rek_status: DELETED,
                rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                fez_record_search_key_doi: { rek_doi: `${DOI_DATACITE_PREFIX}12345` },
            },
        });
        expect(container).toMatchSnapshot();
    });

    describe('form submission', () => {
        const expectedPayload = {
            rek_status: 8,
            fez_record_search_key_doi_resolution_url: null,
            fez_record_search_key_new_doi: null,
            fez_record_search_key_deletion_notes: null,
        };
        const expectedPayloadWithReason = {
            ...expectedPayload,
            reason: 'deletion reason',
        };

        const mockUseParamPidValue = pid => (mockParams.pid = pid);
        const mockGetAndDeleteRecordApiCalls = (record = mockRecordToDelete) => {
            const pid = record.rek_pid;
            mockUseParamPidValue(pid);
            // mock api
            mockApi
                .onGet(new RegExp(escapeRegExp(repositories.routes.EXISTING_RECORD_API({ pid }).apiUrl)))
                .reply(200, { data: { ...record } })
                .onDelete(new RegExp(escapeRegExp(repositories.routes.EXISTING_RECORD_API({ pid }).apiUrl)))
                .reply(() => [200, { data: 'Record deleted' }]);
        };

        const fillReason = async () => {
            await waitForTextToBeRemoved('Loading work');
            await userEvent.type(screen.getByTestId('reason-input'), expectedPayloadWithReason.reason);
        };

        const submitForm = async () => {
            await waitForTextToBeRemoved('Loading work');
            await waitToBeEnabled(screen.getByTestId('submit-delete-record'));
            await userEvent.click(screen.getByTestId('submit-delete-record'));
            await waitForTextToBeRemoved('Request is being processed');
        };

        beforeEach(() => {
            clearLastRequest();
        });
        afterEach(() => {
            mockApi.resetHandlers();
        });

        it('should submit the form for a record without DOI', async () => {
            mockGetAndDeleteRecordApiCalls();

            setup();
            await submitForm();

            assertLastApiRequest({
                url: `records/${mockRecordToDelete.rek_pid}`,
                method: 'delete',
                data: expectedPayload,
            });
        });

        it('should submit form for a deleted record without DOI', async () => {
            const pid = deletedRecord.rek_pid;
            const url = new RegExp(escapeRegExp(repositories.routes.EXISTING_RECORD_API({ pid }).apiUrl));
            mockApi
                .onGet(url)
                .reply(() => {
                    return [410, { data: { ...deletedRecord } }];
                })
                .onPatch(url)
                .reply(200, { data: { ...deletedRecord } });
            mockUseParamPidValue(pid);

            setup();
            await submitForm();

            assertLastApiRequest({
                url: `records/${pid}`,
                method: 'patch',
                data: expectedPayload,
            });
        });

        it('should allow enter reason and submit the form for a record without DOI', async () => {
            mockGetAndDeleteRecordApiCalls();

            setup();
            await fillReason();
            await submitForm();

            assertLastApiRequest({
                url: `records/${mockRecordToDelete.rek_pid}`,
                method: 'delete',
                data: expectedPayloadWithReason,
            });
        });

        it('should allow enter reason, new doi resolution URL and submit form for a record with Crossref DOI', async () => {
            const doiResolutionUrl = 'https://web.library.uq.edu.au/test';
            mockGetAndDeleteRecordApiCalls(recordWithCrossrefDoi);

            setup();
            await fillReason();
            await userEvent.type(screen.getByTestId('rek-doi-resolution-url-input'), doiResolutionUrl);
            await submitForm();

            assertLastApiRequest({
                url: `records/${recordWithCrossrefDoi.rek_pid}`,
                method: 'delete',
                data: {
                    ...expectedPayloadWithReason,
                    fez_record_search_key_doi_resolution_url: {
                        rek_doi_resolution_url: doiResolutionUrl,
                    },
                },
            });
        });

        it('should allow enter reason, new doi and submit form for a record with DataCite DOI', async () => {
            const pid = recordWithDataCiteDoi.rek_pid;
            const newDoi = '10.1234/uql5678';
            mockGetAndDeleteRecordApiCalls(recordWithDataCiteDoi);
            setup();

            await fillReason();
            await userEvent.type(screen.getByTestId('rek-new-doi-input'), newDoi);
            await submitForm();

            assertLastApiRequest({
                url: `records/${pid}`,
                method: 'delete',
                data: {
                    ...expectedPayloadWithReason,
                    fez_record_search_key_new_doi: {
                        rek_new_doi: newDoi,
                    },
                },
            });
        });
    });
});
