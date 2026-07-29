import React from 'react';

import { rtlRender } from 'test-utils';

import RichTextEditor from './RichTextEditor';

function setup(testProps = {}) {
    const props = {
        value: '<p>Hello World</p>',
        onChange: jest.fn(),
        ...testProps,
    };

    return {
        ...rtlRender(<RichTextEditor {...props} />),
        props,
    };
}

describe('RichTextEditor', () => {
    it('should render editor', () => {
        const { container } = setup({ singleLine: true, description: 'Description' });

        expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
    });

    it('should render initial content', () => {
        const { container } = setup({
            textOnlyOnPaste: false,
            value: '<p>Hello World</p>',
        });

        expect(container.querySelector('.ProseMirror')).toHaveTextContent('Hello World');
    });

    it('should render toolbar', () => {
        const { getByRole } = setup();

        expect(getByRole('button', { name: /bold/i })).toBeInTheDocument();
    });

    it('should render editor id', () => {
        const { container } = setup({
            id: 'test-editor',
        });

        expect(container.querySelector('#test-editor')).toBeInTheDocument();
    });

    it('should render editor test id', () => {
        const { getByTestId } = setup({
            testId: 'test-editor',
        });

        expect(getByTestId('test-editor')).toBeInTheDocument();
    });

    it('should render empty editor when value is empty', () => {
        const { container } = setup({
            value: '',
        });

        expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
    });

    it('should handle null value', () => {
        const { container } = setup({
            value: null,
        });

        expect(container.querySelector('.ProseMirror')).toBeInTheDocument();
    });

    it('should render error from state', () => {
        const { getByText } = setup({
            state: {
                error: 'This field is required',
            },
        });

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render errorText', () => {
        const { getByText } = setup({
            description: 'Description',
            error: true,
            errorText: 'This field is required',
        });

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render errorText object', () => {
        const { getByText } = setup({
            title: 'Title',
            error: true,
            errorText: {
                message: 'This field is required',
            },
        });

        expect(getByText('This field is required')).toBeInTheDocument();
    });

    it('should render required indicator', () => {
        const { getByText } = setup({
            title: 'Description',
            required: true,
        });

        expect(getByText(/Description/)).toHaveTextContent('Description *');
    });

    it('should render character count', () => {
        const { getByText } = setup({
            maxValue: 500,
        });

        expect(getByText('0 characters of 500')).toBeInTheDocument();
    });

    it('should render error and character count', () => {
        const { getByText } = setup({
            maxValue: 100,
            state: {
                error: 'This field is required',
            },
        });

        expect(getByText('This field is required')).toBeInTheDocument();
        expect(getByText('0 characters of 100')).toBeInTheDocument();
    });
});
