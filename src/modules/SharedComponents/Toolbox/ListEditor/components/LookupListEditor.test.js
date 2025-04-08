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
        const { container } = setup({ onChange: jest.fn() });
        expect(container).toMatchSnapshot();
    });
    describe('error message handling', () => {
        it('should render string error', () => {
            const { container } = setup({ onChange: jest.fn(), meta: { error: 'A string error' } });
            expect(container).toMatchSnapshot();
        });
        it('should render object error', () => {
            const { container } = setup({
                onChange: jest.fn(),
                meta: { error: { message: 'An error from an object' } },
            });
            expect(container).toMatchSnapshot();
        });
        it('should forward empty string if unexpected value', () => {
            const { container } = setup({
                onChange: jest.fn(),
                meta: { error: { errorText: 'Invalid error object' } },
            });
            expect(container).toMatchSnapshot();
        });
    });
});
