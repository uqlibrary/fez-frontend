import React from 'react';
import {
    assertEnabled,
    assertToBeInTheDocument,
    render as defaultRender,
    userEvent,
    waitToBeDisabled,
    within,
    WithRouter,
} from 'test-utils';
import { DataGrid } from './DataGrid';
import { pathConfig } from '../../config';
import { JOURNAL_FAVOURITE_LIST_LABEL } from '../../config/general';
import { createListUrl } from './useColumns';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

const createAction = jest.fn();
const updateAction = jest.fn();
const deleteAction = jest.fn();

const data = [
    { fjl_id: 1, fjl_label: 'List one', fjl_is_public: true, fjl_ids: [1, 2] },
    { fjl_id: 2, fjl_label: 'List two', fjl_is_public: false, fjl_ids: [] },
    { fjl_id: 3, fjl_label: JOURNAL_FAVOURITE_LIST_LABEL, fjl_is_public: true, fjl_ids: [1, 2] },
];

const setup = (testProps = {}, render = defaultRender) => {
    const props = {
        data: { data: data },
        error: '',
        createAction,
        updateAction,
        deleteAction,
        ...testProps,
    };
    return render(
        <WithRouter>
            <DataGrid {...props} />
        </WithRouter>,
    );
};

describe('DataGrid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const firstOf = (container, testId) => within(container).getAllByTestId(testId)[0];

    it('should render rows from data', () => {
        const { container } = setup();

        expect(firstOf(container, 'fjl-label-1')).toHaveTextContent('List one');
        expect(firstOf(container, 'fjl-label-2')).toHaveTextContent('List two');
        assertToBeInTheDocument('journal-user-lists-quicksearch');
        assertEnabled('journal-user-lists-add');
    });

    it('should show error message when error is present', () => {
        const { getByTestId } = setup({ error: 'Something went wrong' });

        expect(getByTestId('journal-user-lists-error')).toHaveTextContent('Something went wrong');
    });

    it('should not show error message when error is empty', () => {
        const { queryByTestId } = setup({ error: '' });

        expect(queryByTestId('journal-user-lists-error')).not.toBeInTheDocument();
    });

    it('should add a new row in edit mode when clicking add', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-add'));
        expect(getByTestId('fjl-label--4-input')).toHaveFocus();

        expect(getByTestId('journal-user-lists-item-0-save')).toBeInTheDocument();
        expect(getByTestId('journal-user-lists-item-0-cancel')).toBeInTheDocument();
    });

    it('should focus on `label` field and disable buttons on edit mode', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));
        expect(getByTestId('fjl-label-1-input')).toHaveFocus();

        expect(getByTestId('journal-user-lists-add')).toBeDisabled();
        expect(getByTestId('journal-user-lists-item-0-save')).toBeInTheDocument();
        expect(queryByTestId('journal-user-lists-item-0-edit')).not.toBeInTheDocument();
    });

    it('should cancel edit mode and revert row', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));
        await userEvent.click(getByTestId('journal-user-lists-item-0-cancel'));

        expect(getByTestId('journal-user-lists-item-0-edit')).toBeInTheDocument();
        expect(queryByTestId('journal-user-lists-item-0-save')).not.toBeInTheDocument();
    });

    it('should remove newly added row on cancel', async () => {
        const { getByTestId, queryByTestId, container } = setup();

        await userEvent.click(getByTestId('journal-user-lists-add'));
        await userEvent.click(getByTestId('journal-user-lists-item-0-cancel'));

        expect(queryByTestId('fjl-label-new')).not.toBeInTheDocument();
        expect(firstOf(container, 'fjl-label-1')).toBeInTheDocument();
    });

    it('should call deleteAction when confirming delete of existing row', async () => {
        deleteAction.mockReturnValue({ type: 'DELETE' });
        mockDispatch.mockResolvedValue();
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-delete'));
        await userEvent.click(getByTestId('journal-user-lists-item-0-save'));

        expect(deleteAction).toHaveBeenCalledWith(1);
    });

    it('should call save (not delete) when confirming an edit, not a pending delete', async () => {
        updateAction.mockReturnValue({ type: 'UPDATE' });
        mockDispatch.mockResolvedValue(undefined);
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));
        await userEvent.click(getByTestId('journal-user-lists-item-0-save'));

        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should remove new row directly on cancel without calling deleteAction', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-add'));
        await userEvent.click(getByTestId('journal-user-lists-item-0-cancel'));

        expect(deleteAction).not.toHaveBeenCalled();
        expect(queryByTestId('fjl-label-new')).not.toBeInTheDocument();
    });

    it('should cancel new row when pressing Escape in a cell', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-add'));
        const input = getByTestId('journal-user-lists-item-0-cancel')
            .closest('.MuiDataGrid-row')
            .querySelector('input');

        input.focus();
        await userEvent.keyboard('{Escape}');

        expect(queryByTestId('journal-user-lists-item-0-cancel')).not.toBeInTheDocument();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should not cancel existing row when pressing Escape', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));

        const saveButton = getByTestId('journal-user-lists-item-0-save');
        const row = saveButton.closest('.MuiDataGrid-row');
        const input = within(row).getByRole('textbox');

        input.focus();
        await userEvent.keyboard('{Escape}');

        // handleCellKeyDown only intercepts Escape for new rows; for existing
        // rows MUI's default cell-edit-exit behavior applies instead
        expect(getByTestId('journal-user-lists-item-0-edit')).toBeInTheDocument();
    });

    it('should switch row back to view mode on save click', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));
        await userEvent.click(getByTestId('journal-user-lists-item-0-save'));

        expect(queryByTestId('journal-user-lists-item-0-save')).not.toBeInTheDocument();
        expect(getByTestId('journal-user-lists-item-0-edit')).toBeInTheDocument();
    });

    it('should reflect label input changes and gate save on non-empty label', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));

        const saveButton = getByTestId('journal-user-lists-item-0-save');
        const input = within(saveButton.closest('.MuiDataGrid-row')).getByRole('textbox');

        await userEvent.clear(input);
        await userEvent.type(input, 'Updated label');
        expect(input).toHaveValue('Updated label');
        expect(saveButton).not.toBeDisabled();

        await userEvent.clear(input);
        expect(saveButton).toBeDisabled();
    });

    it('should update the switch value when toggling is public in edit mode', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));

        const switchInput = getByTestId('fjl-is-public-1-input').querySelector('input');
        expect(switchInput).toBeChecked();

        await userEvent.click(switchInput);
        expect(switchInput).not.toBeChecked();
    });

    it('should update favourites visibility but not label', async () => {
        const { getByTestId } = setup();
        await waitToBeDisabled('journal-user-lists-item-2-delete');

        await userEvent.click(getByTestId('journal-user-lists-item-2-edit'));
        await waitToBeDisabled('fjl-label-3-input');

        const switchInput = getByTestId('fjl-is-public-3-input').querySelector('input');
        expect(switchInput).toBeChecked();
        assertEnabled('journal-user-lists-item-2-save');

        await userEvent.click(switchInput);
        expect(switchInput).not.toBeChecked();
        assertEnabled('journal-user-lists-item-2-save');
    });

    it('should link to journal search', async () => {
        const { getByTestId } = setup();

        expect(getByTestId('fjl-link-1')).toHaveAttribute('href', createListUrl(1));
        expect(getByTestId('fjl-link-2')).toHaveAttribute('href', createListUrl(2));
    });

    it('should link to list items page', async () => {
        const { getByTestId } = setup();

        const listLink = getByTestId('fjl-items-link-1').querySelector('a');
        expect(listLink).toHaveAttribute('href', pathConfig.journals.list(data[0].fjl_id));

        const favouritesLink = getByTestId('fjl-items-link-3').querySelector('a');
        expect(favouritesLink).toHaveAttribute('href', pathConfig.journals.favourites);
    });
});
