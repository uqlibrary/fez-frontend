import React from 'react';
import { AddSection } from './AddSection';
import { rtlRender, WithRouter } from 'test-utils';

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
    };

    return rtlRender(
        <WithRouter>
            <AddSection {...props} />
        </WithRouter>,
    );
}

describe('AddSection component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render with subtypes', () => {
        const { container } = setup({
            hasDefaultDocTypeSubType: true,
        });

        expect(container).toMatchSnapshot();
    });
});
