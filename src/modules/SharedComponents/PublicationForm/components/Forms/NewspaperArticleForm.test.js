import NewspaperArticleForm from './NewspaperArticleForm';
import { setupWrapper } from './test-utils';
const setup = props => setupWrapper(NewspaperArticleForm, props);

describe('NewspaperArticleForm', () => {
    it('component', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with all fields disabled', () => {
        const { container } = setup({ isSubmitting: true });
        expect(container).toMatchSnapshot();
    });
});
