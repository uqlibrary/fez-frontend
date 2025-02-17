import GenericDocumentForm from './GenericDocumentForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(GenericDocumentForm, props);

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
