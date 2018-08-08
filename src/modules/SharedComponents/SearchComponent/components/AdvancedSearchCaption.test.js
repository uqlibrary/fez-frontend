import AdvancedSearchCaption from './AdvancedSearchCaption';
import React from 'react';
function setup(testProps, isShallow = true) {
    const props = {
        fieldRows: [{"searchField":"all","value":"","label":""},{"searchField":"rek_ismemberof","value":["UQ:120743","UQ:217419","UQ:217422"],"label":""},{"searchField":"rek_author_id","value":"570","label":"570 (Ashkanasy, Neal M.)"}],
        docTypes: [263,174],
        yearFilter: {"from":"1991","to":"2012", invalid: false},
        isOpenAccess: true,
        ...testProps
    };
    return getElement(AdvancedSearchCaption, props, isShallow);
}

describe('Component AdvancedSearchCaption', () => {

    it('should render as expected', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should render as expected', () => {
        const wrapper = setup();
        const test = [
            {title: 'Title', value: 'value', combiner: 'combiner'},
            {title: 'Title 2', value: 'value 2', combiner: 'combiner 2'}
        ];
        const result = JSON.stringify([{"type":"span","key":"0","ref":null,"props":{"children":[{"type":"span","key":null,"ref":null,"props":{"className":"and","children":[" ",false]},"_owner":null,"_store":{}},{"type":"span","key":null,"ref":null,"props":{"className":"title","children":["Title"," "]},"_owner":null,"_store":{}},{"type":"span","key":null,"ref":null,"props":{"className":"combiner","children":[" ","combiner"," "]},"_owner":null,"_store":{}},{"type":"span","key":null,"ref":null,"props":{"className":"value","children":[" ","value"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}},{"type":"span","key":"1","ref":null,"props":{"children":[{"type":"span","key":null,"ref":null,"props":{"className":"and","children":[" "," AND "]},"_owner":null,"_store":{}},{"type":"span","key":null,"ref":null,"props":{"className":"title","children":["Title 2"," "]},"_owner":null,"_store":{}},{"type":"span","key":null,"ref":null,"props":{"className":"combiner","children":[" ","combiner 2"," "]},"_owner":null,"_store":{}},{"type":"span","key":null,"ref":null,"props":{"className":"value","children":[" ","value 2"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}]);
        expect(JSON.stringify(wrapper.instance().renderCaptions(test))).toEqual(result);
    });

});