import React from 'react';
import DeleteRecord from './DeleteRecord';
import { mockRecordToDelete } from 'mock/data/testing/records';
import { communityRecord, collectionRecord } from 'mock/data/testing/communityCollection';
import Immutable from 'immutable';
import { DELETED, DOI_CROSSREF_PREFIX, DOI_DATACITE_PREFIX, PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';
import { fireEvent, render, WithReduxStore, WithRouter } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disable}
                label={props.label || props.floatingLabelText}
            />
        );
    },
}));

const mockUseNavigate = jest.fn();
let mockParams = {};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: () => mockParams,
}));

function setup(testProps, renderMethod = render) {
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
        submitFailed: false,
        valid: true,
        pure: true,
        pristine: true,
        submitAsSideEffect: false,
        submitting: false,
        invalid: false,
        submitSucceeded: false,
        recordToDelete: testProps.recordToDelete,
        loadingRecordToDelete: testProps.loadingRecordToDelete || false,

        handleSubmit: testProps.handleSubmit || jest.fn(),
        initialValues:
            testProps.initialValues ||
            Immutable.Map({
                publication: Immutable.Map(testProps.recordToDelete || mockRecordToDelete),
            }),
        actions: testProps.actions || { loadRecordToDelete: jest.fn(), clearDeleteRecord: jest.fn() },

        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <DeleteRecord {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component DeleteRecord', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
        mockParams = {};
    });

    it('should render loader when record is loading', () => {
        const { container } = setup({ recordToDelete: mockRecordToDelete, loadingRecordToDelete: true });
        expect(container).toMatchSnapshot();
    });

    it('should render delete record form with record citation', () => {
        const { container } = setup({ recordToDelete: mockRecordToDelete });
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(1);
    });

    it('should render delete record form with deleted record citation', () => {
        const { container } = setup({ recordToDelete: { ...mockRecordToDelete, rek_status: DELETED } });
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(1);
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
        expect(container.getElementsByTagName('field').length).toEqual(3);
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
        expect(container.getElementsByTagName('field').length).toEqual(3);
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
        expect(container.getElementsByTagName('field').length).toEqual(2);
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
        expect(container.getElementsByTagName('field').length).toEqual(3);
    });

    it('should display specific alert if trying to delete a Community that contains Collections', () => {
        const { container, getByTestId } = setup({
            recordToDelete: {
                ...communityRecord,
            },
            error: '{"status":409,"data":"Can\'t delete a record that has child records","message":"Duplicate record"}',
        });

        expect(container).toMatchSnapshot();
        expect(getByTestId('alert')).toBeInTheDocument();
    });

    it('should display specific alert if trying to delete a Collection that is a part of at least one Community', () => {
        const { container, getByTestId } = setup({
            recordToDelete: {
                ...collectionRecord,
            },
            error: '{"status":409,"data":"Can\'t delete a record that has child records","message":"Duplicate record"}',
        });
        expect(container).toMatchSnapshot();
        expect(getByTestId('alert')).toBeInTheDocument();
    });

    it('should display general alert if trying to delete a Community or Collection that errors', () => {
        const { container, getByTestId } = setup({
            recordToDelete: {
                ...communityRecord,
            },
            error: '{"status":400,"data":"A message from the server","message":"Test error"}',
        });
        expect(container).toMatchSnapshot();
        expect(getByTestId('alert')).toBeInTheDocument();
    });

    it('should display general alert if trying to delete a non-Community or Collection that errors', () => {
        const { container, getByText, getByTestId } = setup({
            recordToDelete: {
                ...mockRecordToDelete,
            },
            error: '{"status":400,"data":"A message from the server","message":"Test error"}',
        });
        expect(container).toMatchSnapshot();
        expect(getByText(/Test error/i)).toMatchSnapshot();
        expect(getByTestId('alert')).toBeInTheDocument();
    });

    it('should display confirmation box after successful submission and go to record view page', () => {
        mockParams = { pid: 'UQ:1001' };
        const { getAllByText, getByTestId, rerender } = setup({
            recordToDelete: mockRecordToDelete,
        });

        setup(
            {
                recordToDelete: mockRecordToDelete,
                dirty: true,
                submitSucceeded: true,
            },
            rerender,
        );

        // progress bar and modal
        expect(getAllByText(/Work has been deleted/i).length).toEqual(2);

        fireEvent.click(getByTestId('confirm-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/view/UQ:1001');
    });

    it('should display confirmation box after successful submission and go to search page', () => {
        mockParams = { pid: 'UQ:1001' };
        const { getByTestId, rerender } = setup({
            recordToDelete: mockRecordToDelete,
        });
        setup(
            {
                recordToDelete: mockRecordToDelete,
                dirty: true,
                submitSucceeded: true,
            },
            rerender,
        );

        fireEvent.click(getByTestId('cancel-dialog-box'));
        expect(mockUseNavigate).toBeCalledWith('/records/search');
    });

    it('should go back to previous page on cancel', () => {
        const { getByTestId } = setup({ recordToDelete: mockRecordToDelete });
        fireEvent.click(getByTestId('cancel-delete-record'));
        expect(mockUseNavigate).toBeCalled();
    });

    it('should run handleSubmit on submit', () => {
        const handleSubmitMock = jest.fn();
        const { getByTestId } = setup({
            recordToDelete: mockRecordToDelete,
            handleSubmit: handleSubmitMock,
        });
        fireEvent.click(getByTestId('submit-delete-record'));
        expect(handleSubmitMock).toBeCalled();
    });

    /* it('should load record if record is not loaded', () => {
        const actionFunction = jest.fn();
        setup({
            loadingRecordToDelete: false,
            recordToDelete: null,
            actions: { loadRecordToDelete: actionFunction },
            match: { params: { pid: 'UQ:1001' } },
        });

        expect(actionFunction).toHaveBeenCalledWith('UQ:1001');
    });

    it('should clear record to delete when leaving the form', () => {
        const actionFunction = jest.fn();
        const wrapper = setup({ recordToDelete: mockRecordToDelete, actions: { clearDeleteRecord: actionFunction } });
        wrapper.instance().componentWillUnmount();
        expect(actionFunction).toHaveBeenCalled();
    });
    */
});
