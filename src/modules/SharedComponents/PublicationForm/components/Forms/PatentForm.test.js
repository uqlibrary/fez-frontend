import PatentForm from './PatentForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(PatentForm, props);

describe('PatentForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
