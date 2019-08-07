import { FileUploadTermsAndConditions } from './FileUploadTermsAndConditions';
import FileUploadTermsAndConditionsWithStyles from './FileUploadTermsAndConditions';

const getProps = (testProps = {}) => ({
    disabled: false,
    isTermsAndConditionsAccepted: false,
    onAcceptTermsAndConditions: jest.fn(),
    acceptTermsAndConditions: 'test terms and conditions',
    classes: {
        label: '',
        error: '',
        accepted: '',
    },
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(FileUploadTermsAndConditions, getProps(testProps));
}

describe('Component FileUploadTermsAndConditions', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with styles', () => {
        const wrapper = getElement(FileUploadTermsAndConditionsWithStyles, getProps());
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render checked if terms and conditions accepted', () => {
        const wrapper = setup({ isTermsAndConditionsAccepted: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onAcceptTermsAndConditions to handle change', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onAcceptTermsAndConditions: testFn });
        wrapper.instance()._handleChange({ target: { checked: true } });
        expect(testFn).toHaveBeenCalledWith(true);
    });
});
