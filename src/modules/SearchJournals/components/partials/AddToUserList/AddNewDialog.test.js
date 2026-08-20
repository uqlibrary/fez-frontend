import React from 'react';
import { render as defaultRender, userEvent, waitFor } from 'test-utils';
import AddNewDialog from './AddNewDialog';

const onClose = jest.fn();
const onCreate = jest.fn();

const setup = (testProps = {}, render = defaultRender) => {
    const props = {
        open: true,
        onClose,
        onCreate,
        ...testProps,
    };

    return render(<AddNewDialog {...props} />);
};

describe('AddNewDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should allow toggling public, submit the form and reset when reopened', async () => {
        onCreate.mockResolvedValue(undefined);
        const { rerender, getByTestId } = setup();
        const label = getByTestId('add-to-user-list-dialog-label-input');
        const checkbox = getByTestId('add-to-user-list-dialog-is-public-input');

        await waitFor(() => expect(label).toHaveFocus());
        expect(label).toHaveValue('');
        expect(checkbox).not.toBeChecked();

        await userEvent.type(label, 'My list');
        await userEvent.click(checkbox);
        await userEvent.click(getByTestId('add-to-user-list-dialog-add-button'));

        await waitFor(() =>
            expect(onCreate).toHaveBeenCalledWith({
                label: 'My list',
                isPublic: true,
            }),
        );

        setup({ open: false }, rerender);
        setup({ open: true }, rerender);

        expect(label).toHaveValue('');
        await waitFor(() => expect(checkbox).not.toBeChecked());
    });

    it('should submit the form on Enter', async () => {
        onCreate.mockResolvedValue(undefined);
        const { getByTestId } = setup();

        await userEvent.type(getByTestId('add-to-user-list-dialog-label-input'), 'Quick list{Enter}');

        await waitFor(() =>
            expect(onCreate).toHaveBeenCalledWith({
                label: 'Quick list',
                isPublic: false,
            }),
        );
    });

    it('should call onClose from the cancel and close buttons', async () => {
        const { rerender, getByTestId } = setup();

        await userEvent.click(getByTestId('add-to-user-list-dialog-cancel-button'));
        expect(onClose).toHaveBeenCalledTimes(1);

        setup({ open: false }, rerender);
        setup({ open: true }, rerender);

        await userEvent.click(getByTestId('add-to-user-list-dialog-close-button'));
        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('should forward paperRef', () => {
        const paperRef = React.createRef();

        setup({ paperRef });

        expect(paperRef.current).not.toBeNull();
        expect(paperRef.current).toHaveClass('MuiPaper-root');
    });

    it('should display a server error when submit fails', async () => {
        onCreate.mockRejectedValue(new Error('Boom'));

        const { findByText, getByTestId } = setup();

        await userEvent.type(getByTestId('add-to-user-list-dialog-label-input'), 'My list');
        await userEvent.click(getByTestId('add-to-user-list-dialog-add-button'));

        expect(await findByText('Failed to create list, please try again.')).toBeInTheDocument();
    });
});
