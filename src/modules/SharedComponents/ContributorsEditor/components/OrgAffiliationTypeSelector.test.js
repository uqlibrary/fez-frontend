import OrgAffiliationTypeSelector from './OrgAffiliationTypeSelector';

function setup(testProps = {}) {
    const props = {
        affiliation: '',
        onAffiliationChange: jest.fn(),
        locale: {
            inputLabel: 'Org affiliation',
            placeholder: 'Organisational affiliation at time of publication',
            options: [{ key: 'UQ', value: 'UQ' }, { key: 'NotUQ', value: 'Not UQ' }],
        },
        ...testProps,
    };
    return getElement(OrgAffiliationTypeSelector, props);
}

describe('OrgAffiliationTypeSelector tests ', () => {
    it('should render component with default values', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with UQ selected', () => {
        const wrapper = setup({ affiliation: 'UQ' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with Not UQ selected', () => {
        const wrapper = setup({ affiliation: 'NotUQ' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
