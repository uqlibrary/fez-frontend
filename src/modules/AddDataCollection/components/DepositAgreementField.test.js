import DepositAgreementField from './DepositAgreementField';

function setup(testProps) {
    const props = {
        disabled: false,
        isDepositAgreementAccepted: false,
        input: {
            onChange: jest.fn(),
        },
        depositAgreement: 'test deposit agreement',
        classes: {
            label: '',
            error: '',
            accepted: '',
        },
        ...testProps,
    };

    return getElement(DepositAgreementField, props);
}

describe('Component DepositAgreement', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
