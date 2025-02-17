import ImageDocumentForm from './ImageDocumentForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(ImageDocumentForm, props);

describe('ImageDocumentForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
