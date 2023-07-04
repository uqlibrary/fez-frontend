import React from 'react';
import FileUploadRowHeader from './FileUploadRowHeader';
import { rtlRender, fireEvent, waitFor, createMatchMedia, within } from 'test-utils';

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
        const { getByText, queryByText, getByLabelText } = setup();
        expect(getByText('File name')).toBeInTheDocument();
        expect(queryByText('Access conditions')).toBeNull();
        expect(queryByText('Embargo release date')).toBeNull();
        expect(getByLabelText('Remove all files from the upload queue')).toBeInTheDocument();
    });

    it('should render with access condition and embargo date column', () => {
        const { getByText, getByLabelText } = setup({ requireOpenAccessStatus: true });
        expect(getByText('File name')).toBeInTheDocument();
        expect(getByText('Access conditions')).toBeInTheDocument();
        expect(getByText('Embargo release date')).toBeInTheDocument();
        expect(getByLabelText('Remove all files from the upload queue')).toBeInTheDocument();
    });

    it('should render for admins with security policy and embargo date column', () => {
        const { getByText, queryByText, getByLabelText } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
        });
        expect(getByText('File name')).toBeInTheDocument();

        expect(queryByText('Access conditions')).toBeNull();
        expect(getByText('Security policy')).toBeInTheDocument();
        expect(getByText('Embargo release date')).toBeInTheDocument();
        expect(getByLabelText('Remove all files from the upload queue')).toBeInTheDocument();
    });

    it('should render in disabled state', () => {
        const { getByLabelText } = setup({ disabled: true });
        expect(
            within(getByLabelText('Remove all files from the upload queue')).getByRole('button').disabled,
        ).toBeTruthy();
    });

    it('should render confirmation on delete all', async () => {
        const onDeleteAllFn = jest.fn();
        const { getByTestId, getByLabelText } = setup({ requireOpenAccessStatus: true, onDeleteAll: onDeleteAllFn });

        fireEvent.click(within(getByLabelText('Remove all files from the upload queue')).getByRole('button'));
        await waitFor(() => getByTestId('confirm-delete-all-files'));
        fireEvent.click(getByTestId('confirm-delete-all-files'));

        expect(onDeleteAllFn).toHaveBeenCalled();
    });
});
