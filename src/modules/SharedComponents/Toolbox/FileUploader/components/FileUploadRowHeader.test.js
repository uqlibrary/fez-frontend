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
        const { getByText, queryByText, getByRole } = setup();
        expect(getByText('File name')).toBeInTheDocument();
        expect(queryByText('Access conditions')).toBeNull();
        expect(queryByText('Embargo release date')).toBeNull();
        expect(getByRole('button', { name: 'Remove all files from the upload queue' })).toBeInTheDocument();
    });

    it('should render with access condition and embargo date column', () => {
        const { getByText, getByRole } = setup({ requireOpenAccessStatus: true });
        expect(getByText('File name')).toBeInTheDocument();
        expect(getByText('Access conditions')).toBeInTheDocument();
        expect(getByText('Embargo release date')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Remove all files from the upload queue' })).toBeInTheDocument();
    });

    it('should render for admins with security policy and embargo date column', () => {
        const { getByText, queryByText, getByRole } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
        });
        expect(getByText('File name')).toBeInTheDocument();

        expect(queryByText('Access conditions')).toBeNull();
        expect(getByText('Security policy')).toBeInTheDocument();
        expect(getByText('Embargo release date')).toBeInTheDocument();
        expect(getByRole('button', { name: 'Remove all files from the upload queue' })).toBeInTheDocument();
    });

    it('should render in disabled state', () => {
        const { getByRole } = setup({ disabled: true });
        expect(getByRole('button', { name: 'Remove all files from the upload queue' }).disabled).toBeTruthy();
    });

    it('should render confirmation on delete all', async () => {
        const onDeleteAllFn = jest.fn();
        const { getByTestId, getByRole } = setup({ requireOpenAccessStatus: true, onDeleteAll: onDeleteAllFn });

        fireEvent.click(getByRole('button', { name: 'Remove all files from the upload queue' }));
        await waitFor(() => getByTestId('confirm-delete-all-files'));
        fireEvent.click(getByTestId('confirm-delete-all-files'));

        expect(onDeleteAllFn).toHaveBeenCalled();
    });
});
