import GeoCoordinatesField from './GeoCoordinatesField';

function setup(testProps = {}, args = { context: { userCountry: 'AU' } }) {
    const props = {
        country: testProps.country || 'AU',
        input: {
            onChange: jest.fn(),
        },
        ...testProps,
    };
    return getElement(GeoCoordinatesField, props, args);
}

describe('GeoCoordinatesField component', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view for AU', () => {
        const context = { userCountry: 'AU' };
        const wrapper = setup({ country: 'AU' }, { isShallow: true, requiresStore: false, context });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view for CN', () => {
        const context = { userCountry: 'CN' };
        const wrapper = setup({ country: 'CN' }, { isShallow: true, requiresStore: false, context });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
