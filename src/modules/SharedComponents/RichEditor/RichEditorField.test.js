import React from 'react';
import RichEditorField from './RichEditorField';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<RichEditorField {...props} />);
}

describe('RichEditorField', () => {
    it('should render default component', () => {
        const { container } = setup({ input: { onChange: jest.fn() } });
        expect(container).toMatchSnapshot();
    });
});
