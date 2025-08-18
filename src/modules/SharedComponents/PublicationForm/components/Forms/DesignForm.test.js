import { NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK } from 'config/general';
import DesignForm from './DesignForm';
import { ControlledFieldWithReduxStore } from './test-utils';
const setup = props => ControlledFieldWithReduxStore(DesignForm, props);

describe('DesignForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });

    it('component with 6 input fields for NTRO', () => {
        const { container } = setup({ isNtro: true });
        expect(container).toMatchSnapshot();
    });

    it('should show architectural content correctly', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });
});
