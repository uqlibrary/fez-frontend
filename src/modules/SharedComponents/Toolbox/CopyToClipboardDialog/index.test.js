import React from 'react';
import { render as defaultRender, userEvent, screen, waitFor } from 'test-utils';
import CopyToClipboardDialog from './index';

const onCopy = jest.fn();
const onClose = jest.fn();

const setup = (testProps = {}, render = defaultRender) => {
    const props = {
        title: 'Copy link',
        open: true,
        text: 'https://example.com/some-link',
        onCopy,
        onClose,
        ...testProps,
    };
    return render(<CopyToClipboardDialog {...props} />);
};

describe('CopyToClipboardDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render title and text value', () => {
        const { getByText, getByTestId } = setup();

        expect(getByText('Copy link')).toBeInTheDocument();
        expect(getByTestId('copy-to-clipboard-dialog-input')).toHaveValue('https://example.com/some-link');
        expect(getByTestId('copy-to-clipboard-dialog-input')).toHaveAttribute('readonly');
    });

    it('should not render dialog content when closed', () => {
        const { queryByTestId } = setup({ open: false });

        expect(queryByTestId('copy-to-clipboard-dialog-input')).not.toBeInTheDocument();
    });

    it('should call onCopy when copy icon is clicked', async () => {
        const { getByTestId } = setup();

        await userEvent.click(getByTestId('copy-to-clipboard-dialog-copy=button'));
        expect(onCopy).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close icon is clicked', async () => {
        const { getByLabelText } = setup();

        await userEvent.click(getByLabelText('close'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should focus and select input value on open', async () => {
        setup();

        const input = await screen.findByTestId('copy-to-clipboard-dialog-input');
        await waitFor(() => {
            expect(input).toHaveFocus();
            expect(input.selectionStart).toBe(0);
            expect(input.selectionEnd).toBe('https://example.com/some-link'.length);
        });
    });
});
