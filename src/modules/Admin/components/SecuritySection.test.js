import { SecuritySection } from './SecuritySection';
import { locale } from 'locale';

const setup = (testProps, isShallow) => {
    const props = {
        handleSubmit: jest.fn(),
        text: locale.components.securitySection,
        ...testProps
    };
    return getElement(SecuritySection, props, isShallow);
};

describe('SecuritySection component', () => {
    it('should render properly for an Admin', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render properly for a Superadmin', () => {
        const wrapper = setup({
            accessLevel: 'Superadmin'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});