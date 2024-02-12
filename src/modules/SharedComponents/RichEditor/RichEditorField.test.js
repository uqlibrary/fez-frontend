import React from 'react';
import RichEditorField from './RichEditorField';
import { rtlRender } from 'test-utils';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

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
