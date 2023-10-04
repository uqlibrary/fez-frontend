import PublicationSearchForm from './PublicationSearchForm';
import React from 'react';
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
        autofill: jest.fn(),
        blur: jest.fn(),
        change: jest.fn(),
        clearAsyncError: jest.fn(),
        anyTouched: true,
        asyncValidating: false,
        asyncValidate: jest.fn(),
        clearFields: jest.fn(),
        clearSubmitErrors: jest.fn(),
        destroy: jest.fn(),
        dispatch: jest.fn(),
        handleSubmit: jest.fn(),
        initialize: jest.fn(),
        reset: jest.fn(),
        resetSection: jest.fn(),
        touch: jest.fn(),
        submit: jest.fn(),
        untouch: jest.fn(),
        clearSubmit: jest.fn(),
        dirty: true,
        form: 'PublicationSearchForm',
        initialized: false,
        invalid: false,
        pristine: false,
        submitAsSideEffect: false,
        submitting: false,
        submitFailed: false,
        submitSucceeded: false,
        valid: true,
        locale: {
            title: 'Search for your publication',
            text:
                'Enter either the publication DOI (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) ' +
                'or the title of the publication. This will allow us to check whether the record is already in ' +
                'eSpace or is available from another source.',
            fieldLabels: { search: 'Enter DOI, Pubmed Id or Title' },
            submit: 'Search',
            skip: 'Skip search',
        },
        formValues: { searchQuery: 'testing things' },
        pure: true,
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <PublicationSearchForm {...props} />
        </WithReduxStore>,
    );
}

describe('PublicationSearchForm renders ', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(1);
    });

    it('should display with skip search option', () => {
        const testMethod = jest.fn();
        const testProps = {
            onSkipSearch: testMethod,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });
});
