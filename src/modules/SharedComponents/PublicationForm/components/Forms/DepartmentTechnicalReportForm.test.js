import DepartmentTechnicalReportForm from './DepartmentTechnicalReportForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(DepartmentTechnicalReportForm, props);

describe('DepartmentTechnicalReportForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
