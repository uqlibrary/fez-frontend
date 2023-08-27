import React from 'react';
import NonUqOrgAffiliationFormSection from './NonUqOrgAffiliationFormSection';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        orgAffiliation: testProps.orgAffiliation || '',
        orgType: testProps.orgType || '',
        onOrgAffiliationChange: jest.fn(),
        onOrgTypeChange: jest.fn(),
        locale: {
            fields: {
                organisation: {
                    inputLabel: 'Organisation',
                },
                organisationType: {
                    inputLabel: 'Organisation type',
                    placeholder: 'Select an organisation type',
                },
            },
        },
        ...testProps,
    };
    return rtlRender(<NonUqOrgAffiliationFormSection {...props} />);
}

describe('NonUqOrgAffiliationFormSection tests ', () => {
    it('should render component with defaults', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render component with organisation affiliation value', () => {
        const { container } = setup({ orgAffiliation: 'Test' });
        expect(container).toMatchSnapshot();
    });

    it('should render component with organisation affiliation type value', () => {
        const { container } = setup({ orgType: '453987' });
        expect(container).toMatchSnapshot();
    });

    it('should render component with both values', () => {
        const { container } = setup({ orgAffiliation: 'Test', orgType: '453987' });
        expect(container).toMatchSnapshot();
    });

    it('should render full width input fields', () => {
        const { container } = setup({ orgAffiliation: 'Test', orgType: '453987', fullWidthFields: true });
        expect(container).toMatchSnapshot();
    });
});
