import AcknowledgementOfCountry from './AcknowledgementOfCountry';

function setup(testProps, isShallow = true) {
    const props = { ...testProps };
    return getElement(AcknowledgementOfCountry, props, isShallow);
}

describe('Component AcknowledgementOfCountry', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
