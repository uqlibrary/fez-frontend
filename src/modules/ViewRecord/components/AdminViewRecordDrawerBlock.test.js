import React from 'react';
import AdminViewRecordDrawerBlock from './AdminViewRecordDrawerBlock';
import { render, WithRouter, WithReduxStore, act, fireEvent } from 'test-utils';
const setup = (props = {}, renderer = render) => {
    const obj = {
        block: {},
        parentIndex: 0,
        index: 1,
        copyToClipboard: jest.fn(),
        ...props,
    };

    return renderer(
        <WithRouter>
            <WithReduxStore>
                <AdminViewRecordDrawerBlock {...obj} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('AdminViewRecordDrawerBlock', () => {
    it('should render a header', () => {
        const { getByRole } = setup({
            block: { type: 'header', value: 'test header' },
        });
        expect(getByRole('heading', { level: 6 })).toHaveTextContent('test header');
    });
    it('should render a plain content block', () => {
        const { getByTestId } = setup({
            block: { type: 'content', value: 'test content' },
            parentIndex: 1,
            index: 0,
        });
        expect(getByTestId('drawer-content-value-1-0')).toHaveTextContent('test content');
    });
    it('should render a scrollable content block', () => {
        const { getByTestId } = setup({
            block: { type: 'content', value: 'test content', scrollable: true },
            parentIndex: 2,
            index: 2,
        });
        expect(getByTestId('drawer-content-scrollable-2-2')).toHaveTextContent('test content');
    });
    it('should render a cliboard copy-able content block', () => {
        const mockClipboardFn = jest.fn();
        const { getByTestId } = setup({
            block: { type: 'content', value: '123', clipboard: true },
            parentIndex: 4,
            index: 0,
            copyToClipboard: mockClipboardFn,
        });
        expect(getByTestId('drawer-content-clipboard-4-0')).toHaveTextContent('123');
        expect(getByTestId('drawer-clipboard-button-4-0')).toBeInTheDocument();
        act(() => {
            fireEvent.click(getByTestId('drawer-clipboard-button-4-0'));
        });

        expect(mockClipboardFn).toHaveBeenCalledWith(expect.anything(), '123');
    });
});
