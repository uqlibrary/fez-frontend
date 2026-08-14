import React from 'react';
import {
    assertDisabled,
    assertEnabled,
    assertToBeInTheDocument,
    render as defaultRender,
    userEvent,
    within,
    WithRouter,
} from 'test-utils';
import { DataGrid } from './DataGrid';
import { pathConfig } from '../../config';
import { createListUrl, createListSharingUrl } from './useColumns';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

const mockCopyToClipboard = jest.fn();
jest.mock('usehooks-ts', () => ({
    useCopyToClipboard: () => [null, mockCopyToClipboard],
}));

jest.mock(
    'modules/SharedComponents/Toolbox/CopyToClipboardDialog',
    () => props =>
        props.open ? (
            <div data-testid="copy-dialog">
                <span data-testid="copy-dialog-text">{props.text}</span>
                <button data-testid="copy-dialog-copy" onClick={props.onCopy}>
                    Copy
                </button>
                <button data-testid="copy-dialog-close" onClick={props.onClose}>
                    Close
                </button>
            </div>
        ) : null,
);

const createAction = jest.fn();
const updateAction = jest.fn();
const deleteAction = jest.fn();

const data = [
    { id: 1, label: 'List one', is_public: true },
    { id: 2, label: 'List two', is_public: false },
];

const setup = (testProps = {}, render = defaultRender) => {
    const props = {
        data: { data: data },
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

    const getRowCount = () => document.querySelectorAll('[data-rowindex]').length;
    const assertRowCount = expected => expect(getRowCount(expected)).toBe(expected);

    it('should render rows from data', () => {
        const { getByTestId } = setup();

        assertRowCount(2);
        expect(getByTestId('fjl-label-1')).toHaveTextContent('List one');
        expect(getByTestId('fjl-label-2')).toHaveTextContent('List two');
        expect(getByTestId('fjl-view-link-1')).toHaveAttribute('href', createListUrl(1));
        expect(getByTestId('fjl-view-link-2')).toHaveAttribute('href', createListUrl(2));
        expect(getByTestId('fjl-sharable-link-1').href).toContain(
            createListSharingUrl(1).replace('http://localhost/', ''),
        );
        expect(getByTestId('fjl-sharable-link-2')).toHaveAttribute('href', '');
        expect(getByTestId('fjl-sharable-link-2')).toHaveStyle({ pointerEvents: 'none', opacity: 0.5 });
        assertToBeInTheDocument('journal-user-lists-quicksearch');
        assertEnabled('journal-user-lists-add');
        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should add a new row', async () => {
        const newRow = { id: 3, label: 'New list', is_public: false };
        mockDispatch.mockResolvedValue({ data: newRow });
        const { getByTestId } = setup();
        assertRowCount(2);

        await userEvent.click(getByTestId('journal-user-lists-add'));

        const input = getByTestId('fjl-label--3-input');
        const saveButton = getByTestId('journal-user-lists-item-0-save');

        assertRowCount(3);
        expect(input).toHaveFocus();
        assertDisabled(saveButton);
        assertEnabled('journal-user-lists-item-0-cancel');

        await userEvent.type(input, newRow.label);
        await userEvent.click(saveButton);

        assertRowCount(3);
        expect(createAction).toHaveBeenCalledWith({ is_public: false, label: 'New list' });
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should cancel new row', async () => {
        const { getByTestId, queryByTestId } = setup();
        assertRowCount(2);
        expect(queryByTestId('fjl-label--3-input')).not.toBeInTheDocument();

        await userEvent.click(getByTestId('journal-user-lists-add'));

        assertRowCount(3);
        expect(getByTestId('fjl-label--3-input')).toHaveFocus();

        await userEvent.click(getByTestId('journal-user-lists-item-0-cancel'));

        assertRowCount(2);
        expect(queryByTestId('fjl-label--3-input')).not.toBeInTheDocument();
    });

    it('should not add empty row on enter', async () => {
        const { getByTestId, queryByTestId } = setup();
        assertRowCount(2);
        expect(queryByTestId('fjl-label--3-input')).not.toBeInTheDocument();

        await userEvent.click(getByTestId('journal-user-lists-add'));

        assertRowCount(3);
        expect(getByTestId('fjl-label--3-input')).toHaveFocus();
        expect(getByTestId('journal-user-lists-item-0-save')).toBeDisabled();
        expect(getByTestId('journal-user-lists-item-0-cancel')).toBeEnabled();

        await userEvent.keyboard('{Enter}');

        assertRowCount(3);
        expect(getByTestId('fjl-label--3-input')).toHaveFocus();
        expect(getByTestId('journal-user-lists-item-0-save')).toBeDisabled();
        expect(getByTestId('journal-user-lists-item-0-cancel')).toBeEnabled();

        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should remove newly added row on Escape', async () => {
        const { getByTestId, queryByTestId } = setup();
        assertRowCount(2);

        await userEvent.click(getByTestId('journal-user-lists-add'));

        assertRowCount(3);
        expect(getByTestId('fjl-label--3-input')).toHaveFocus();

        await userEvent.keyboard('{Escape}');

        assertRowCount(2);
        expect(queryByTestId('journal-user-lists-item-0-cancel')).not.toBeInTheDocument();
        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should edit a row', async () => {
        const updatedRow = { ...data[0], label: `${data[0].label} updated` };
        mockDispatch.mockResolvedValue({ data: updatedRow });
        const { getByTestId } = setup();
        assertRowCount(2);

        const saveButton = getByTestId('journal-user-lists-item-0-edit');
        await userEvent.click(saveButton);

        const input = getByTestId('fjl-label-1-input');
        expect(input).toHaveFocus();
        assertEnabled(saveButton);
        assertEnabled('journal-user-lists-item-0-cancel');

        await userEvent.type(input, updatedRow.label);
        await userEvent.click(saveButton);

        assertRowCount(2);
        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should edit a row on double-click', async () => {
        const { getByText, queryByTestId } = setup();
        assertRowCount(2);

        await userEvent.dblClick(getByText(data[0].label));

        expect(queryByTestId('fjl-label-1-input')).not.toBeInTheDocument();
        expect(queryByTestId('journal-user-lists-item-0-save')).not.toBeInTheDocument();
        expect(queryByTestId('journal-user-lists-item-0-cancel')).not.toBeInTheDocument();
        assertRowCount(2);
        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should revert changes on cancel', async () => {
        const { getByTestId, getByText, queryByTestId } = setup();
        assertRowCount(2);
        expect(getByText(data[0].label)).toBeInTheDocument();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));

        expect(getByTestId('fjl-label-1-input')).toHaveFocus();
        expect(getByTestId('fjl-label-1-input')).toHaveValue(data[0].label);

        await userEvent.type(getByTestId('fjl-label-1-input'), `${data[0].label} updated`);
        await userEvent.click(getByTestId('journal-user-lists-item-0-cancel'));

        expect(getByText(data[0].label)).toBeInTheDocument();
        expect(queryByTestId('fjl-label-1-input')).not.toBeInTheDocument();
        assertRowCount(2);
        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should revert changes on Escape', async () => {
        const { getByTestId, getByText, queryByTestId } = setup();
        assertRowCount(2);
        expect(getByText(data[0].label)).toBeInTheDocument();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));

        expect(getByTestId('fjl-label-1-input')).toHaveFocus();
        expect(getByTestId('fjl-label-1-input')).toHaveValue(data[0].label);

        await userEvent.type(getByTestId('fjl-label-1-input'), `${data[0].label} updated`);
        await userEvent.keyboard('{Escape}');

        expect(getByText(data[0].label)).toBeInTheDocument();
        expect(queryByTestId('fjl-label-1-input')).not.toBeInTheDocument();
        assertRowCount(2);
        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
        expect(deleteAction).not.toHaveBeenCalled();
    });

    it('should call deleteAction when confirming delete of existing row', async () => {
        deleteAction.mockReturnValue({ type: 'DELETE' });
        mockDispatch.mockResolvedValue();
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-delete'));
        await userEvent.click(getByTestId('journal-user-lists-item-0-save'));

        expect(createAction).not.toHaveBeenCalled();
        expect(updateAction).not.toHaveBeenCalled();
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

    it('should disable view/share links while any row is in edit mode', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));

        expect(getByTestId('fjl-view-link-1')).toHaveAttribute('href', '');
    });

    it('should not open share dialog when clicking share link on non-public list', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('fjl-sharable-link-2'), { pointerEventsCheck: 0 });

        expect(queryByTestId('copy-dialog')).not.toBeInTheDocument();
        expect(mockCopyToClipboard).not.toHaveBeenCalled();
    });

    it('should not open share dialog when clicking view/share link while a row is in edit mode', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-edit'));
        await userEvent.click(getByTestId('fjl-sharable-link-1'), { pointerEventsCheck: 0 });

        expect(queryByTestId('copy-dialog')).not.toBeInTheDocument();
    });

    it('should copy link and close dialog when confirming copy', async () => {
        mockCopyToClipboard.mockResolvedValue(undefined);
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('fjl-sharable-link-1'));
        expect(getByTestId('copy-dialog-text')).toHaveTextContent(createListSharingUrl(1));

        await userEvent.click(getByTestId('copy-dialog-copy'));

        expect(mockCopyToClipboard).toHaveBeenCalledWith(createListSharingUrl(1));
        expect(queryByTestId('copy-dialog')).not.toBeInTheDocument();
    });

    it('should close copy dialog without copying', async () => {
        const { getByTestId, queryByTestId } = setup();

        await userEvent.click(getByTestId('fjl-sharable-link-1'));
        await userEvent.click(getByTestId('copy-dialog-close'));

        expect(mockCopyToClipboard).not.toHaveBeenCalled();
        expect(queryByTestId('copy-dialog')).not.toBeInTheDocument();
    });

    it('should navigate to list items page when clicking items action', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('journal-user-lists-item-0-items'));

        expect(mockNavigate).toHaveBeenCalledWith(pathConfig.journals.favourites(String(data[0].id)));
    });
});
