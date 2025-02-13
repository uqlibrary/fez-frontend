import React from 'react';

jest.dontMock('./CreativeWorkForm');

import CreativeWorkForm from './CreativeWorkForm';
import { NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT, NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE } from 'config/general';
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
            <CreativeWorkForm {...props} />
        </WithReduxStore>,
    );
}

describe('CreativeWorkForm renders ', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 9 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(9);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(9);
    });

    it('should show exhibition content correctly', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });

    it('should show content for a random (other) NTRO type correctly (base case)', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });
});
