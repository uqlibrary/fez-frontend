import React from 'react';
import RichEditor from './RichEditor';
import 'ckeditor';
import Immutable from 'immutable';

window.CKEDITOR = {
    appendTo: () => ({
        setReadOnly: jest.fn(),
        on: jest.fn()
    })
};

jest.mock('ckeditor');
jest.mock('react-dom');

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        onChange: testProps.onChange || jest.fn(), // PropTypes.func.isRequired,
        disabled: testProps.disabled || false,
    };

    return getElement(RichEditor, props, isShallow);
}


describe('RichEditor tests ', () => {
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
});
