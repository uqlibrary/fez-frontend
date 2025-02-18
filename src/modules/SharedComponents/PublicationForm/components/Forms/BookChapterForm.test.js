import BookChapterForm from './BookChapterForm';
import { NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION } from 'config/general';
import { ControlledFieldWithReduxStore } from './test-utils';
const setup = props => ControlledFieldWithReduxStore(BookChapterForm, props);

describe('BookChapterForm', () => {
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

    it('shows an error when end page is less than start page', () => {
        const { container } = setup({
            formValues: {
                fez_record_search_key_start_page: {
                    rek_start_page: 768,
                },
                fez_record_search_key_end_page: {
                    rek_end_page: 400,
                },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
