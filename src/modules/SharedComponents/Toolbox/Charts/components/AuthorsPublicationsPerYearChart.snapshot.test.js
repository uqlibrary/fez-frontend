import AuthorsPublicationsPerYearChart from './AuthorsPublicationsPerYearChart';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(AuthorsPublicationsPerYearChart, props, isShallow);
}

describe('AuthorsPublicationsPerYearChart ', () => {
    it('should render empty chart component', () => {
        const app = setup({series: [], categories: [], yAxisTitle: 'title'});
        expect(toJson(app)).toMatchSnapshot();
    });
});
