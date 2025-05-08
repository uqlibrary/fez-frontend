import ConferencePaperForm from './ConferencePaperForm';
import { ControlledFieldWithReduxStore } from './test-utils';
const setup = props => ControlledFieldWithReduxStore(ConferencePaperForm, props);

describe('ConferencePaperForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
