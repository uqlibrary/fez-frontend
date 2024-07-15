import React from 'react';
import { NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK } from 'config/general';

jest.dontMock('./DesignForm');

import DesignForm from './DesignForm';
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
            <DesignForm {...props} />
        </WithReduxStore>,
    );
}

describe('DesignForm renders ', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(12);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ submitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(12);
    });

    it('component with 6 input fields for NTRO', () => {
        const { container } = setup({ isNtro: true });
        expect(container.querySelectorAll('[data-testid=standard-card-ntro-data] field').length).toEqual(6);
    });

    it('should show architectural content correctly', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });
});
