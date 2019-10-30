import CopyrightAgreementField from './CopyrightAgreementField';

function setup(testProps) {
    const props = {
        disabled: false,
        isCopyrightAgreementAccepted: false,
        input: {
            onChange: jest.fn(),
        },
        copyrightAgreement: 'test deposit agreement',
        classes: {
            label: '',
            error: '',
            accepted: '',
        },
        ...testProps,
    };

    return getElement(CopyrightAgreementField, props);
}

describe('Component CopyrightAgreement', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
