import React from 'react';
import LookupListEditor from './LookupListEditor';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        listEditorId: 'lookup-list-editor',
        ...testProps,
    };

    return rtlRender(<LookupListEditor {...props} />);
}

describe('LookupListEditor', () => {
    it('should render default component', () => {
        const { container } = setup({ input: { onChange: jest.fn() } });
        expect(container).toMatchSnapshot();
    });
});
