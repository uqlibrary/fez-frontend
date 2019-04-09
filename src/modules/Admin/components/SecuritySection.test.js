import { SecuritySection } from './SecuritySection';
import { locale } from 'locale';
import { RECORD_TYPE_RECORD, RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY } from 'config/general';

const setup = (testProps, isShallow) => {
    const props = {
        handleSubmit: jest.fn(),
        text: locale.components.securitySection,
        ...testProps
    };
    return getElement(SecuritySection, props, isShallow);
};

describe('SecuritySection component', () => {
    it('should render record edit form for an Admin', () => {
        const wrapper = setup({
            accessLevel: 'Admin',
            recordType: RECORD_TYPE_RECORD,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render community or collection edit form for an Admin', () => {
        const wrapper1 = setup({
            accessLevel: 'Admin',
            recordType: RECORD_TYPE_COMMUNITY,
        });
        expect(toJson(wrapper1)).toMatchSnapshot();
        const wrapper2 = setup({
            accessLevel: 'Admin',
            recordType: RECORD_TYPE_COLLECTION,
        });
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

    it('should render properly for a Superadmin', () => {
        const wrapper = setup({
            accessLevel: 'Superadmin'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});