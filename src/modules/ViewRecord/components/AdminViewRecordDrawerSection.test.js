import React from 'react';
import AdminViewRecordDrawerSection from './AdminViewRecordDrawerSection';
import { render, WithRouter, WithReduxStore } from 'test-utils';
const setup = (props = {}, renderer = render) => {
    const obj = {
        section: {},
        index: 1,
        copyToClipboard: jest.fn(),
        ...props,
    };

    return renderer(
        <WithRouter>
            <WithReduxStore>
                <AdminViewRecordDrawerSection {...obj} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('AdminViewRecordDrawerSection', () => {
    it('should render nothing if section object is invalid', () => {
        const { container } = setup();
        expect(container.querySelector('div')).html === null;
    });
    it('should render a divider', () => {
        const { container } = setup({ section: { type: 'divider' } });
        expect(container.querySelector('hr')).toBeInTheDocument();
    });
    it('should render a header and content', () => {
        const { queryByTestId } = setup({
            section: [
                { type: 'header', value: 'test header' },
                { type: 'content', value: 'test content' },
            ],
        });
        expect(queryByTestId('drawer-header-1-0')).toHaveTextContent('test header');
        expect(queryByTestId('drawer-content-value-1-1')).toHaveTextContent('test content');
    });
});
