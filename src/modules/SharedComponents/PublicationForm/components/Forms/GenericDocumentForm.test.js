import React from 'react';

jest.dontMock('./GenericDocumentForm');

import GenericDocumentForm from './GenericDocumentForm';
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
        isSubmitting: testProps.isSubmitting || false, // : PropTypes.bool,
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return render(
        <WithReduxStore>
            <GenericDocumentForm {...props} />
        </WithReduxStore>,
    );
}

describe('GenericDocumentForm renders ', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 8 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(8);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(8);
    });
});
