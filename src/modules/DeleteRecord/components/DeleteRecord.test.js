import React from 'react';
import DeleteRecord from './DeleteRecord';
import { mockRecordToDelete } from 'mock/data/testing/records';
import Immutable from 'immutable';
import { DELETED, DOI_CROSSREF_PREFIX, DOI_DATACITE_PREFIX, PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';
import { render, WithReduxStore, WithRouter } from 'test-utils';

const mockUseNavigate = jest.fn();
let mockParams = { pid: mockRecordToDelete.rek_pid };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => mockParams,
}));

function setup(props = {}, renderMethod = render) {
    const state = Immutable.Map({
        accountReducer: {
            accountAuthorLoading: props.accountAuthorLoading || false,
        },
        deleteRecordReducer: {
            loadingRecordToDelete: props.loadingRecordToDelete || false,
            recordToDelete: { ...(props.recordToDelete || mockRecordToDelete) },
        },
    });

    return renderMethod(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <DeleteRecord />
            </WithRouter>
        </WithReduxStore>,
    );
}

// node: most of the testing has been done in deleteRecord.spec.js
describe('Component DeleteRecord', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
        mockParams = {};
    });

    it('should render loader when current author info is not loaded', () => {
        const { getByText } = setup({ accountAuthorLoading: true });
        expect(getByText('Loading work')).toBeVisible();
    });

    it('should render loader when record is loading', () => {
        const { getByText } = setup({ loadingRecordToDelete: true });
        expect(getByText('Loading work')).toBeVisible();
    });

    it('should render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
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

    it('should render delete record form for records with Crossref UQ DOIs', () => {
        const { container, getByTestId } = setup({
            recordToDelete: {
                ...mockRecordToDelete,
                fez_record_search_key_doi: { rek_doi: `${DOI_CROSSREF_PREFIX}12345` },
            },
        });
        expect(container).toMatchSnapshot();
        expect(getByTestId('submit-delete-record')).toBeEnabled();
    });

    it('should render delete record form for records with DataCite UQ DOIs', () => {
        const { container, getByTestId } = setup({
            recordToDelete: {
                ...mockRecordToDelete,
                fez_record_search_key_doi: { rek_doi: `${DOI_DATACITE_PREFIX}12345` },
            },
        });
        expect(container).toMatchSnapshot();
        expect(getByTestId('submit-delete-record')).toBeEnabled();
    });
});
