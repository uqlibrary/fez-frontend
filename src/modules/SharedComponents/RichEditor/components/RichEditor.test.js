import React from 'react';
import RichEditor from './RichEditor';
import { rtlRender } from 'test-utils';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

function setup(testProps = {}, renderMethod = rtlRender) {
    const props = {
        onChange: jest.fn(), // PropTypes.func.isRequired,
        disabled: false,
        richEditorId: 'rek-test',
        inputRef: {
            current: <div />,
        },
        ...testProps,
    };

    return renderMethod(<RichEditor {...props} />);
}

describe('RichEditor', () => {
    const setReadOnlyFn = jest.fn();
    const setDataFn = jest.fn();

    afterEach(() => {
        setReadOnlyFn.mockClear();
        setDataFn.mockClear();
    });

    it('should render component', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render given title and description', () => {
        const { container } = setup({
            title: 'This is test title',
            description: 'This is test description',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render given title and description with error', () => {
        const { container } = setup({
            title: 'This is title with error',
            description: 'This is description with error',
            meta: {
                error: 'This field is required',
            },
            required: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error showing maxValue and instructions', () => {
        const { container } = setup({
            value: { htmlText: 'This is test value' },
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: 'This field is required',
            },
            required: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render maxValue with missing instructions', () => {
        const { container } = setup({
            maxValue: 10,
            required: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error showing input length', () => {
        const { container } = setup({
            value: { plainText: 'This is test value', get: jest.fn() },
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: 'This field is required',
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error as react children', () => {
        const { container } = setup({
            value: { plainText: 'This is test value', get: jest.fn() },
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: (
                    <p>
                        <span>This field is required</span>
                    </p>
                ),
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render error as one child', () => {
        const { container } = setup({
            value: { plainText: 'This is test value', get: jest.fn() },
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: <span>This field is required</span>,
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should render plain text value', () => {
        const { container } = setup({ value: 'test' });
        expect(container).toMatchSnapshot();
    });
    it('should render input text value', () => {
        const { container } = setup({ input: { value: 'test' } });
        expect(container).toMatchSnapshot();
    });
    it('should render input html text value', () => {
        const { container } = setup({ input: { value: { htmlText: 'test' } } });
        expect(container).toMatchSnapshot();
    });
    it('should render input plain text value', () => {
        const { container } = setup({ input: { value: { plainText: 'test' } } });
        expect(container).toMatchSnapshot();
    });
    it('should render redux value using htmlText', () => {
        const { container } = setup({ value: { htmlText: 'test' } });
        expect(container).toMatchSnapshot();
    });
    it('should render redux value using plainText', () => {
        const { container } = setup({ value: { plainText: 'test' } });
        expect(container).toMatchSnapshot();
    });
    it('should render input redux value using htmlText', () => {
        const { container } = setup({ input: { value: { htmlText: 'test' } } });
        expect(container).toMatchSnapshot();
    });
    it('should render input redux value using plainText', () => {
        const { container } = setup({ input: { value: { plainText: 'test' } } });
        expect(container).toMatchSnapshot();
    });

    it('should handle null value', () => {
        const { container } = setup({ value: null });
        expect(container).toMatchSnapshot();
    });

    it('should render error from react-hook-form', () => {
        const { container } = setup({
            title: 'This is title with error',
            description: 'This is description with error',
            required: true,
            error: true,
            errorText: 'This field is required',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render alternative error from react-hook-form', () => {
        const { container } = setup({
            title: 'This is title with error',
            description: 'This is description with error',
            required: true,
            error: true,
            errorText: { message: 'This field is required' },
        });
        expect(container).toMatchSnapshot();
    });
});
