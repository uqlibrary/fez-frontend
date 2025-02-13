import ReduxFormMock from 'redux-form/immutable';

jest.dontMock('./ConferencePaperForm');
import ConferencePaperForm from './ConferencePaperForm';
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
        subtypeVocabId: testProps.subtypeVocabId || 0, // : PropTypes.number
    };
    return render(
        <WithReduxStore>
            <ConferencePaperForm {...props} />
        </WithReduxStore>,
    );
}

describe('ConferencePaperForm renders ', () => {
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

    it('component with 17 input fields', () => {
        const { container } = setup();
        expect(container.getElementsByTagName('field').length).toEqual(17);
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container.querySelectorAll('field[disabled=true]').length).toEqual(17);
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
