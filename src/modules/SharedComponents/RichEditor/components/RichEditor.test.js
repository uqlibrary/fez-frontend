import React from 'react';
import RichEditor from './RichEditor';
import Immutable from 'immutable';
import { rtlRender } from 'test-utils';

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
            value: Immutable.Map({ htmlText: 'This is test value' }),
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

    // it('should call componentDidUpdate', () => {
    //     const { container } = setup({ disabled: true });
    //     expect(container).toMatchSnapshot();
    // });

    // it('should set CKEditor as read only', () => {
    //     const { rerender } = setup({ value: { get: () => '<p>test</p>' } });
    //     setup({ disabled: true, value: { get: () => '<p>test</p>' } }, rerender);
    //     expect(setReadOnlyFn).toHaveBeenCalledWith(true);
    //     expect(setDataFn).toHaveBeenCalled();
    // });

    // it('should not set editor as read-only if disabled prop is not being changed', () => {
    //     const { rerender } = setup();
    //     setup({}, rerender);
    //     expect(setReadOnlyFn).not.toHaveBeenCalled();
    //     expect(setDataFn).not.toBeCalled();
    // });

    // it('should set data attribute', () => {
    //     setup({ disabled: true, richEditorId: 'test-id' });
    //     const setAttributeFn = jest.fn();
    //     const e = { editor: { document: { getBody: () => ({ setAttribute: setAttributeFn }) } } };
    //     onContentDomFn(e);
    //     expect(setAttributeFn).toHaveBeenCalledWith('data-testid', 'test-id-input');
    // });

    // it('should call setReadOnly function when instanceReady', () => {
    //     setup({});
    //     onInstanceReadyFn();
    //     expect(setReadOnlyFn).toHaveBeenCalledWith(false);
    // });

    // it.only('should call onChange function passed in props with value', () => {
    //     const onChange = jest.fn();
    //     setup({ onChange });
    //     onChange({
    //         editor: {
    //             document: {
    //                 getBody: () => ({
    //                     getText: () => ({
    //                         trim: () => 'test',
    //                     }),
    //                 }),
    //             },
    //             getData: () => <span>test</span>,
    //         },
    //     });
    //     expect(onChange).toHaveBeenCalledWith({
    //         htmlText: <span>test</span>,
    //         plainText: 'test',
    //     });
    // });

    // it.only('should call onChange function passed in props with null', () => {
    //     const onChange = jest.fn();
    //     setup({ onChange });
    //     onChange({
    //         editor: {
    //             document: {
    //                 getBody: () => ({
    //                     getText: () => ({
    //                         trim: () => '',
    //                     }),
    //                 }),
    //             },
    //             getData: () => <span>test</span>,
    //         },
    //     });
    //     expect(onChange).toHaveBeenCalledWith(null);
    // });
});
