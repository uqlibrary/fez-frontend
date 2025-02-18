import AudioDocumentForm from './AudioDocumentForm';
import { ControlledFieldWithReduxStore } from './test-utils';
const setup = props => ControlledFieldWithReduxStore(AudioDocumentForm, props);

describe('AudioDocumentForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });

    it('component should render contributor assignment', () => {
        const { container } = setup({
            formValues: {
                editors: [{ selected: true }, { selected: true }],
                authors: [{ selected: true }, { selected: true }],
            },
        });
        expect(container).toMatchSnapshot();
    });
});
