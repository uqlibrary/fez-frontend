import SensitiveHandlingNoteField from './SensitiveHandlingNoteField';

jest.mock('../../../../context');
import { useFormValuesContext } from 'context';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return renderComponent(SensitiveHandlingNoteField, props);
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
        const render = setup({});
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should render disabled view', () => {
        const render = setup({ disabled: true });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
