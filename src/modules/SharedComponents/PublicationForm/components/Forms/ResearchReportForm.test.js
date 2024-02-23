import { render, WithReduxStore } from 'test-utils';

jest.dontMock('./ResearchReportForm');

import ResearchReportForm from './ResearchReportForm';
import { NTRO_SUBTYPE_RREB_PUBLIC_SECTOR } from 'config/general';
import React from 'react';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return render(
        <WithReduxStore>
            <ResearchReportForm {...props} />
        </WithReduxStore>,
    );
}

describe('ResearchReportForm renders ', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let getNumbersOnlyFn;
    let transformIssnFn;
    let normalizeIssnFn;
    ReduxFormMock.Field.mockImplementation(
        ({
            name,
            title,
            required,
            disabled,
            label,
            floatingLabelText,
            inputNormalizer,
            normalize,
            transformFunction,
        }) => {
            if (name === 'fez_record_search_key_total_pages.rek_total_pages') {
                getNumbersOnlyFn = normalize;
            } else if (name === 'fez_record_search_key_issn') {
                normalizeIssnFn = inputNormalizer;
                transformIssnFn = transformFunction;
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
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });

    it('component with 15 input fields', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
        };
        const { container } = setup(testProps);
        expect(container.getElementsByTagName('field').length).toEqual(15);
    });

    it('component with all fields disabled', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
            submitting: true,
        };
        const { container } = setup(testProps);
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(15);
    });

    it('should normalize total pages field', () => {
        expect(getNumbersOnlyFn('Four')).toBe('');
        expect(getNumbersOnlyFn('12Three')).toBe('12');
        expect(getNumbersOnlyFn('  01Three')).toBe('01');
        expect(getNumbersOnlyFn('124')).toBe('124');
    });

    it('component with 5 input fields for NTRO', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container.getElementsByTagName('field').length).toEqual(18);
        expect(container.querySelectorAll('[data-testid=standard-card-ntro-data] field').length).toEqual(5);
    });

    it('should render validation required', () => {
        const { container } = setup({
            formValues: {
                get: key => {
                    const values = {
                        rek_subtype: NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
                    };
                    return values[key];
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should normalize the issn input value', () => {
        expect(normalizeIssnFn('12345678')).toEqual('1234-5678');
        expect(normalizeIssnFn('1234-5678')).toEqual('1234-5678');
        expect(normalizeIssnFn('1234')).toEqual('1234');
    });

    it('should transform the issn output value', () => {
        expect(transformIssnFn({ value: 'rek_issn', order: 'rek_issn_order' }, { key: '1234-5678' }, 3)).toEqual({
            rek_issn: '1234-5678',
            rek_issn_order: 4,
        });
    });
});
