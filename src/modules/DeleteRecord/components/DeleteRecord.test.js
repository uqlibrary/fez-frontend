import React from 'react';
import DeleteRecord from './DeleteRecord';
import { mockRecordToDelete } from 'mock/data/testing/records';
import { DELETED, DOI_DATACITE_PREFIX, PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';
import {
    expectApiRequestToMatchSnapshot,
    api,
    mockUseForm,
    render,
    waitForTextToBeRemoved,
    waitToBeEnabled,
    WithReduxStore,
    WithRouter,
} from 'test-utils';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { deletedRecord } from '../../../mock/data';
import { publicationTypeListThesis, recordWithRDM } from '../../../mock/data/records';
import { set } from 'lodash';
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
        <WithReduxStore initialState={state}>
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
        const deletionReason = 'deletion reason';

        const mockUseParamPidValue = pid => (mockParams.pid = pid);
        const mockGetAndDeleteRecordApiCalls = (record = mockRecordToDelete) => {
            const pid = record.rek_pid;
            mockUseParamPidValue(pid);
            api.mock.records.get({ pid, data: { ...record } }).delete({ pid });
        };

        const fillReason = async () => {
            await waitForTextToBeRemoved('Loading work');
            await userEvent.type(screen.getByTestId('reason-input'), deletionReason);
        };

        const submitForm = async () => {
            await waitForTextToBeRemoved('Loading work');
            await waitToBeEnabled(screen.getByTestId('submit-delete-record'));
            await userEvent.click(screen.getByTestId('submit-delete-record'));
            await waitForTextToBeRemoved('Request is being processed');
        };

        beforeEach(() => api.reset());
        afterEach(() => api.reset());

        it('should submit the form for a record without DOI', async () => {
            mockGetAndDeleteRecordApiCalls();

            setup();
            await submitForm();

            expectApiRequestToMatchSnapshot('delete', `records/${mockRecordToDelete.rek_pid}`);
        });

        it('should submit form for a deleted record without DOI', async () => {
            const pid = deletedRecord.rek_pid;
            api.mock.records
                .get({ pid, status: 410, data: { ...deletedRecord } })
                .update({ pid, data: { ...deletedRecord } });
            mockUseParamPidValue(pid);

            setup();
            await submitForm();

            expectApiRequestToMatchSnapshot('patch', `records/${pid}`);
        });

        it('should allow enter reason and submit the form for a record without DOI', async () => {
            mockGetAndDeleteRecordApiCalls();

            setup();
            await fillReason();
            await submitForm();

            expectApiRequestToMatchSnapshot('delete', `records/${mockRecordToDelete.rek_pid}`);
        });

        it('should allow enter reason, new doi resolution URL and submit form for a record with Crossref DOI', async () => {
            const doiResolutionUrl = 'https://web.library.uq.edu.au/test';
            mockGetAndDeleteRecordApiCalls(recordWithCrossrefDoi);

            setup();
            await fillReason();
            await userEvent.type(screen.getByTestId('rek-doi-resolution-url-input'), doiResolutionUrl);
            await submitForm();

            expectApiRequestToMatchSnapshot('delete', `records/${recordWithCrossrefDoi.rek_pid}`);
        });

        it('should allow enter reason, new doi and submit form for a record with DataCite DOI', async () => {
            const pid = recordWithDataCiteDoi.rek_pid;
            const newDoi = '10.1234/uql5678';
            const deletionNotes = 'deletion notes';
            mockGetAndDeleteRecordApiCalls(recordWithDataCiteDoi);
            mockUseForm((props, original) =>
                original(
                    set(
                        { values: {} },
                        'values.publication.fez_record_search_key_deletion_notes.rek_deletion_notes',
                        deletionNotes,
                    ),
                ),
            );
            setup();

            await fillReason();
            await userEvent.type(screen.getByTestId('rek-new-doi-input'), newDoi);
            await submitForm();

            expectApiRequestToMatchSnapshot('delete', `records/${pid}`);
        });
    });
});
