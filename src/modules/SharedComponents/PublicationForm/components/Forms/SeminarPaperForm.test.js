import SeminarPaperForm from './SeminarPaperForm';
import { ControlledFieldWithReduxStore } from './test-utils';
const setup = props => ControlledFieldWithReduxStore(SeminarPaperForm, props);

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
