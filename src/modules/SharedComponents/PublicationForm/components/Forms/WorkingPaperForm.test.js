jest.dontMock('./WorkingPaperForm');

import WorkingPaperForm from './WorkingPaperForm';
import React from 'react';
import { render, WithReduxStore } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
        isSubmitting: testProps.isSubmitting || false, // : PropTypes.bool,
    };
    return render(
        <WithReduxStore>
            <WorkingPaperForm {...props} />
        </WithReduxStore>,
    );
}

describe('WorkingPaperForm renders ', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let getNumbersOnlyFn;
    ReduxFormMock.Field.mockImplementation(
        ({ name, title, required, disabled, label, floatingLabelText, normalize }) => {
            if (name === 'fez_record_search_key_total_pages.rek_total_pages') {
                getNumbersOnlyFn = normalize;
            }

            return (
                <field
                    is="mock"
                    name={name}
                    title={title}
                    required={required}
                    disabled={disabled}
                    label={label || floatingLabelText}
                />
            );
        },
    );

    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(12);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(12);
    });

    it('should normalize total pages field', () => {
        // setup();
        expect(getNumbersOnlyFn('Four')).toBe('');
        expect(getNumbersOnlyFn('12Three')).toBe('12');
        expect(getNumbersOnlyFn('  01Three')).toBe('01');
        expect(getNumbersOnlyFn('124')).toBe('124');
    });
});
