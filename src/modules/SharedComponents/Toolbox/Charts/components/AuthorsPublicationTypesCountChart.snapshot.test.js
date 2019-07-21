import AuthorsPublicationTypesCountChart from './AuthorsPublicationTypesCountChart';

function setup(testProps = {}) {
    const props = { ...testProps };
    return getElement(AuthorsPublicationTypesCountChart, props);
}

describe('AuthorsPublicationTypesCountChart ', () => {
    it('should render empty chart component', () => {
        const app = setup({ series: [] });
        expect(toJson(app)).toMatchSnapshot();
    });
});
