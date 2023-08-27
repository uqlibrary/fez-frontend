import React from 'react';
import { rtlRender } from 'test-utils';
import { FreeTextListEditor } from './FreeTextListEditor';

function setup(testProps = {}) {
    const props = {
        listEditorId: 'free-text-list-editor',
        ...testProps,
    };
    return rtlRender(<FreeTextListEditor {...props} />);
}

describe('FreeTextListEditor component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });
});
