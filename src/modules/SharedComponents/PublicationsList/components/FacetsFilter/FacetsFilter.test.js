import FacetsFilter from './FacetsFilter';
import { possibleUnclaimedList } from 'mock/data';
import { general } from 'config';

function setup(testProps, isShallow = true) {
    const props = {
        activeFacets: { filters: {}, ranges: {} } || testProps.activeFacets,
        facetsData: {} || testProps.facetsData,
        excludeFacetsList: [] || testProps.excludeFacetsList,
        onFacetsChanged: jest.fn() || testProps.onFacetsChanged,
        showOpenAccessFilter: false,
        ...testProps,
    };
    return getElement(FacetsFilter, props, isShallow);
}

describe('FacetsFilter ', () => {
    it('renders empty component for empty data', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state when component receives new props', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillReceiveProps({
            activeFacets: {
                filters: {
                    one: 'one',
                },
                ranges: {},
            },
        });
        expect(wrapper.instance().state.activeFacets).toEqual({
            filters: {
                one: 'one',
            },
            ranges: {},
        });
    });

    it('components for mock data', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({ facetsData: facetsData });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders filter for open access', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({ facetsData: facetsData, showOpenAccessFilter: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('components for mock data with excluded facets', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({ facetsData, excludeFacetsList: ['Display type'] });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('components for mock data with disabled flag set', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({ facetsData, disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.facetsCategory').forEach(item => {
            expect(item.props().disabled).toEqual(true);
        });
    });

    it('components for mock data with active facets set', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup(
            {
                facetsData,
                activeFacets: {
                    filters: {
                        'Display type': 179,
                    },
                    ranges: {},
                },
            },
            false
        );
        expect(toJson(wrapper)).toMatchSnapshot();
        const category = wrapper.find('FacetsFilterListItem#facet-category-Display-type');
        expect(category.length).toEqual(1);
        category.simulate('click');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('components for mock data deactivating a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({
            facetsData,
            activeFacets: {
                showOpenAccessOnly: true,
                filters: {
                    'Display type': 179,
                },
                ranges: {},
            },
        });

        wrapper.instance()._handleFacetClick('Display type', 130)();
        wrapper.update();
        expect(wrapper.state().activeFacets.filters).toEqual({ 'Display type': 130 });

        wrapper.instance()._handleFacetClick('Display type', 130)();
        wrapper.update();
        expect(wrapper.state().activeFacets.filters).toEqual({});

        wrapper.instance()._handleOpenAccessFilter(false);
        wrapper.update();
        expect(wrapper.state().activeFacets.showOpenAccessOnly).toEqual(false);
    });

    it('components for mock data activating a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({
            facetsData,
            activeFacets: {
                filters: {
                    'Display type': 179,
                },
                ranges: {},
            },
        });

        wrapper.instance()._handleFacetClick('Keywords', 'Biochemistry')();
        wrapper.update();

        expect(wrapper.state().activeFacets.filters).toEqual({
            'Display type': 179,
            Keywords: 'Biochemistry',
        });
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._handleOpenAccessFilter(true);
        wrapper.update();
        expect(wrapper.state().activeFacets.showOpenAccessOnly).toEqual(true);
    });

    it('components for mock data resetting a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({
            facetsData,
            activeFacets: {
                filters: {
                    'Display type': 179,
                },
                ranges: {},
            },
        });

        wrapper.instance()._handleResetClick();
        wrapper.update();

        expect(wrapper.state().activeFacets).toEqual({
            filters: {},
            ranges: {},
        });
    });

    it('components for mock data', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        facetsData['Display type'].buckets.push({ key: 174, doc_count: 4 });
        facetsData['Display type (lookup)'].buckets.push({ key: 'Book Chapter', doc_count: 4 });

        const wrapper = setup({ facetsData });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    const mockFacetsData = {
        'Scopus document type': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
                {
                    key: 'ar',
                    doc_count: 68,
                },
                {
                    key: 're',
                    doc_count: 4,
                },
                {
                    key: 'ch',
                    doc_count: 1,
                },
                {
                    key: 'le',
                    doc_count: 1,
                },
            ],
        },
        'Display type': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
                {
                    key: 179,
                    doc_count: 110,
                },
                {
                    key: 130,
                    doc_count: 32,
                },
                {
                    key: 174,
                    doc_count: 3,
                },
                {
                    key: 177,
                    doc_count: 1,
                },
                {
                    key: 202,
                    doc_count: 1,
                },
            ],
        },
        Keywords: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 556,
            buckets: [
                {
                    key: 'Brca1',
                    doc_count: 15,
                },
                {
                    key: 'Breast cancer',
                    doc_count: 14,
                },
                {
                    key: 'Gene',
                    doc_count: 9,
                },
                {
                    key: 'Cells',
                    doc_count: 7,
                },
                {
                    key: 'Mutations',
                    doc_count: 7,
                },
            ],
        },
        'Scopus document type (lookup)': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
                {
                    key: 'Article',
                    doc_count: 68,
                },
                {
                    key: 'Review',
                    doc_count: 4,
                },
                {
                    key: 'Letter',
                    doc_count: 1,
                },
                {
                    key: 'false',
                    doc_count: 1,
                },
            ],
        },
        'Subject (lookup)': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 103,
            buckets: [
                {
                    key: 'C1',
                    doc_count: 23,
                },
                {
                    key: 'EX',
                    doc_count: 16,
                },
                {
                    key: '730108 Cancer and related disorders',
                    doc_count: 15,
                },
                {
                    key: '1112 Oncology and Carcinogenesis',
                    doc_count: 12,
                },
                {
                    key: '270201 Gene Expression',
                    doc_count: 9,
                },
            ],
        },
        'Collection (lookup)': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 126,
            buckets: [
                {
                    key: 'School of Chemistry and Molecular Biosciences',
                    doc_count: 84,
                },
                {
                    key: 'Excellence in Research Australia (ERA) - Collection',
                    doc_count: 46,
                },
                {
                    key: 'School of Medicine Publications',
                    doc_count: 30,
                },
                {
                    key: 'ResearcherID Downloads',
                    doc_count: 22,
                },
                {
                    key: 'Unprocessed Records',
                    doc_count: 20,
                },
            ],
        },
        'Year published': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 88,
            buckets: [
                {
                    key: '2005',
                    doc_count: 13,
                },
                {
                    key: '2007',
                    doc_count: 13,
                },
                {
                    key: '2008',
                    doc_count: 12,
                },
                {
                    key: '2012',
                    doc_count: 11,
                },
                {
                    key: '2000',
                    doc_count: 10,
                },
            ],
        },
        'Author (lookup)': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 395,
            buckets: [
                {
                    key: 'Brown, Melissa Anne',
                    doc_count: 147,
                },
                {
                    key: 'French, Juliet D.',
                    doc_count: 36,
                },
                {
                    key: 'Spurdle, Amanda B.',
                    doc_count: 30,
                },
                {
                    key: 'Chanel Smart',
                    doc_count: 24,
                },
                {
                    key: 'Chenevix-Trench, Georgia',
                    doc_count: 24,
                },
            ],
        },
        Subject: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 103,
            buckets: [
                {
                    key: 450009,
                    doc_count: 23,
                },
                {
                    key: 450018,
                    doc_count: 16,
                },
                {
                    key: 450520,
                    doc_count: 15,
                },
                {
                    key: 452615,
                    doc_count: 12,
                },
                {
                    key: 270201,
                    doc_count: 9,
                },
            ],
        },
        'Journal name': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 85,
            buckets: [
                {
                    key: 'Human Mutation',
                    doc_count: 7,
                },
                {
                    key: 'Human Molecular Genetics',
                    doc_count: 6,
                },
                {
                    key: 'Oncogene',
                    doc_count: 5,
                },
                {
                    key: 'test',
                    doc_count: 5,
                },
                {
                    key: 'Breast Cancer Research',
                    doc_count: 4,
                },
            ],
        },
        Collection: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 126,
            buckets: [
                {
                    key: 'UQ:3825',
                    doc_count: 84,
                },
                {
                    key: 'UQ:152266',
                    doc_count: 46,
                },
                {
                    key: 'UQ:3831',
                    doc_count: 30,
                },
                {
                    key: 'UQ:183940',
                    doc_count: 22,
                },
                {
                    key: 'UQ:218198',
                    doc_count: 20,
                },
            ],
        },
        Author: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 395,
            buckets: [
                {
                    key: 1671,
                    doc_count: 147,
                },
                {
                    key: 950,
                    doc_count: 36,
                },
                {
                    key: 2463,
                    doc_count: 30,
                },
                {
                    key: 1605,
                    doc_count: 24,
                },
                {
                    key: 3247,
                    doc_count: 24,
                },
            ],
        },
        Genre: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
                {
                    key: 'Article (original research)',
                    doc_count: 6,
                },
            ],
        },
        Subtype: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 14,
            buckets: [
                {
                    key: 'Article (original research)',
                    doc_count: 88,
                },
                {
                    key: 'Critical review of research, literature review, critical commentary',
                    doc_count: 10,
                },
                {
                    key: 'Other',
                    doc_count: 6,
                },
                {
                    key: 'Poster',
                    doc_count: 6,
                },
                {
                    key: 'Creative work',
                    doc_count: 4,
                },
            ],
        },
        'Display type (lookup)': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [
                {
                    key: 'Journal Article',
                    doc_count: 110,
                },
                {
                    key: 'Conference Paper',
                    doc_count: 32,
                },
                {
                    key: 'Book',
                    doc_count: 3,
                },
                {
                    key: 'Book Chapter',
                    doc_count: 1,
                },
                {
                    key: 'Generic Document',
                    doc_count: 1,
                },
            ],
        },
    };

    it('getFacetsToDisplay returns facets correctly without any exclusions or renaming', () => {
        const excludeFacetsList = [];
        const renameFacetsList = {};
        const lookupFacetsList = {};
        const wrapper = setup({});
        expect(
            wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)
        ).toMatchSnapshot();
    });

    it('getFacetsToDisplay returns empty when no facets supplied ', () => {
        const excludeFacetsList = [];
        const renameFacetsList = {};
        const result = [];
        const wrapper = setup({});
        expect(wrapper.instance().getFacetsToDisplay({}, excludeFacetsList, renameFacetsList)).toEqual(result);
    });

    it('getFacetsToDisplay returns facets correctly with an exclusion but no renaming', () => {
        const excludeFacetsList = ['Scopus document type', 'Subtype', 'Year published'];
        const renameFacetsList = {};
        const lookupFacetsList = {};

        const wrapper = setup({});
        expect(
            wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)
        ).toMatchSnapshot();
    });

    it('getFacetsToDisplay returns facets correctly without an exclusion but has renaming', () => {
        const excludeFacetsList = [];
        const renameFacetsList = { 'Display type': 'Work type' };
        const lookupFacetsList = {};
        const wrapper = setup({});
        expect(
            wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)
        ).toMatchSnapshot();
    });

    it('getFacetsToDisplay returns facets correctly with an exclusion and renaming', () => {
        const excludeFacetsList = ['Scopus document type', 'Subtype', 'Year published'];
        const renameFacetsList = { 'Display type': 'Work type' };
        const lookupFacetsList = {};
        const wrapper = setup({});
        expect(
            wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)
        ).toMatchSnapshot();
    });

    it('getNestedListItems returns list of facets correctly for a given category', () => {
        const facetsCategory = {
            title: 'Work type',
            facets: [
                { title: 'Journal Article', key: 179, count: 110 },
                { title: 'Conference Paper', key: 130, count: 32 },
                { title: 'Book', key: 174, count: 3 },
                { title: 'Book Chapter', key: 177, count: 1 },
                { title: 'Generic Document', key: 202, count: 1 },
            ],
        };
        const wrapper = setup({});
        expect(toJson(wrapper.instance().getNestedListItems(facetsCategory))).toMatchSnapshot();
    });

    it(
        'getNestedListItems returns list of facets correctly for categories where ' +
            'item.key is expected to be an integer but supplied in the string form',
        () => {
            const facetsCategory = {
                facetTitle: 'Display type',
                facets: [
                    { title: 'Journal Article', key: 179, count: 110 },
                    { title: 'Conference Paper', key: 130, count: 32 },
                    { title: 'Book', key: 174, count: 3 },
                    { title: 'Book Chapter', key: 177, count: 1 },
                    { title: 'Generic Document', key: 202, count: 1 },
                ],
            };
            const wrapper = setup({
                activeFacets: {
                    filters: { 'Display type': '179' },
                    ranges: {},
                },
            });
            expect(toJson(wrapper.instance().getNestedListItems(facetsCategory))).toMatchSnapshot();
        }
    );

    it('_handleResetClick returns empty state for activeFacets', () => {
        const wrapper = setup({});
        wrapper.setState({
            hasActiveFilters: true,
            activeFacets: {
                ranges: {
                    'Year published': {
                        from: 2010,
                        to: 2015,
                    },
                },
                filters: {
                    Keywords: 'Cells',
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance()._handleResetClick();
        expect(wrapper.state().activeFacets).toEqual({ filters: {}, ranges: {} });
    });

    it('_handleResetClick sets state to filter by display type if on "My DataSet" page', () => {
        const wrapper = setup({
            initialFacets: {
                filters: {
                    'Display type': general.PUBLICATION_TYPE_DATA_COLLECTION,
                },
            },
        });
        wrapper.setState({
            activeFacets: {
                ranges: {
                    'Year published': {
                        from: 2010,
                        to: 2015,
                    },
                },
                filters: {
                    Keywords: 'Cells',
                },
            },
        });
        wrapper.instance()._handleResetClick();
        expect(wrapper.state().activeFacets).toEqual({
            filters: {
                'Display type': general.PUBLICATION_TYPE_DATA_COLLECTION,
            },
            ranges: {},
        });
    });

    it('_handleFacetClick returns correct state object for active facets', () => {
        const wrapper = setup({});
        wrapper.setState({ activeFacets: { filters: {}, ranges: {} } });
        wrapper.instance()._handleFacetClick('Category1', 'Facet1')();
        wrapper.instance()._handleFacetClick('Category2', 'Facet2')();
        wrapper.instance()._handleFacetClick('Category3', 'Facet3')();
        expect(wrapper.state().activeFacets).toEqual({
            filters: {
                Category1: 'Facet1',
                Category2: 'Facet2',
                Category3: 'Facet3',
            },
            ranges: {},
            showOpenAccessOnly: false,
        });
    });

    it('_handleFacetClick returns empty state object when a facet is clicked while disabled', () => {
        const wrapper = setup({ disabled: true });
        wrapper.instance()._handleFacetClick('Category1', 'Facet1')();
        wrapper.instance()._handleFacetClick('Category2', 'Facet2')();
        wrapper.instance()._handleFacetClick('Category3', 'Facet3')();
        wrapper.instance()._handleOpenAccessFilter(true);
        expect(wrapper.state().activeFacets).toEqual({ filters: {}, ranges: {} });
    });

    it('should set ranges values if _handleYearPublishedRangeFacet is called', () => {
        const wrapper = setup({});
        wrapper.instance()._handleYearPublishedRangeFacet('Year')({ from: 2000, to: 2010 });
        expect(wrapper.state().activeFacets).toEqual({
            filters: {},
            ranges: {
                Year: {
                    from: 2000,
                    to: 2010,
                },
            },
            showOpenAccessOnly: false,
        });

        wrapper.instance()._handleYearPublishedRangeFacet('Year')({ from: null, to: null });
        expect(wrapper.state().activeFacets).toEqual({
            filters: {},
            ranges: {},
            showOpenAccessOnly: false,
        });
    });

    it('should set ranges values if _handleYearPublishedRangeFacet is called', () => {
        const wrapper = setup({ disabled: true });
        wrapper.instance()._handleYearPublishedRangeFacet('Year')({ from: 2000, to: 2010 });
        expect(wrapper.state().activeFacets).toEqual({ filters: {}, ranges: {} });
    });

    it('should return false if facet is not in activeFacets', () => {
        const activeFacets = {
            filters: {},
            ranges: {},
        };

        const wrapper = setup({});
        expect(wrapper.instance().isFacetFilterActive(activeFacets, 'Display type', 134)).toBeFalsy();
    });

    it('should return true if Display type is set in activeFacets as an integer value', () => {
        const activeFacets = {
            filters: {
                'Display type': 134,
            },
            ranges: {},
        };

        const wrapper = setup({});
        expect(wrapper.instance().isFacetFilterActive(activeFacets, 'Display type', 134)).toBeTruthy();
    });

    it('should return true if Display type is set in activeFacets as a string value', () => {
        const activeFacets = {
            filters: {
                'Display type': '134',
            },
            ranges: {},
        };

        const wrapper = setup({});
        expect(wrapper.instance().isFacetFilterActive(activeFacets, 'Display type', 134)).toBeTruthy();
    });

    it('should return true if Display type is set in activeFacets as a string value and value passed is string', () => {
        const activeFacets = {
            filters: {
                'Display type': 'test',
            },
            ranges: {},
        };

        const wrapper = setup({});
        expect(wrapper.instance().isFacetFilterActive(activeFacets, 'Display type', '134')).toBeFalsy();
    });

    it('renders lookup facets', () => {
        const testProps = {
            facetsData: possibleUnclaimedList.filters.facets,
            showOpenAccessFilter: true,
            lookupFacetsList: {
                Author: 'Author (lookup)',
                Collection: 'Collection (lookup)',
                Subject: 'Subject (lookup)',
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
