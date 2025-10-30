import { ControlledFieldWithReduxStore } from './test-utils';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION, SUBTYPE_EDITED_BOOK } from 'config/general';
import BookForm from './BookForm';

// Mock the RichEditorField to avoid lazy loading in tests
jest.mock('modules/SharedComponents/RichEditor', () => ({
    RichEditorField: require('modules/SharedComponents/RichEditor/components/RichEditor').default,
}));

const setup = props => ControlledFieldWithReduxStore(BookForm, props);

describe('BookForm', () => {
    it('component', () => {
        const { container } = setup();
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

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });

    it('component should render contributor assignment', () => {
        const { container } = setup({
            values: {
                editors: [{ selected: true }, { selected: true }],
                authors: [{ selected: true }, { selected: true }],
            },
        });
        expect(container).toMatchSnapshot();
    });

    it('should hide author when is edited book', () => {
        const { container } = setup({ subtype: SUBTYPE_EDITED_BOOK });
        expect(container).toMatchSnapshot();
    });
});
