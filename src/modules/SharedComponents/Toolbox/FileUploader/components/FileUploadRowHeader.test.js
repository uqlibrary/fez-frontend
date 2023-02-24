import React from 'react';
import FileUploadRowHeader from './FileUploadRowHeader';
import { rtlRender, fireEvent, waitFor, createMatchMedia } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onDeleteAll: jest.fn(),
        requireOpenAccessStatus: false,
        ...testProps,
    };
    return rtlRender(<FileUploadRowHeader {...props} />);
}

describe('Component FileUploadRowHeader', () => {
    beforeEach(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render with default setup', () => {
        const { getByText, getByTestId, queryByText } = setup();
        expect(getByText('File name')).toBeInTheDocument();
        expect(queryByText('Access conditions')).toBeNull();
        expect(queryByText('Embargo release date')).toBeNull();
        expect(getByTestId('delete-all-files').parentElement).toHaveAttribute(
            'aria-label',
            'Remove all files from the upload queue',
        );
    });

    it('should render with access condition and embargo date column', () => {
        const { getByText, getByTestId } = setup({ requireOpenAccessStatus: true });
        expect(getByText('File name')).toBeInTheDocument();
        expect(getByText('Access conditions')).toBeInTheDocument();
        expect(getByText('Embargo release date')).toBeInTheDocument();
        expect(getByTestId('delete-all-files').parentElement).toHaveAttribute(
            'aria-label',
            'Remove all files from the upload queue',
        );
    });

    it('should render for admins with security policy and embargo date column', () => {
        const { getByText, queryByText, getByTestId } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
        });
        expect(getByText('File name')).toBeInTheDocument();

        expect(queryByText('Access conditions')).toBeNull();
        expect(getByText('Security policy')).toBeInTheDocument();
        expect(getByText('Embargo release date')).toBeInTheDocument();
        expect(getByTestId('delete-all-files').parentElement).toHaveAttribute(
            'aria-label',
            'Remove all files from the upload queue',
        );
    });

    it('should render in disabled state', () => {
        const { getByTestId } = setup({ disabled: true });
        expect(getByTestId('delete-all-files').disabled).toBeTruthy();
    });

    it('should render confirmation on delete all', async () => {
        const onDeleteAllFn = jest.fn();
        const { getByTestId } = setup({ requireOpenAccessStatus: true, onDeleteAll: onDeleteAllFn });

        fireEvent.click(getByTestId('delete-all-files'));
        await waitFor(() => getByTestId('confirm-action'));
        fireEvent.click(getByTestId('confirm-action'));

        expect(onDeleteAllFn).toHaveBeenCalled();
    });
});
