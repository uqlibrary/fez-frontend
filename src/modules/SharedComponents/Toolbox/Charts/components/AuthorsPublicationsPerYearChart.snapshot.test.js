import AuthorsPublicationsPerYearChart from './AuthorsPublicationsPerYearChart';
// import currentAuthorStats from 'mock';

function setup(testProps, isShallow = true) {
    const props = {
        "className":"barChart",
        "series":[
            {"name":"Journal Article","data":[0,1,1,1,1,1,1,1,1,1,75,1,1,2,3,0,2,5,3,1,4,0,1,3,0,2,3,6,3,4,9,4,13,9,10,3,4,5,7,0,1,0,0,0,1,5,1,1]},
            {"name":"Conference Paper","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,4,0,7,4,8,3,1,3,3,4,1,5,0,0,3,0,0,0,0,0,0,0,0]},
            {"name":"Book","data":[1,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,1,0,0,7,0,0,0,0,0,0,0,0,3,17,0,0,0,0,0,1,0,2,4,1,0,3,0,0]},
            {"name":"Conference Proceedings","data":[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,3,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]},
            {"name":"Other","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,2,0,0],"extraInfoForLegend":"Thesis, Working Paper, Audio Document, Generic Document, Book Chapter, Newspaper Article"}
            ],
                "categories":[111,1011,1111,1121,1212,1213,1222,1223,1231,1233,1234,1901,1987,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2022,2131,2222,2323,3424],
        "yAxisTitle":"Total publications",
        ...testProps
    };
    return getElement(AuthorsPublicationsPerYearChart, props, isShallow);
}

describe('AuthorsPublicationsPerYearChart ', () => {
    it('should render empty chart component', () => {
        const app = setup({series: [], categories: [], yAxisTitle: 'title'});
        expect(toJson(app)).toMatchSnapshot();
    });

    it('should render component with no set class name', () => {
        const wrapper = setup({
            className: ''
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('labelFormatter', () => {
        const wrapper = setup({});
        expect(wrapper.state().options.legend.labelFormatter()).toBe('');
        const scope1 = {
            userOptions: {
                name: 'test'
            }
        };
        expect(wrapper.state().options.legend.labelFormatter.bind(scope1)()).toBe('test');
        const scope2 = {
            userOptions : {
                name: 'test',
                extraInfoForLegend: 'a, b'
            }
        };
        expect(wrapper.state().options.legend.labelFormatter.bind(scope2)()).toBe('test (a, <br />b)');
    });
});
