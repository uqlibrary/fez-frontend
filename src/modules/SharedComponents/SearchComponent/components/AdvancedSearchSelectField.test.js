import {AdvancedSearchSelectField} from './AdvancedSearchSelectField';

function setup(testProps, isShallow = true) {
    const props = {
        loadSuggestions: jest.fn(),
        ...testProps
    };
    return getElement(AdvancedSearchSelectField, props, isShallow);
}

const props = {
    "type": "search",
    "name": "searchField0",
    "id": "searchField",
    "fullWidth": true,
    "value": ["UQ:120743"],
    "disabled": false,
    "hintText": "Select collections",
    "loadingHint": "Loading collections",
    "errorHint": "There has been an error loading collections",
    "multiple": true,
    "aria-label": "Select collections",
    "floatingLabelText": null,
    "itemsLoading": false,
    "itemsLoadingError": false,
    "async": true,
    "className": "advancedsearchselectfield menuitem",
    "itemsList": [
        {
            "text": "16th Australasian Fluid Mechanics Conference",
            "value": "UQ:120743",
            "index": 0
        }, {
            "text": "2004 Higher Education Research Data Collection",
            "value": "UQ:217410",
            "index": 1
        }, {
            "text": "2005 Higher Education Research Data Collection",
            "value": "UQ:217419",
            "index": 2
        }, {
            "text": "2006 Higher Education Research Data Collection",
            "value": "UQ:217422",
            "index": 3
        }, {
            "text": "2007 Higher Education Research Data Collection",
            "value": "UQ:217423",
            "index": 4
        }, {
            "text": "2008 Higher Education Research Data Collection",
            "value": "UQ:23835",
            "index": 5
        }, {
            "text": "2009 Higher Education Research Data Collection",
            "value": "UQ:138536",
            "index": 6
        }, {
            "text": "2010 Higher Education Research Data Collection",
            "value": "UQ:174061",
            "index": 7
        }, {
            "text": "2012 University of Queensland Bachelor of Arts Review",
            "value": "UQ:276026",
            "index": 8
        }, {
            "text": "5th Australasian Congress on Applied Mechanics",
            "value": "UQ:131735",
            "index": 9
        }, {
            "text": "6th International Conference of Animal Health Information Specialists (ICAHIS) 2009",
            "value": "UQ:290441",
            "index": 10
        }]
};

describe('Component AdvancedSearchSelectField', () => {
    it('should render as expected', () => {
        const wrapper = setup({...props});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
