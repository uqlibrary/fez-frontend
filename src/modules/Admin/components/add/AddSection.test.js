import { AddSection } from './AddSection';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        ...testProps,
    };

    return getElement(AddSection, props, args);
}

describe('AddSection component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with subtypes', () => {
        const wrapper = setup({
            hasDefaultDocTypeSubType: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
