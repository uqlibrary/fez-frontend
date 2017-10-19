import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {VocabAutoSuggestField} from './VocabAutoSuggestField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';

const create = () => {
    const initialState = Immutable.Map();

    const store = {
        getState: jest.fn(() => (initialState)),
        dispatch: jest.fn(),
        subscribe: jest.fn()
    };
    const next = jest.fn();
    const invoke = (action) => thunk(store)(next)(action);
    return {store, next, invoke}
};

function setup({itemsList, onChange, actions, className, disabled = false, isShallow = true}){
    const props = {
        itemsList: itemsList || [],         // : PropTypes.array,
        onChange: onChange || jest.fn(),    // : PropTypes.func.isRequired,
        actions: actions || {loadOrgUnits: jest.fn()}, // : PropTypes.object.isRequired,
        disabled: disabled,     // PropTypes.bool
        className: className    //PropTypes.string,
        // onChange: PropTypes.func,
        // itemsList: PropTypes.array,
        // itemsListLoading: PropTypes.bool,
        // selectedValue: PropTypes.any,
        // vocabId: PropTypes.number,
        // dataSourceConfig: PropTypes.object,
        // locale: PropTypes.object,
    };

    if (!isShallow) {
        return mount(
            <Provider store={create().store}>
                <VocabAutoSuggestField {...props} />
            </Provider>, {
                context: {
                    muiTheme: getMuiTheme()
                },
                childContextTypes: {
                    muiTheme: PropTypes.object.isRequired
                }
            });
    }

    return shallow(<Provider store={create().store}><VocabAutoSuggestField {...props} /></Provider>);
}

beforeAll(() => {
    injectTapEventPlugin();
});

describe('VocabAutoSuggestField component', () => {

    it('should render', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with disabled flag set to true', () => {
        const wrapper = setup({disabled: true, isShallow: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with className set', () => {
        const wrapper = setup({className: 'requiredField', isShallow: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render autosuggest field and call action creator', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ actions: { loadOrgUnits: testFunction}, isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });

    it('should set selected value', () => {
        const wrapper = setup({}).find('VocabAutoSuggestField').dive();
        expect(wrapper.state.selectedValue).toBeFalsy();
        const testValue = 'School of Economics';
        wrapper.instance().valueSelected(testValue);
        expect(wrapper.state().selectedValue).toEqual(testValue);
    });

    it('should set typed value as selected value', () => {
        const wrapper = setup({}).find('VocabAutoSuggestField').dive();
        expect(wrapper.state.selectedValue).toBeFalsy();
        const testValue = 'School of Economics';
        wrapper.instance().textUpdated(testValue);
        expect(wrapper.state().selectedValue).toEqual(testValue);
    });

    it('should transform vocab list to auto suggest list', () => {
        const wrapper = setup({}).find('VocabAutoSuggestField').dive();
        const testList = [{
            "cvr_id": 5072,
            "cvr_parent_cvo_id": 453703,
            "cvr_child_cvo_id": 453957,
            "controlled_vocab": {
                "cvo_id": 453957,
                "cvo_title": "Office of Pro-Vice-Chancellor (Res Infrastructure)",
                "cvo_desc": null,
                "cvo_image_filename": null,
                "cvo_external_id": null,
                "cvo_hide": 0,
                "cvo_order": null,
                "cvo_lat": null,
                "cvo_long": null,
                "cvo_policy": null,
                "controlled_vocab_children": []
            }
        }, {
            "cvr_id": 5073,
            "cvr_parent_cvo_id": 453703,
            "cvr_child_cvo_id": 453958,
            "controlled_vocab": {
                "cvo_id": 453958,
                "cvo_title": "School of ",
                "cvo_desc": null,
                "cvo_image_filename": null,
                "cvo_external_id": null,
                "cvo_hide": 0,
                "cvo_order": null,
                "cvo_lat": null,
                "cvo_long": null,
                "cvo_policy": null,
                "controlled_vocab_children": []
            }}];
        const expectedList = ["Office of Pro-Vice-Chancellor (Res Infrastructure)", "School of "]
        wrapper.instance().componentWillReceiveProps({itemsList: testList});
        expect(wrapper.state().transformedItemsList).toEqual(expectedList);
    });

    it('should evaluate getValue() as per data source config', () => {
        const testItem = {
            "cvr_id": 4706,
            "cvr_parent_cvo_id": 453581,
            "cvr_child_cvo_id": 453582,
            "controlled_vocab": {
                "cvo_id": 453582,
                "cvo_title": "Research book (original research)",
                "cvo_desc": "",
                "cvo_image_filename": null,
                "cvo_external_id": null,
                "cvo_hide": 0,
                "cvo_order": 2,
                "cvo_lat": null,
                "cvo_long": null,
                "cvo_policy": null,
                "controlled_vocab_children": []
            }
        };
        const wrapper = setup({}).find('VocabAutoSuggestField').dive();
        // get data source config - default props available only for deep render
        const config = setup({isShallow: false}).find('VocabAutoSuggestField').props().dataSourceConfig.text;
        const expectedValue = testItem.controlled_vocab.cvo_title;
        const receivedValue = wrapper.instance().getValue(testItem, config);
        expect(receivedValue).toEqual(expectedValue);
    });

});
