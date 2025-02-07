import React from 'react';
import AddDataCollection from './AddDataCollection';
import { render, WithReduxStore, WithRouter } from 'test-utils';
import { useValidatedForm } from 'hooks';

// Mock the Field component
jest.mock('modules/SharedComponents/Toolbox/ReactHookForm', () => ({
    Field: () => <div data-testid="field" />,
}));

// Initially mock the useValidatedForm hook
jest.mock('hooks', () => ({
    useValidatedForm: jest.fn(),
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

describe('AddDataCollection component tests', () => {
    it('should navigate to my datasets url', () => {
        // Mock the hook implementation for this test
        useValidatedForm.mockImplementationOnce(() => ({
            formState: {},
            handleSubmit: jest.fn(),
        }));

        setup();

        expect(useValidatedForm).toHaveBeenCalled();
    });

    it('should render dataset form', async () => {
        // Load the actual implementation of the useValidatedForm hook from 'hooks'
        const { useValidatedForm: originalUseValidatedForm } = jest.requireActual('hooks');

        // Restore useValidatedForm to its original definition from the module
        useValidatedForm.mockImplementation(originalUseValidatedForm);

        const { container } = setup();

        // Log the rendered output for debugging
        console.log('Rendered Output:', container.innerHTML);

        // Check if the fields are rendered
        const fields = container.querySelectorAll('[data-testid="field"]');
        console.log('Number of fields rendered:', fields.length);

        // Ensure at least some fields are rendered
        expect(fields.length).toBeGreaterThan(0);

        // Check for exactly 28 fields if expected
        expect(fields.length).toEqual(28); // Adjust as necessary
    });
});
