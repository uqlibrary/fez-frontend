import PreprintForm from './PreprintForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(PreprintForm, props);

describe('PreprintForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
