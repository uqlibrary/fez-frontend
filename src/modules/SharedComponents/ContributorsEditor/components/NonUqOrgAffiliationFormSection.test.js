import NonUqOrgAffiliationFormSection from './NonUqOrgAffiliationFormSection';

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
    return getElement(NonUqOrgAffiliationFormSection, props);
}

describe('NonUqOrgAffiliationFormSection tests ', () => {
    it('should render component with defaults', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with organisation affiliation value', () => {
        const wrapper = setup({ orgAffiliation: 'Test' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with organisation affiliation type value', () => {
        const wrapper = setup({ orgType: '453987' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with both values', () => {
        const wrapper = setup({ orgAffiliation: 'Test', orgType: '453987' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
