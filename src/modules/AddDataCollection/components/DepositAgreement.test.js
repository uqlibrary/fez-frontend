import { DepositAgreement } from './DepositAgreement';

function setup(testProps, isShallow = true) {
    const props = {
        disabled: false,
        isDepositAgreementAccepted: false,
        onChange: jest.fn(),
        depositAgreement: 'test deposit agreement',
        classes: {
            label: '',
            error: '',
            accepted: ''
        },
        ...testProps
    };

    return getElement(DepositAgreement, props, isShallow);
}

describe('Component DepositAgreement', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render checked if deposit agreement accepted', () => {
        const wrapper = setup({isDepositAgreementAccepted: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onChange to handle change', () => {
        const testFn = jest.fn();
        const wrapper = setup({onChange: testFn});
        wrapper.instance()._handleChange({target: {checked: true}});
        expect(testFn).toHaveBeenCalledWith('on');
    });
});