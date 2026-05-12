import React from 'react';
import { render, fireEvent } from 'test-utils';
import CommissionedResearchReportField from './CommissionedResearchReportField';
import { default as locale } from './locale';

let mockState = {};

jest.mock('../ReactHookForm', () => {
    const React = require('react');

    return {
        // eslint-disable-next-line react/prop-types
        Field: ({ component: Component, disabled, name, 'data-testid': testId }) => {
            const [value, setValue] = React.useState(false);

            return (
                <div data-testid={testId}>
                    <Component
                        name={name}
                        disabled={disabled}
                        value={value}
                        state={mockState}
                        onChange={e => setValue(e.target.checked)}
                    />
                </div>
            );
        },
    };
});

const setup = props => render(<CommissionedResearchReportField control {...props} />);

describe('CommissionedResearchReportField', () => {
    it('should allow toggling checkbox', () => {
        const { queryByTestId, getByText, getByRole } = setup();

        const checkbox = getByRole('checkbox');

        expect(queryByTestId('commissioned-research-report')).toBeInTheDocument();
        expect(getByText(locale.label)).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    it('should support disabled and custom name props', () => {
        const { queryByTestId, getByRole } = setup({
            disabled: true,
            name: 'customFieldName',
        });

        const checkbox = getByRole('checkbox');

        expect(checkbox).toBeDisabled();
        expect(checkbox).toHaveAttribute('name', 'customFieldName');
        expect(queryByTestId('commissioned-research-report-label')).toBeInTheDocument();
        expect(queryByTestId('commissioned-research-report-error')).not.toBeInTheDocument();
    });

    it('should render error color when field has error', () => {
        mockState = { error: 'The field is required' };
        const { queryByTestId } = setup();
        expect(queryByTestId('commissioned-research-report-label')).not.toBeInTheDocument();
        expect(queryByTestId('commissioned-research-report-error')).toBeInTheDocument();
    });
});
