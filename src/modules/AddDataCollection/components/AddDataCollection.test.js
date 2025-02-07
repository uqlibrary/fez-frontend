import React from 'react';
import AddDataCollection, { licenseText } from './AddDataCollection';
import Immutable from 'immutable';
import { render, WithReduxStore, WithRouter, fireEvent, waitFor, screen } from 'test-utils';
import { before } from 'lodash';

/* eslint-disable react/prop-types */
jest.mock('modules/SharedComponents/Toolbox/ReactHookForm', () => ({
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

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        resetForm: testProps.resetForm || jest.fn(),
        ...testProps,
    };

    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <AddDataCollection {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

jest.mock('hooks', () => ({
    useValidatedForm: jest.fn(() => ({
        handleSubmit: jest.fn(),
        watch: jest.fn(),
        setError: jest.fn(),
        control: {},
        formState: {
            isSubmitting: false,
            isSubmitSuccessful: false,
            isDirty: false,
            errors: {},
        },
    })),
}));
describe('AddDataCollection test mocking hooks', () => {
    beforeEach(() => {
        // jest.resetModules(); // Reset modules to ensure fresh imports
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks so other tests are unaffected
        jest.resetModules(); // Reset modules to ensure fresh imports
        jest.unmock('hooks');
        jest.restoreAllMocks();
    });
    it('should navigate to my datasets url', async () => {
        const { useValidatedForm } = require('hooks'); // Mocked version
        const MyComponent = require('./AddDataCollection').default;
        const { render } = require('@testing-library/react');

        render(
            <WithReduxStore>
                <WithRouter>
                    <MyComponent submitSucceeded={false} />
                </WithRouter>
            </WithReduxStore>,
        );

        expect(useValidatedForm).toHaveBeenCalled();
    });
});

describe('AddDataCollection test', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });

    it('should render data set form', () => {
        const { container, getByRole } = setup();

        expect(container).toMatchSnapshot();
        expect(container.getElementsByTagName('field').length).toEqual(28);
        expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Submit for approval' })).toBeInTheDocument();
    });
});
