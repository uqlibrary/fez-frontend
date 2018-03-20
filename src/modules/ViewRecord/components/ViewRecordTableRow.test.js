import React from 'react';
import ViewRecordTableRow from './ViewRecordTableRow';
import {journalArticle} from 'mock/data/testing/records';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        heading: testProps.match || '',
        data: testProps.actions || ''
    };
    return getElement(ViewRecordTableRow, props, isShallow);
}

describe('ViewRecordTableRow Component', () => {
    it('should render with default props', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with jsx', () => {
        const wrapper = setup({data: <div>shall render this</div>});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with array', () => {
        const wrapper = setup({data: ['shall render this']});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with string', () => {
        const wrapper = setup({data: 'shall render this'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
