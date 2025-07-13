import GenericDocumentForm from './GenericDocumentForm';
import { ControlledFieldWithReduxStore } from './test-utils';
const setup = props => ControlledFieldWithReduxStore(GenericDocumentForm, props);

describe('GenericDocumentForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
