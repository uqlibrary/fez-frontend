import React from 'react';
import GrantListEditorHeader from './GrantListEditorHeader';
import { rtlRender, fireEvent } from 'test-utils';

import * as Hook from 'hooks/useWidth';

function setup(testProps = {}) {
    const props = {
        onDeleteAll: jest.fn(),
        disabled: false,
        hideType: false,
        ...testProps,
    };
    return rtlRender(<GrantListEditorHeader {...props} />);
}

describe('GrantListEditorHeader', () => {
    const useWidth = jest.spyOn(Hook, 'useWidth');
    beforeEach(() => {
        useWidth.mockImplementation(() => 'lg');
    });

    it('should render with default props', () => {
        const { container } = rtlRender(<GrantListEditorHeader onDeleteAll={jest.fn()} />);
        expect(container).toMatchSnapshot();
    });

    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        useWidth.mockImplementation(() => 'xs');

        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        useWidth.mockImplementation(() => 'sm');
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should hide grant agency type input', () => {
        const { container } = setup({ hideType: true });
        expect(container).toMatchSnapshot();
    });

    it('should show confirmation box', () => {
        const { container, getByRole } = setup();
        fireEvent.click(getByRole('button'));
        expect(container).toMatchSnapshot();
    });
});
