import React from 'react';
import { AlternateIdentifierListEditor } from './AlternateIdentifierListEditor';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        listEditorId: 'alternate-identifier-list-editor',
        ...testProps,
    };
    return rtlRender(<AlternateIdentifierListEditor {...props} />);
}

describe('AlternateIdentifierListEditor component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
