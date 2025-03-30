import React from 'react';
import NewRecord from './NewRecord';
import {
    render,
    WithReduxStore,
    WithRouter,
    fireEvent,
    waitFor,
    expectApiRequestToMatchSnapshot,
    api,
    addFilesToFileUploader,
    setFileUploaderFilesToClosedAccess,
    waitToBeEnabled,
    assertInstanceOfFile,
    userEvent,
} from 'test-utils';
import { NEW_RECORD_API } from 'repositories/routes';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}) {
    const { author, account, rawSearchQuery, ...props } = testProps;
    return render(
        <WithReduxStore
            initialState={{
                accountReducer: { account, author },
                searchRecordsReducer: { rawSearchQuery },
            }}
        >
            <WithRouter>
                <NewRecord {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Add new record', () => {
    beforeEach(() => api.reset());
    afterEach(() => {
        api.reset();
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
        api.mock.records.create({ data: '' });
        const { getByTestId, getByRole, getByText } = setup({
            author: { aut_display_name: 'Fred', aut_id: 44 },
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

        try {
            await waitFor(() => getByTestId('confirm-dialog-box'));
        } catch (error) {
            console.error(
                'Timeout error: Element with data-testid="confirm-dialog-box" was not found within the specified timeout.',
            );
            console.error(error);
        }

        expectApiRequestToMatchSnapshot('post', NEW_RECORD_API().apiUrl);
        fireEvent.click(getByRole('button', { name: 'Go to my works' }));
        expect(mockUseNavigate).toHaveBeenNthCalledWith(1, '/records/mine');

        fireEvent.click(getByRole('button', { name: 'Add another missing work' }));
        expect(mockUseNavigate).toHaveBeenNthCalledWith(2, '/records/add/find');
    });

    it('should show and navigate to fix record on button click and display file upload error', async () => {
        api.mock.records.create({ data: { rek_pid: 'UQ:1' } }).files.fail.upload();
        const { getByTestId, getByRole, getByText } = setup({
            author: { aut_id: 44 }, // no display name
            account: { class: ['IS_UQ_STUDENT_PLACEMENT', 'IS_CURRENT'] }, // hdr student
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
        const mockFile = ['myTestImage.png'];
        addFilesToFileUploader(mockFile);
        await setFileUploaderFilesToClosedAccess(mockFile, 4000);
        await waitToBeEnabled(getByRole('button', { name: 'Submit for approval' }));
        // submit to trigger confirmation box
        await userEvent.click(getByRole('button', { name: 'Submit for approval' }));
        await waitFor(() => getByTestId('confirm-dialog-box'));
        expect(getByText(/File upload and\/or notes post failed/i)).toBeInTheDocument();
        expectApiRequestToMatchSnapshot('post', NEW_RECORD_API().apiUrl);
        expectApiRequestToMatchSnapshot('put', api.url.files.put, assertInstanceOfFile);

        fireEvent.click(getByRole('button', { name: 'Fix work' }));
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
