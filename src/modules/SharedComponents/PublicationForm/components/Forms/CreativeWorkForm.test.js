import CreativeWorkForm from './CreativeWorkForm';
import { NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT, NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE } from 'config/general';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(CreativeWorkForm, props);

describe('CreativeWorkForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });

    it('should show exhibition content correctly', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });

    it('should show content for a random (other) NTRO type correctly (base case)', () => {
        const testProps = {
            subtype: NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
            isNtro: true,
        };
        const { container } = setup(testProps);
        expect(container).toMatchSnapshot();
    });
});
