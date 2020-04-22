import OrgAffiliationTypeSelector from './OrgAffiliationTypeSelector';
import { AFFILIATION_TYPE_NOT_UQ, AFFILIATION_TYPE_UQ } from 'config/general';

function setup(testProps = {}) {
    const props = {
        affiliation: '',
        onAffiliationChange: jest.fn(),
        locale: {
            inputLabel: 'Org affiliation',
            placeholder: 'Organisational affiliation at time of publication',
            options: [
                { key: AFFILIATION_TYPE_UQ, value: 'UQ' },
                { key: AFFILIATION_TYPE_NOT_UQ, value: 'Not UQ' },
            ],
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
        const wrapper = setup({ affiliation: AFFILIATION_TYPE_UQ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with Not UQ selected', () => {
        const wrapper = setup({ affiliation: AFFILIATION_TYPE_NOT_UQ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
