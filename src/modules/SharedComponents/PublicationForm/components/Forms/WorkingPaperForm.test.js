import WorkingPaperForm from './WorkingPaperForm';
import { ControlledFieldWithReduxStore } from './test-utils';
const setup = props => ControlledFieldWithReduxStore(WorkingPaperForm, props);

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
