jest.dontMock('./BookForm');

import BookForm from './BookForm';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION, SUBTYPE_EDITED_BOOK } from 'config/general';
import React from 'react';
import { render, WithReduxStore } from 'test-utils';

/* eslint-disable react/prop-types */
jest.mock('redux-form/immutable', () => ({
    Field: jest.fn(),
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,
        isSubmitting: testProps.isSubmitting || false, // : PropTypes.bool
    };
    return render(
        <WithReduxStore>
            <BookForm {...props} />
        </WithReduxStore>,
    );
}

describe('BookForm renders ', () => {
    const ReduxFormMock = require('redux-form/immutable');
    let transformIssnFn;
    let normalizeIssnFn;
    ReduxFormMock.Field.mockImplementation(
        ({ name, title, required, disabled, label, floatingLabelText, inputNormalizer, transformFunction }) => {
            if (name === 'fez_record_search_key_issn') {
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
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(12);
    });

    it('component with 4 input fields for NTRO', () => {
        const { container } = setup({ isNtro: true });
        expect(container.querySelectorAll('[data-testid=standard-card-ntro-data] field').length).toEqual(4);
        expect(container).toMatchSnapshot();
    });

    it('component with 5 input fields for NTRO with musical composition subtype', () => {
        const { container } = setup({ isNtro: true, subtype: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION });
        expect(container.querySelectorAll('[data-testid=standard-card-ntro-data] field').length).toEqual(5);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(12);
    });

    it('component should render contributor assignment', () => {
        const { container } = setup({
            formValues: {
                get: key => {
                    const values = {
                        editors: [{ selected: true }, { selected: true }],
                        authors: [{ selected: true }, { selected: true }],
                    };
                    return values[key];
                },
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should hide author when is edited book', () => {
        const { container } = setup({ subtype: SUBTYPE_EDITED_BOOK });
        expect(container.getElementsByTagName('field').length).toEqual(11);
        expect(container).toMatchSnapshot();
    });

    it('should show author when is not edited book', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(12);
    });

    it('component should render non ntro book', () => {
        const { container } = setup({ isNtro: false });
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
