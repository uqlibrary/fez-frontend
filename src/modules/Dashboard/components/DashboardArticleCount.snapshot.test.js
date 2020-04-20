import { DashboardArticleCount, styles } from './DashboardArticleCount';
import { currentAuthorStats } from 'mock/data';

function setup(testProps = {}) {
    // build full props list required by the component
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(DashboardArticleCount, props);
}

describe('Dashboard Article Count test', () => {
    it('Render the authors article counts as expected for a UQ researcher)', () => {
        const articleCount = currentAuthorStats.total;
        const articleFirstYear = currentAuthorStats.filters.facets.min_date_year_t.value_as_string;
        const articleLastYear = currentAuthorStats.filters.facets.max_date_year_t.value_as_string;
        const wrapper = setup({
            articleCount,
            articleFirstYear,
            articleLastYear,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render anything if any data is missing', () => {
        const articleCount = currentAuthorStats.total;
        const wrapper = setup({
            articleCount,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a style generator', () => {
        const theme = {
            palette: {
                white: {
                    main: '#fff',
                },
            },
            typography: {
                fontWeightLight: '600',
            },
        };

        expect(styles(theme)).toMatchSnapshot();
    });
});
