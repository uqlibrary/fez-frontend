import React from 'react';
import FileUploadRowHeader from './FileUploadRowHeader';
import { rtlRender, fireEvent, waitFor } from 'test-utils';
import mediaQuery from 'css-mediaquery';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}

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
        const { getByText, getByTitle, queryByText } = setup();
        expect(getByText('File name')).toBeInTheDocument();
        expect(queryByText('Access conditions')).toBeNull();
        expect(queryByText('Embargo release date')).toBeNull();
        expect(getByTitle('Remove all files from the upload queue')).toBeInTheDocument();
    });

    it('should render with access condition and embargo date column', () => {
        const { getByText, getByTitle } = setup({ requireOpenAccessStatus: true });
        expect(getByText('File name')).toBeInTheDocument();
        expect(getByText('Access conditions')).toBeInTheDocument();
        expect(getByText('Embargo release date')).toBeInTheDocument();
        expect(getByTitle('Remove all files from the upload queue')).toBeInTheDocument();
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
