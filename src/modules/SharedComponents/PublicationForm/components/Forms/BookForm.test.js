import { setupWrapper } from './test-utils';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION, SUBTYPE_EDITED_BOOK } from 'config/general';
import BookForm from './BookForm';
const setup = props => setupWrapper(BookForm, props);

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
            formValues: {
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
