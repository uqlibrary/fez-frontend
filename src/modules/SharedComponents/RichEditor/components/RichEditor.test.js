import React from 'react';
import RichEditor from './RichEditor';
import 'ckeditor';
import Immutable from 'immutable';

const setReadOnlyFn = jest.fn();
window.CKEDITOR = {
    appendTo: () => ({
        setReadOnly: setReadOnlyFn,
        on: jest.fn()
    })
};

jest.mock('ckeditor');
jest.mock('react-dom');

function setup(testProps, isShallow = true) {
    const props = {
        onChange: jest.fn(), // PropTypes.func.isRequired,
        disabled: false,
        inputRef: {
            current: <div />
        },
        ...testProps,
    };

    return getElement(RichEditor, props, isShallow);
}

describe('RichEditor', () => {
    it('should render component', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given title and description', () => {
        const wrapper = setup({
            title: 'This is test title',
            description: 'This is test description'
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render given title and description with error', () => {
        const wrapper = setup({
            title: 'This is title with error',
            description: 'This is description with error',
            meta: {
                error: 'This field is required'
            }
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error showing maxValue and instructions', () => {
        const wrapper = setup({
            value: Immutable.Map({htmlText: 'This is test value'}),
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: 'This field is required'
            }
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render maxValue with missing instructions', () => {
        const wrapper = setup({
            maxValue: 10,
        }, false);
        expect(toJson(wrapper.find('RichEditor WithStyles(Typography) Typography span'))).toMatchSnapshot();
    });

    it('should render error showing input length', () => {
        const wrapper = setup({
            value: {plainText: 'This is test value', get: jest.fn()},
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: 'This field is required'
            }
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error as react children', () => {
        const wrapper = setup({
            value: {plainText: 'This is test value', get: jest.fn()},
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: (
                    <p>
                        <span>This field is required</span>
                    </p>
                )
            }
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error as one child', () => {
        const wrapper = setup({
            value: {plainText: 'This is test value', get: jest.fn()},
            maxValue: 10,
            instructions: 'test instructions',
            meta: {
                error: (<span>This field is required</span>)
            }
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call componentWillReceiveProps', () => {
        const wrapper = setup({});
        const componentWillReceiveProps = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        wrapper.setProps({
            disabled: true
        });
        expect(componentWillReceiveProps).toHaveBeenCalled();
    });

    it('should not set editor as read-only if disabled prop is not being changed', () => {
        const wrapper = setup({});
        const testFn = jest.fn();
        wrapper.instance().editorInstance = {
            setReadOnly: testFn
        };
        wrapper.instance().componentWillReceiveProps({
            disabled: wrapper.instance().props.disabled
        });
        expect(testFn).not.toBeCalled();
    });

    it('should set CKEditor as read only', () => {
        const wrapper = setup({disabled: true});
        wrapper.instance().onInstanceReady();
        expect(setReadOnlyFn).toHaveBeenCalledWith(true);
    });

    it('should call onChange function passed in props with value', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({onChange: onChangeFn});
        wrapper.instance().onChange({
            editor: {
                document: {
                    getBody: () => ({
                        getText: () => ({
                            trim: () => 'test'
                        })
                    })
                },
                getData: () => (<span>test</span>)
            }
        });
        expect(onChangeFn).toHaveBeenCalledWith({
            htmlText: <span>test</span>,
            plainText: 'test'
        });
    });

    it('should call onChange function passed in props with null', () => {
        const onChangeFn = jest.fn();
        const wrapper = setup({onChange: onChangeFn});
        wrapper.instance().onChange({
            editor: {
                document: {
                    getBody: () => ({
                        getText: () => ({
                            trim: () => ''
                        })
                    })
                },
                getData: () => (<span>test</span>)
            }
        });
        expect(onChangeFn).toHaveBeenCalledWith(null);
    });
});
