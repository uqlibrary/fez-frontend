import CulturalAdvice from './CulturalAdvice';

function setup(testProps) {
    const props = { ...testProps };
    return getElement(CulturalAdvice, props);
}

describe('Component CulturalAdvice', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
