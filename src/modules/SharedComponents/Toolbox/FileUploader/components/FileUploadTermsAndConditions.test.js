import { FileUploadTermsAndConditions } from './FileUploadTermsAndConditions';

function setup(testProps, isShallow = true) {
    const props = {
        disabled: false,
        isTermsAndConditionsAccepted: false,
        onAcceptTermsAndConditions: jest.fn(),
        acceptTermsAndConditions: 'test terms and conditions',
        classes: {
            label: '',
            error: '',
            accepted: ''
        },
        ...testProps
    };

    return getElement(FileUploadTermsAndConditions, props, isShallow);
}

describe('Component FileUploadTermsAndConditions', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render checked if terms and conditions accepted', () => {
        const wrapper = setup({isTermsAndConditionsAccepted: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onAcceptTermsAndConditions to handle change', () => {
        const testFn = jest.fn();
        const wrapper = setup({onAcceptTermsAndConditions: testFn});
        wrapper.instance()._handleChange({target: {checked: true}});
        expect(testFn).toHaveBeenCalledWith(true);
    });
});