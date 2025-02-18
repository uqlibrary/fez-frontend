import { ControlledFieldWithReduxStore } from './test-utils';
import JournalArticleForm from './JournalArticleForm';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION } from 'config/general';
const setup = props => ControlledFieldWithReduxStore(JournalArticleForm, props);

describe('JournalArticleForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });

    it('component with 4 input fields for NTRO', () => {
        const { container } = setup({ isNtro: true });
        expect(container).toMatchSnapshot();
    });

    it('component with 5 input fields for NTRO with musical composition subtype', () => {
        const { container } = setup({ isNtro: true, subtype: NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION });
        expect(container).toMatchSnapshot();
    });
});
