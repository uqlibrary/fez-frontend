import ThesisForm from './ThesisForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(ThesisForm, props);

describe('ThesisForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
