import WorkingPaperForm from './WorkingPaperForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(WorkingPaperForm, props);

describe('WorkingPaperForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
