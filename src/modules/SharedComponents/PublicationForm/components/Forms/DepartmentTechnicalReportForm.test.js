import React from 'react';

jest.dontMock('./DepartmentTechnicalReportForm');

import DepartmentTechnicalReportForm from './DepartmentTechnicalReportForm';
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
    };
    return render(
        <WithReduxStore>
            <DepartmentTechnicalReportForm {...props} />
        </WithReduxStore>,
    );
}

describe('DepartmentTechnicalReportForm renders ', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 11 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(11);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(11);
    });
});
