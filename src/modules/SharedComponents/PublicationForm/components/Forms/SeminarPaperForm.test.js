import SeminarPaperForm from './SeminarPaperForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(SeminarPaperForm, props);

describe('SeminarPaperForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
