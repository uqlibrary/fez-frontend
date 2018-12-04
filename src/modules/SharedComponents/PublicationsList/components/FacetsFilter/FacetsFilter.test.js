import FacetsFilter from './FacetsFilter';
import {possibleUnclaimedList} from 'mock/data';

function setup(testProps, isShallow = true) {
    const props = {
        activeFacets: {filters: {}, ranges: {}} || testProps.activeFacets,
        facetsData: {} || testProps.facetsData,
        excludeFacetsList: [] || testProps.excludeFacetsList,
        onFacetsChanged: jest.fn() || testProps.onFacetsChanged,
        showOpenAccessFilter: false,
        ...testProps
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
        wrapper.instance().componentWillReceiveProps({activeFacets: {filters: {one: 'one'}, ranges: {}}});
        expect(wrapper.instance().state.activeFacets).toEqual({filters: {one: 'one'}, ranges: {}});
    });

    it('components for mock data', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData: facetsData});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders filter for open access', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData: facetsData, showOpenAccessFilter:true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('components for mock data with excluded facets', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, excludeFacetsList: ['Display type']});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('components for mock data with disabled flag set', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, disabled: true});
        expect(toJson(wrapper)).toMatchSnapshot();

        const categories = wrapper.find('.facetsCategory');
        wrapper.find('.facetsCategory').forEach(item => {
            expect(item.props().disabled).toEqual(true);
        })
    });

    it('components for mock data with active facets set', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {filters: {'Display type': 179}, ranges: {}}}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        const category = wrapper.find('FacetsFilterListItem#facet-category-Display-type');
        expect(category.length).toEqual(1);
        category.simulate('click');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('components for mock data deactivating a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {showOpenAccessOnly: true, filters: {'Display type': 179}, ranges: {}}});

        wrapper.instance()._handleFacetClick('Display type', 130)();
        wrapper.update();
        expect(JSON.stringify(wrapper.state().activeFacets.filters)).toEqual(JSON.stringify({'Display type': 130}));

        wrapper.instance()._handleFacetClick('Display type', 130)();
        wrapper.update();
        expect(JSON.stringify(wrapper.state().activeFacets.filters)).toEqual(JSON.stringify({}));

        wrapper.instance()._handleOpenAccessFilter(false);
        wrapper.update();
        expect(wrapper.state().activeFacets.showOpenAccessOnly).toEqual(false);
    });

    it('components for mock data activating a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {filters: {'Display type': 179}, ranges: {}}});

        wrapper.instance()._handleFacetClick('Keywords', 'Biochemistry')();
        wrapper.update();

        expect(JSON.stringify(wrapper.state().activeFacets.filters)).toEqual(JSON.stringify({'Display type': 179, 'Keywords': 'Biochemistry'}));
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._handleOpenAccessFilter(true);
        wrapper.update();
        expect(wrapper.state().activeFacets.showOpenAccessOnly).toEqual(true);
    });

    it('components for mock data resetting a facet selection', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        const wrapper = setup({facetsData, activeFacets: {filters: {'Display type': 179}, ranges: {}}});

        wrapper.instance()._handleResetClick();
        wrapper.update();

        expect(JSON.stringify(wrapper.state().activeFacets)).toEqual(JSON.stringify({filters: {}, ranges: {}}));
    });

    it('components for mock data', () => {
        const facetsData = possibleUnclaimedList.filters.facets;
        facetsData['Display type'].buckets.push({'key': 174, 'doc_count': 4});
        facetsData['Display type (lookup)'].buckets.push({'key': 'Book Chapter', 'doc_count': 4});

        const wrapper = setup({facetsData});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    const mockFacetsData = {
        "Scopus document type": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": "ar",
                    "doc_count": 68
                },
                {
                    "key": "re",
                    "doc_count": 4
                },
                {
                    "key": "ch",
                    "doc_count": 1
                },
                {
                    "key": "le",
                    "doc_count": 1
                }
            ]
        },
        "Display type": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": 179,
                    "doc_count": 110
                },
                {
                    "key": 130,
                    "doc_count": 32
                },
                {
                    "key": 174,
                    "doc_count": 3
                },
                {
                    "key": 177,
                    "doc_count": 1
                },
                {
                    "key": 202,
                    "doc_count": 1
                }
            ]
        },
        "Keywords": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 556,
            "buckets": [
                {
                    "key": "Brca1",
                    "doc_count": 15
                },
                {
                    "key": "Breast cancer",
                    "doc_count": 14
                },
                {
                    "key": "Gene",
                    "doc_count": 9
                },
                {
                    "key": "Cells",
                    "doc_count": 7
                },
                {
                    "key": "Mutations",
                    "doc_count": 7
                }
            ]
        },
        "Scopus document type (lookup)": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": "Article",
                    "doc_count": 68
                },
                {
                    "key": "Review",
                    "doc_count": 4
                },
                {
                    "key": "Letter",
                    "doc_count": 1
                },
                {
                    "key": "false",
                    "doc_count": 1
                }
            ]
        },
        "Subject (lookup)": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 103,
            "buckets": [
                {
                    "key": "C1",
                    "doc_count": 23
                },
                {
                    "key": "EX",
                    "doc_count": 16
                },
                {
                    "key": "730108 Cancer and related disorders",
                    "doc_count": 15
                },
                {
                    "key": "1112 Oncology and Carcinogenesis",
                    "doc_count": 12
                },
                {
                    "key": "270201 Gene Expression",
                    "doc_count": 9
                }
            ]
        },
        "Collection (lookup)": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 126,
            "buckets": [
                {
                    "key": "School of Chemistry and Molecular Biosciences",
                    "doc_count": 84
                },
                {
                    "key": "Excellence in Research Australia (ERA) - Collection",
                    "doc_count": 46
                },
                {
                    "key": "School of Medicine Publications",
                    "doc_count": 30
                },
                {
                    "key": "ResearcherID Downloads",
                    "doc_count": 22
                },
                {
                    "key": "Unprocessed Records",
                    "doc_count": 20
                }
            ]
        },
        "Year published": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 88,
            "buckets": [
                {
                    "key": "2005",
                    "doc_count": 13
                },
                {
                    "key": "2007",
                    "doc_count": 13
                },
                {
                    "key": "2008",
                    "doc_count": 12
                },
                {
                    "key": "2012",
                    "doc_count": 11
                },
                {
                    "key": "2000",
                    "doc_count": 10
                }
            ]
        },
        "Author (lookup)": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 395,
            "buckets": [
                {
                    "key": "Brown, Melissa Anne",
                    "doc_count": 147
                },
                {
                    "key": "French, Juliet D.",
                    "doc_count": 36
                },
                {
                    "key": "Spurdle, Amanda B.",
                    "doc_count": 30
                },
                {
                    "key": "Chanel Smart",
                    "doc_count": 24
                },
                {
                    "key": "Chenevix-Trench, Georgia",
                    "doc_count": 24
                }
            ]
        },
        "Subject": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 103,
            "buckets": [
                {
                    "key": 450009,
                    "doc_count": 23
                },
                {
                    "key": 450018,
                    "doc_count": 16
                },
                {
                    "key": 450520,
                    "doc_count": 15
                },
                {
                    "key": 452615,
                    "doc_count": 12
                },
                {
                    "key": 270201,
                    "doc_count": 9
                }
            ]
        },
        "Journal name": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 85,
            "buckets": [
                {
                    "key": "Human Mutation",
                    "doc_count": 7
                },
                {
                    "key": "Human Molecular Genetics",
                    "doc_count": 6
                },
                {
                    "key": "Oncogene",
                    "doc_count": 5
                },
                {
                    "key": "test",
                    "doc_count": 5
                },
                {
                    "key": "Breast Cancer Research",
                    "doc_count": 4
                }
            ]
        },
        "Collection": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 126,
            "buckets": [
                {
                    "key": "UQ:3825",
                    "doc_count": 84
                },
                {
                    "key": "UQ:152266",
                    "doc_count": 46
                },
                {
                    "key": "UQ:3831",
                    "doc_count": 30
                },
                {
                    "key": "UQ:183940",
                    "doc_count": 22
                },
                {
                    "key": "UQ:218198",
                    "doc_count": 20
                }
            ]
        },
        "Author": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 395,
            "buckets": [
                {
                    "key": 1671,
                    "doc_count": 147
                },
                {
                    "key": 950,
                    "doc_count": 36
                },
                {
                    "key": 2463,
                    "doc_count": 30
                },
                {
                    "key": 1605,
                    "doc_count": 24
                },
                {
                    "key": 3247,
                    "doc_count": 24
                }
            ]
        },
        "Genre": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": "Article (original research)",
                    "doc_count": 6
                }
            ]
        },
        "Subtype": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 14,
            "buckets": [
                {
                    "key": "Article (original research)",
                    "doc_count": 88
                },
                {
                    "key": "Critical review of research, literature review, critical commentary",
                    "doc_count": 10
                },
                {
                    "key": "Other",
                    "doc_count": 6
                },
                {
                    "key": "Poster",
                    "doc_count": 6
                },
                {
                    "key": "Creative work",
                    "doc_count": 4
                }
            ]
        },
        "Display type (lookup)": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": "Journal Article",
                    "doc_count": 110
                },
                {
                    "key": "Conference Paper",
                    "doc_count": 32
                },
                {
                    "key": "Book",
                    "doc_count": 3
                },
                {
                    "key": "Book Chapter",
                    "doc_count": 1
                },
                {
                    "key": "Generic Document",
                    "doc_count": 1
                }
            ]
        }
    };

    it('getFacetsToDisplay returns facets correctly without any exclusions or renaming', () => {

        const excludeFacetsList = [];
        const renameFacetsList = {};
        const lookupFacetsList = {};
        const result = [{"facetTitle": "Scopus document type", "facets": [{"count": 68, "key": "ar", "title": "Article"}, {"count": 4, "key": "re", "title": "Review"}, {"count": 1, "key": "ch", "title": "Letter"}, {"count": 1, "key": "le", "title": "false"}], "title": "Scopus document type"}, {"facetTitle": "Display type", "facets": [{"count": 110, "key": 179, "title": "Journal Article"}, {"count": 32, "key": 130, "title": "Conference Paper"}, {"count": 3, "key": 174, "title": "Book"}, {"count": 1, "key": 177, "title": "Book Chapter"}, {"count": 1, "key": 202, "title": "Generic Document"}], "title": "Display type"}, {"facetTitle": "Keywords", "facets": [{"count": 15, "key": "Brca1", "title": "Brca1"}, {"count": 14, "key": "Breast cancer", "title": "Breast cancer"}, {"count": 9, "key": "Gene", "title": "Gene"}, {"count": 7, "key": "Cells", "title": "Cells"}, {"count": 7, "key": "Mutations", "title": "Mutations"}], "title": "Keywords"}, {"facetTitle": "Year published", "facets": [{"count": 13, "key": "2005", "title": "2005"}, {"count": 13, "key": "2007", "title": "2007"}, {"count": 12, "key": "2008", "title": "2008"}, {"count": 11, "key": "2012", "title": "2012"}, {"count": 10, "key": "2000", "title": "2000"}], "title": "Year published"}, {"facetTitle": "Subject", "facets": [{"count": 23, "key": 450009, "title": "C1"}, {"count": 16, "key": 450018, "title": "EX"}, {"count": 15, "key": 450520, "title": "730108 Cancer and related disorders"}, {"count": 12, "key": 452615, "title": "1112 Oncology and Carcinogenesis"}, {"count": 9, "key": 270201, "title": "270201 Gene Expression"}], "title": "Subject"}, {"facetTitle": "Journal name", "facets": [{"count": 7, "key": "Human Mutation", "title": "Human Mutation"}, {"count": 6, "key": "Human Molecular Genetics", "title": "Human Molecular Genetics"}, {"count": 5, "key": "Oncogene", "title": "Oncogene"}, {"count": 5, "key": "test", "title": "test"}, {"count": 4, "key": "Breast Cancer Research", "title": "Breast Cancer Research"}], "title": "Journal name"}, {"facetTitle": "Collection", "facets": [{"count": 84, "key": "UQ:3825", "title": "School of Chemistry and Molecular Biosciences"}, {"count": 46, "key": "UQ:152266", "title": "Excellence in Research Australia (ERA) - Collection"}, {"count": 30, "key": "UQ:3831", "title": "School of Medicine Publications"}, {"count": 22, "key": "UQ:183940", "title": "ResearcherID Downloads"}, {"count": 20, "key": "UQ:218198", "title": "Unprocessed Records"}], "title": "Collection"}, {"facetTitle": "Author", "facets": [{"count": 147, "key": 1671, "title": "Brown, Melissa Anne"}, {"count": 36, "key": 950, "title": "French, Juliet D."}, {"count": 30, "key": 2463, "title": "Spurdle, Amanda B."}, {"count": 24, "key": 1605, "title": "Chanel Smart"}, {"count": 24, "key": 3247, "title": "Chenevix-Trench, Georgia"}], "title": "Author"}, {"facetTitle": "Genre", "facets": [{"count": 6, "key": "Article (original research)", "title": "Article (original research)"}], "title": "Genre"}, {"facetTitle": "Subtype", "facets": [{"count": 88, "key": "Article (original research)", "title": "Article (original research)"}, {"count": 10, "key": "Critical review of research, literature review, critical commentary", "title": "Critical review of research, literature review, critical commentary"}, {"count": 6, "key": "Other", "title": "Other"}, {"count": 6, "key": "Poster", "title": "Poster"}, {"count": 4, "key": "Creative work", "title": "Creative work"}], "title": "Subtype"}];
        const wrapper = setup({});
        expect(wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)).toEqual(result);
    });

    it('getFacetsToDisplay returns empty when no facets supplied ', () => {
        const excludeFacetsList = [];
        const renameFacetsList = {};
        const result = [];
        const wrapper = setup({});
        expect(wrapper.instance().getFacetsToDisplay({}, excludeFacetsList,renameFacetsList)).toEqual(result);
    });

    it('getFacetsToDisplay returns facets correctly with an exclusion but no renaming', () => {

        const excludeFacetsList = ["Scopus document type","Subtype","Year published"];
        const renameFacetsList = {};
        const lookupFacetsList = {};
        const result = [{"facetTitle": "Display type", "facets": [{"count": 110, "key": 179, "title": "Journal Article"}, {"count": 32, "key": 130, "title": "Conference Paper"}, {"count": 3, "key": 174, "title": "Book"}, {"count": 1, "key": 177, "title": "Book Chapter"}, {"count": 1, "key": 202, "title": "Generic Document"}], "title": "Display type"}, {"facetTitle": "Keywords", "facets": [{"count": 15, "key": "Brca1", "title": "Brca1"}, {"count": 14, "key": "Breast cancer", "title": "Breast cancer"}, {"count": 9, "key": "Gene", "title": "Gene"}, {"count": 7, "key": "Cells", "title": "Cells"}, {"count": 7, "key": "Mutations", "title": "Mutations"}], "title": "Keywords"}, {"facetTitle": "Subject", "facets": [{"count": 23, "key": 450009, "title": "C1"}, {"count": 16, "key": 450018, "title": "EX"}, {"count": 15, "key": 450520, "title": "730108 Cancer and related disorders"}, {"count": 12, "key": 452615, "title": "1112 Oncology and Carcinogenesis"}, {"count": 9, "key": 270201, "title": "270201 Gene Expression"}], "title": "Subject"}, {"facetTitle": "Journal name", "facets": [{"count": 7, "key": "Human Mutation", "title": "Human Mutation"}, {"count": 6, "key": "Human Molecular Genetics", "title": "Human Molecular Genetics"}, {"count": 5, "key": "Oncogene", "title": "Oncogene"}, {"count": 5, "key": "test", "title": "test"}, {"count": 4, "key": "Breast Cancer Research", "title": "Breast Cancer Research"}], "title": "Journal name"}, {"facetTitle": "Collection", "facets": [{"count": 84, "key": "UQ:3825", "title": "School of Chemistry and Molecular Biosciences"}, {"count": 46, "key": "UQ:152266", "title": "Excellence in Research Australia (ERA) - Collection"}, {"count": 30, "key": "UQ:3831", "title": "School of Medicine Publications"}, {"count": 22, "key": "UQ:183940", "title": "ResearcherID Downloads"}, {"count": 20, "key": "UQ:218198", "title": "Unprocessed Records"}], "title": "Collection"}, {"facetTitle": "Author", "facets": [{"count": 147, "key": 1671, "title": "Brown, Melissa Anne"}, {"count": 36, "key": 950, "title": "French, Juliet D."}, {"count": 30, "key": 2463, "title": "Spurdle, Amanda B."}, {"count": 24, "key": 1605, "title": "Chanel Smart"}, {"count": 24, "key": 3247, "title": "Chenevix-Trench, Georgia"}], "title": "Author"}, {"facetTitle": "Genre", "facets": [{"count": 6, "key": "Article (original research)", "title": "Article (original research)"}], "title": "Genre"}];

        const wrapper = setup({});
        expect(wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)).toEqual(result);
    });

    it('getFacetsToDisplay returns facets correctly without an exclusion but has renaming', () => {

        const excludeFacetsList = [];
        const renameFacetsList = {"Display type":"Work type"};
        const lookupFacetsList = {};
        const result = [{"facetTitle": "Scopus document type", "facets": [{"count": 68, "key": "ar", "title": "Article"}, {"count": 4, "key": "re", "title": "Review"}, {"count": 1, "key": "ch", "title": "Letter"}, {"count": 1, "key": "le", "title": "false"}], "title": "Scopus document type"}, {"facetTitle": "Display type", "facets": [{"count": 110, "key": 179, "title": "Journal Article"}, {"count": 32, "key": 130, "title": "Conference Paper"}, {"count": 3, "key": 174, "title": "Book"}, {"count": 1, "key": 177, "title": "Book Chapter"}, {"count": 1, "key": 202, "title": "Generic Document"}], "title": "Work type"}, {"facetTitle": "Keywords", "facets": [{"count": 15, "key": "Brca1", "title": "Brca1"}, {"count": 14, "key": "Breast cancer", "title": "Breast cancer"}, {"count": 9, "key": "Gene", "title": "Gene"}, {"count": 7, "key": "Cells", "title": "Cells"}, {"count": 7, "key": "Mutations", "title": "Mutations"}], "title": "Keywords"},{"facetTitle": "Year published", "facets": [{"count": 13, "key": "2005", "title": "2005"}, {"count": 13, "key": "2007", "title": "2007"}, {"count": 12, "key": "2008", "title": "2008"}, {"count": 11, "key": "2012", "title": "2012"}, {"count": 10, "key": "2000", "title": "2000"}], "title": "Year published"}, {"facetTitle": "Subject", "facets": [{"count": 23, "key": 450009, "title": "C1"}, {"count": 16, "key": 450018, "title": "EX"}, {"count": 15, "key": 450520, "title": "730108 Cancer and related disorders"}, {"count": 12, "key": 452615, "title": "1112 Oncology and Carcinogenesis"}, {"count": 9, "key": 270201, "title": "270201 Gene Expression"}], "title": "Subject"}, {"facetTitle": "Journal name", "facets": [{"count": 7, "key": "Human Mutation", "title": "Human Mutation"}, {"count": 6, "key": "Human Molecular Genetics", "title": "Human Molecular Genetics"}, {"count": 5, "key": "Oncogene", "title": "Oncogene"}, {"count": 5, "key": "test", "title": "test"}, {"count": 4, "key": "Breast Cancer Research", "title": "Breast Cancer Research"}], "title": "Journal name"}, {"facetTitle": "Collection", "facets": [{"count": 84, "key": "UQ:3825", "title": "School of Chemistry and Molecular Biosciences"}, {"count": 46, "key": "UQ:152266", "title": "Excellence in Research Australia (ERA) - Collection"}, {"count": 30, "key": "UQ:3831", "title": "School of Medicine Publications"}, {"count": 22, "key": "UQ:183940", "title": "ResearcherID Downloads"}, {"count": 20, "key": "UQ:218198", "title": "Unprocessed Records"}], "title": "Collection"}, {"facetTitle": "Author", "facets": [{"count": 147, "key": 1671, "title": "Brown, Melissa Anne"}, {"count": 36, "key": 950, "title": "French, Juliet D."}, {"count": 30, "key": 2463, "title": "Spurdle, Amanda B."}, {"count": 24, "key": 1605, "title": "Chanel Smart"}, {"count": 24, "key": 3247, "title": "Chenevix-Trench, Georgia"}], "title": "Author"}, {"facetTitle": "Genre", "facets": [{"count": 6, "key": "Article (original research)", "title": "Article (original research)"}], "title": "Genre"}, {"facetTitle": "Subtype", "facets": [{"count": 88, "key": "Article (original research)", "title": "Article (original research)"}, {"count": 10, "key": "Critical review of research, literature review, critical commentary", "title": "Critical review of research, literature review, critical commentary"}, {"count": 6, "key": "Other", "title": "Other"}, {"count": 6, "key": "Poster", "title": "Poster"}, {"count": 4, "key": "Creative work", "title": "Creative work"}], "title": "Subtype"}];

        const wrapper = setup({});
        expect(wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)).toEqual(result);
    });

    it('getFacetsToDisplay returns facets correctly with an exclusion and renaming', () => {

        const excludeFacetsList = ["Scopus document type","Subtype","Year published"];
        const renameFacetsList = {"Display type":"Work type"};
        const lookupFacetsList = {};
        const result = [{"facetTitle": "Display type", "facets": [{"count": 110, "key": 179, "title": "Journal Article"}, {"count": 32, "key": 130, "title": "Conference Paper"}, {"count": 3, "key": 174, "title": "Book"}, {"count": 1, "key": 177, "title": "Book Chapter"}, {"count": 1, "key": 202, "title": "Generic Document"}], "title": "Work type"}, {"facetTitle": "Keywords", "facets": [{"count": 15, "key": "Brca1", "title": "Brca1"}, {"count": 14, "key": "Breast cancer", "title": "Breast cancer"}, {"count": 9, "key": "Gene", "title": "Gene"}, {"count": 7, "key": "Cells", "title": "Cells"}, {"count": 7, "key": "Mutations", "title": "Mutations"}], "title": "Keywords"}, {"facetTitle": "Subject", "facets": [{"count": 23, "key": 450009, "title": "C1"}, {"count": 16, "key": 450018, "title": "EX"}, {"count": 15, "key": 450520, "title": "730108 Cancer and related disorders"}, {"count": 12, "key": 452615, "title": "1112 Oncology and Carcinogenesis"}, {"count": 9, "key": 270201, "title": "270201 Gene Expression"}], "title": "Subject"}, {"facetTitle": "Journal name", "facets": [{"count": 7, "key": "Human Mutation", "title": "Human Mutation"}, {"count": 6, "key": "Human Molecular Genetics", "title": "Human Molecular Genetics"}, {"count": 5, "key": "Oncogene", "title": "Oncogene"}, {"count": 5, "key": "test", "title": "test"}, {"count": 4, "key": "Breast Cancer Research", "title": "Breast Cancer Research"}], "title": "Journal name"}, {"facetTitle": "Collection", "facets": [{"count": 84, "key": "UQ:3825", "title": "School of Chemistry and Molecular Biosciences"}, {"count": 46, "key": "UQ:152266", "title": "Excellence in Research Australia (ERA) - Collection"}, {"count": 30, "key": "UQ:3831", "title": "School of Medicine Publications"}, {"count": 22, "key": "UQ:183940", "title": "ResearcherID Downloads"}, {"count": 20, "key": "UQ:218198", "title": "Unprocessed Records"}], "title": "Collection"}, {"facetTitle": "Author", "facets": [{"count": 147, "key": 1671, "title": "Brown, Melissa Anne"}, {"count": 36, "key": 950, "title": "French, Juliet D."}, {"count": 30, "key": 2463, "title": "Spurdle, Amanda B."}, {"count": 24, "key": 1605, "title": "Chanel Smart"}, {"count": 24, "key": 3247, "title": "Chenevix-Trench, Georgia"}], "title": "Author"}, {"facetTitle": "Genre", "facets": [{"count": 6, "key": "Article (original research)", "title": "Article (original research)"}], "title": "Genre"}];

        const wrapper = setup({});
        expect(wrapper.instance().getFacetsToDisplay(mockFacetsData, excludeFacetsList, renameFacetsList, lookupFacetsList)).toEqual(result);
    });

    it('getNestedListItems returns list of facets correctly for a given category', () => {

        const facetsCategory = {"title":"Work type","facets":[{"title":"Journal Article","key":179,"count":110},{"title":"Conference Paper","key":130,"count":32},{"title":"Book","key":174,"count":3},{"title":"Book Chapter","key":177,"count":1},{"title":"Generic Document","key":202,"count":1}]};
        const result = [{"key":"0","ref":null,"props":{"index":0,"isActive":false,"primaryText":"Journal Article (110)"},"_owner":null,"_store":{}},{"key":"1","ref":null,"props":{"index":1,"isActive":false,"primaryText":"Conference Paper (32)"},"_owner":null,"_store":{}},{"key":"2","ref":null,"props":{"index":2,"isActive":false,"primaryText":"Book (3)"},"_owner":null,"_store":{}},{"key":"3","ref":null,"props":{"index":3,"isActive":false,"primaryText":"Book Chapter (1)"},"_owner":null,"_store":{}},{"key":"4","ref":null,"props":{"index":4,"isActive":false,"primaryText":"Generic Document (1)"},"_owner":null,"_store":{}}];

        const wrapper = setup({});
        expect(JSON.stringify(wrapper.instance().getNestedListItems(facetsCategory))).toBe(JSON.stringify(result));
    });

    it('getNestedListItems returns list of facets correctly for categories where item.key is expected to be an integer but supplied in the string form', () => {
        const facetsCategory = {"facetTitle":"Display type","facets":[{"title":"Journal Article","key":179,"count":110},{"title":"Conference Paper","key":130,"count":32},{"title":"Book","key":174,"count":3},{"title":"Book Chapter","key":177,"count":1},{"title":"Generic Document","key":202,"count":1}]};
        const result = [{"key":"0","ref":null,"props":{"index":0,"isActive":true,"primaryText":"Journal Article (110)"},"_owner":null,"_store":{}},{"key":"1","ref":null,"props":{"index":1,"isActive":false,"primaryText":"Conference Paper (32)"},"_owner":null,"_store":{}},{"key":"2","ref":null,"props":{"index":2,"isActive":false,"primaryText":"Book (3)"},"_owner":null,"_store":{}},{"key":"3","ref":null,"props":{"index":3,"isActive":false,"primaryText":"Book Chapter (1)"},"_owner":null,"_store":{}},{"key":"4","ref":null,"props":{"index":4,"isActive":false,"primaryText":"Generic Document (1)"},"_owner":null,"_store":{}}];

        const wrapper = setup({activeFacets: {filters: {"Display type": "179"}, ranges: {}}});
        expect(JSON.stringify(wrapper.instance().getNestedListItems(facetsCategory))).toBe(JSON.stringify(result));
    });

    it('_handleResetClick returns empty state for activeFacets', () => {
        const wrapper = setup({});
        wrapper.setState({activeFacets:{ranges: {"Year published": {from: 2010, to: 2015}}, filters: {"Keywords":"Cells"}}});
        wrapper.instance()._handleResetClick();
        expect(wrapper.state().activeFacets).toEqual({filters: {}, ranges: {}});
    });

    it('_handleFacetClick returns correct state object for active facets', () => {
        const wrapper = setup({});
        wrapper.setState({activeFacets:{filters:{}, ranges:{}}});
        wrapper.instance()._handleFacetClick('Category1','Facet1')();
        wrapper.instance()._handleFacetClick('Category2','Facet2')();
        wrapper.instance()._handleFacetClick('Category3','Facet3')();
        expect(wrapper.state().activeFacets).toEqual({"filters": {"Category1": "Facet1", "Category2": "Facet2", "Category3": "Facet3"}, "ranges": {}, "showOpenAccessOnly": false});
    });

    it('_handleFacetClick returns empty state object when a facet is clicked while disabled', () => {
        const wrapper = setup({disabled: true});
        wrapper.instance()._handleFacetClick('Category1','Facet1')();
        wrapper.instance()._handleFacetClick('Category2','Facet2')();
        wrapper.instance()._handleFacetClick('Category3','Facet3')();
        wrapper.instance()._handleOpenAccessFilter(true);
        expect(wrapper.state().activeFacets).toEqual({filters: {}, ranges: {}});
    });

    it('should set ranges values if _handleYearPublishedRangeFacet is called', () => {
        const wrapper = setup({});
        wrapper.instance()._handleYearPublishedRangeFacet('Year')({from: 2000, to: 2010});
        expect(wrapper.state().activeFacets).toEqual({"filters": {}, "ranges": {"Year": {"from": 2000, "to": 2010}}, "showOpenAccessOnly": false});

        wrapper.instance()._handleYearPublishedRangeFacet('Year')({from: null, to: null});
        expect(wrapper.state().activeFacets).toEqual({filters: {}, ranges: {}, "showOpenAccessOnly": false});
    });

    it('should set ranges values if _handleYearPublishedRangeFacet is called', () => {
        const wrapper = setup({disabled: true});
        wrapper.instance()._handleYearPublishedRangeFacet('Year')({from: 2000, to: 2010});
        expect(wrapper.state().activeFacets).toEqual({filters: {}, ranges: {}});
    });

    it('should return false if facet is not in activeFacets', () => {
        const activeFacets = {
            filters: {},
            ranges: {}
        };

        const wrapper = setup({});
        expect(wrapper.instance().isFacetFilterActive(activeFacets, 'Display type', 134)).toBeFalsy();
    });

    it('should return true if Display type is set in activeFacets as an integer value', () => {
        const activeFacets = {
            filters: {
                'Display type': 134
            },
            ranges: {}
        };

        const wrapper = setup({});
        expect(wrapper.instance().isFacetFilterActive(activeFacets, 'Display type', 134)).toBeTruthy();
    });

    it('should return true if Display type is set in activeFacets as a string value', () => {
        const activeFacets = {
            filters: {
                'Display type': '134'
            },
            ranges: {}
        };

        const wrapper = setup({});
        expect(wrapper.instance().isFacetFilterActive(activeFacets, 'Display type', 134)).toBeTruthy();
    });
});
