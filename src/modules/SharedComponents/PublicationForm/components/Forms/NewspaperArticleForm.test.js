import React from 'react';

jest.dontMock('./NewspaperArticleForm');

import NewspaperArticleForm from './NewspaperArticleForm';
import { render, WithReduxStore } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: props => {
        return (
            <field
                is="mock"
                name={props.name}
                title={props.title}
                required={props.required}
                disabled={props.disabled}
                label={props.label || props.floatingLabelText}
                hasError={props.hasError}
            />
        );
    },
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return render(
        <WithReduxStore>
            <NewspaperArticleForm {...props} />
        </WithReduxStore>,
    );
}

describe('NewspaperArticleForm renders ', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 8 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(8);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ submitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(8);
    });
});
