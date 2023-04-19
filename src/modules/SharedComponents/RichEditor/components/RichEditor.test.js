import React from 'react';
import RichEditor from './RichEditor';
import 'ckeditor';
import Immutable from 'immutable';

const setReadOnlyFn = jest.fn();
const setDataFn = jest.fn();
window.CKEDITOR = {
    replace: () => ({
        setReadOnly: setReadOnlyFn,
        setData: setDataFn,
        on: jest.fn(),
    }),
};

jest.mock('ckeditor');
jest.mock('react-dom');

function setup(testProps = {}, args = {}) {
    const props = {
        onChange: jest.fn(), // PropTypes.func.isRequired,
        disabled: false,
        richEditorId: 'rek-test',
        inputRef: {
            current: <div />,
        },
        ...testProps,
    };

    return getElement(RichEditor, props, args);
}

describe('RichEditor', () => {
    it('should render component', () => {
        const wrapper = setup({}, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given title and description', () => {
        const wrapper = setup(
            {
                title: 'This is test title',
                description: 'This is test description',
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given title and description with error', () => {
        const wrapper = setup(
            {
                title: 'This is title with error',
                description: 'This is description with error',
                meta: {
                    error: 'This field is required',
                },
                required: true,
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error showing maxValue and instructions', () => {
        const wrapper = setup(
            {
                value: Immutable.Map({ htmlText: 'This is test value' }),
                maxValue: 10,
                instructions: 'test instructions',
                meta: {
                    error: 'This field is required',
                },
                required: true,
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render maxValue with missing instructions', () => {
        const wrapper = setup(
            {
                maxValue: 10,
                required: true,
            },
            { isShallow: false },
        );
        expect(toJson(wrapper.find('RichEditor WithStyles(Typography) Typography span'))).toMatchSnapshot();
    });

    it('should render error showing input length', () => {
        const wrapper = setup(
            {
                value: { plainText: 'This is test value', get: jest.fn() },
                maxValue: 10,
                instructions: 'test instructions',
                meta: {
                    error: 'This field is required',
                },
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error as react children', () => {
        const wrapper = setup(
            {
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
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error as one child', () => {
        const wrapper = setup(
            {
                value: { plainText: 'This is test value', get: jest.fn() },
                maxValue: 10,
                instructions: 'test instructions',
                meta: {
                    error: <span>This field is required</span>,
                },
            },
            { isShallow: false },
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render plain text value', () => {
        const wrapper = setup({
            value: 'test',
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call componentDidUpdate', () => {
        const wrapper = setup();
        wrapper.setProps({
            disabled: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not set editor as read-only if disabled prop is not being changed', () => {
        const wrapper = setup();
        const testFn = jest.fn();
        wrapper.instance().editorInstance = {
            setReadOnly: testFn,
        };
        wrapper.update();
        expect(testFn).not.toHaveBeenCalled();
        wrapper.setProps({ disabled: wrapper.instance().props.disabled });
        expect(testFn).not.toBeCalled();
    });

    it('should set CKEditor as read only', () => {
        const wrapper = setup({ disabled: true, value: { get: () => '<p>test</p>' } });
        wrapper.instance().onInstanceReady();
        expect(setReadOnlyFn).toHaveBeenCalledWith(true);
        expect(setDataFn).toHaveBeenCalled();
    });

    it('should set data attribute', () => {
        const wrapper = setup({ disabled: true, richEditorId: 'test-id' });
        const setAttributeFn = jest.fn();
        const e = { editor: { document: { getBody: () => ({ setAttribute: setAttributeFn }) } } };
        wrapper.instance().onContentDom(e);
        expect(setAttributeFn).toHaveBeenCalledWith('data-testid', 'test-id-input');
    });

    it('should call onChange function passed in props with value', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({ onChange: onChangeFn });
        wrapper.instance().onChange({
            editor: {
                document: {
                    getBody: () => ({
                        getText: () => ({
                            trim: () => 'test',
                        }),
                    }),
                },
                getData: () => <span>test</span>,
            },
        });
        expect(onChangeFn).toHaveBeenCalledWith({
            htmlText: <span>test</span>,
            plainText: 'test',
        });
    });

    it('should call onChange function passed in props with null', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({ onChange: onChangeFn });
        wrapper.instance().onChange({
            editor: {
                document: {
                    getBody: () => ({
                        getText: () => ({
                            trim: () => '',
                        }),
                    }),
                },
                getData: () => <span>test</span>,
            },
        });
        expect(onChangeFn).toHaveBeenCalledWith(null);
    });
});
