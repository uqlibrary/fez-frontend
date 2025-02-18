import ResearchReportForm from './ResearchReportForm';
import { ControlledFieldWithReduxStore } from './test-utils';
import { NTRO_SUBTYPE_RREB_PUBLIC_SECTOR } from '../../../../../config/general';
const setup = props => ControlledFieldWithReduxStore(ResearchReportForm, props);

describe('ResearchReportForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });

    it('component with 5 input fields for NTRO', () => {
        const testProps = {
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });

    it('should render validation required', () => {
        const { container } = setup({
            formValues: {
                rek_subtype: NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
            },
        });
        expect(container).toMatchSnapshot();
    });
});
