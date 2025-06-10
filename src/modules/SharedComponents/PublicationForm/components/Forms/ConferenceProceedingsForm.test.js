import { ControlledFieldWithReduxStore } from './test-utils';
import ConferenceProceedingsForm from './ConferenceProceedingsForm';
const setup = props => ControlledFieldWithReduxStore(ConferenceProceedingsForm, props);

describe('ConferenceProceedingsForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
