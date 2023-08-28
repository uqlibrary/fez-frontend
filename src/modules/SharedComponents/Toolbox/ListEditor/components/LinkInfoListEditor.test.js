import React from 'react';
import { LinkInfoListEditor } from './LinkInfoListEditor';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        listEditorId: 'link-info-list-editor',
        ...testProps,
    };
    return rtlRender(<LinkInfoListEditor {...props} />);
}

describe('LinkInfoListEditor component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
