import AcknowledgementOfCountry from './AcknowledgementOfCountry';

function setup(testProps) {
    const props = { ...testProps };
    return getElement(AcknowledgementOfCountry, props);
}

describe('Component AcknowledgementOfCountry', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
