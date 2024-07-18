import React from 'react';
import NewRecord from './NewRecord';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, within } from 'test-utils';
import * as RecordActions from 'actions/records';
import { NEW_RECORD_API } from 'repositories/routes';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}) {
    const props = {
        actions: {},
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <NewRecord {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Add new record', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        jest.clearAllMocks();
    });

    it('should not render publication form if author is not loaded ', () => {
        const { container } = setup({ author: null });
        expect(container).toMatchSnapshot();
    });

    it('should render stepper and a publication form', () => {
        const { container } = setup({ author: { aut_display_name: 'Fred', aut_id: 44 } });
        expect(container).toMatchSnapshot();
    });

    it('should show confirmation box and navigate to the correct route on button clicks', async () => {
        const requestCreateNewRecord = jest.spyOn(RecordActions, 'createNewRecord');
        const clearNewRecordFn = jest.fn();
        mockApi.onPost(NEW_RECORD_API().apiUrl).replyOnce(200, {
            data: '',
        });
        const { getByTestId, getByRole, getByText } = setup({
            author: { aut_display_name: 'Fred', aut_id: 44 },
            actions: { clearNewRecord: clearNewRecordFn },
        });

        // interact with the form
        fireEvent.mouseDown(getByTestId('rek-display-type-select'));
        fireEvent.click(getByText(/Working paper/i));
        // required fields
        fireEvent.change(getByTestId('rek-title-input'), { target: { value: 'title' } });
        fireEvent.change(getByTestId('rek-date-day-input'), { target: { value: '1' } });
        fireEvent.mouseDown(getByTestId('rek-date-month-select'));
        fireEvent.click(getByRole('option', { name: 'May' }));
        fireEvent.change(getByTestId('rek-date-year-input'), { target: { value: '1911' } });
        fireEvent.change(getByTestId('authors-input'), { target: { value: 'author' } });
        fireEvent.click(getByRole('button', { name: 'Add author' }));
        fireEvent.click(getByRole('listitem', { name: 'Select this author (author) to assign it as you' }));

        fireEvent.click(getByRole('button', { name: 'Submit for approval' }));
        await waitFor(() => getByTestId('confirm-dialog-box'));

        expect(requestCreateNewRecord).toHaveBeenCalledWith(
            expect.objectContaining({
                authors: [
                    {
                        affiliation: '',
                        aut_title: '',
                        authorId: null,
                        creatorRole: '',
                        disabled: false,
                        nameAsPublished: 'author',
                        orgaff: '',
                        orgtype: '',
                        required: false,
                        selected: true,
                        uqIdentifier: '',
                        uqUsername: '',
                    },
                ],
                languages: ['eng'],
                rek_date: '1911-01-01',
                rek_display_type: 183,
                rek_title: 'title',
            }),
        );
        await waitFor(() => getByTestId('confirm-dialog-box'));

        fireEvent.click(getByRole('button', { name: 'Go to my works' }));
        expect(clearNewRecordFn).toHaveBeenCalledTimes(1);
        expect(mockUseNavigate).toHaveBeenNthCalledWith(1, '/records/mine');

        fireEvent.click(getByRole('button', { name: 'Add another missing work' }));
        expect(clearNewRecordFn).toHaveBeenCalledTimes(2);
        expect(mockUseNavigate).toHaveBeenNthCalledWith(2, '/records/add/find');
    });

    it('should show and navigate to fix record on button click and display file upload error', async () => {
        const clearNewRecordFn = jest.fn();
        mockApi.onPost(NEW_RECORD_API().apiUrl).replyOnce(200, {
            data: '',
        });
        const { getByTestId, getByRole, getByText } = setup({
            author: { aut_id: 44 }, // no display name
            account: { class: ['IS_UQ_STUDENT_PLACEMENT', 'IS_CURRENT'] }, // hdr student
            actions: { clearNewRecord: clearNewRecordFn },
            newRecord: { rek_pid: 'UQ:1' },
            newRecordFileUploadingOrIssueError: true,
        });

        // interact with the form
        fireEvent.mouseDown(getByTestId('rek-display-type-select'));
        fireEvent.click(getByText(/Working paper/i));
        // required fields
        fireEvent.change(getByTestId('rek-title-input'), { target: { value: 'title' } });
        fireEvent.change(getByTestId('rek-date-day-input'), { target: { value: '1' } });
        fireEvent.change(getByTestId('rek-date-month-input'), { target: { value: 'May' } });
        fireEvent.change(getByTestId('rek-date-year-input'), { target: { value: '1911' } });
        fireEvent.change(getByTestId('authors-input'), { target: { value: 'author' } });
        fireEvent.click(getByRole('button', { name: 'Add author' }));
        fireEvent.click(getByRole('listitem', { name: 'Select this author (author) to assign it as you' }));

        // submit to trigger confirmation box
        fireEvent.click(getByRole('button', { name: 'Submit for approval' }));

        await waitFor(() => getByTestId('confirm-dialog-box'));
        expect(getByText(/File upload and\/or notes post failed/i)).toBeInTheDocument();

        fireEvent.click(getByRole('button', { name: 'Fix work' }));
        expect(clearNewRecordFn).toHaveBeenCalledTimes(1);
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/UQ:1/fix');
    });

    it('should restart workflow', async () => {
        const { getByRole } = setup({
            author: { aut_display_name: 'Fred', aut_id: 44 },
            actions: { clearNewRecord: jest.fn() },
        });

        fireEvent.click(getByRole('button', { name: 'Abandon and search again' }));
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/add/find');
    });
});
