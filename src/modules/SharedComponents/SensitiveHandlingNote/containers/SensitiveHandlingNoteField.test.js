import SensitiveHandlingNoteField from './SensitiveHandlingNoteField';

jest.mock('../../../../context');
import { useFormValuesContext } from 'context';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return getElement(SensitiveHandlingNoteField, props, args);
}

describe('SensitiveHandlingNoteField', () => {
    beforeEach(() => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {},
        }));
    });

    afterEach(() => {
        useFormValuesContext.mockReset();
    });

    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
