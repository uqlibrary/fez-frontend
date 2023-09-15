import React from 'react';
import GrantListEditorHeaderWithWidth, { GrantListEditorHeader } from './GrantListEditorHeader';
import { rtlRender, fireEvent } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        onDeleteAll: jest.fn(),
        // locale: {},
        disabled: false,
        width: '',
        hideType: false,
        ...testProps,
    };
    return rtlRender(<GrantListEditorHeader {...props} />);
}

describe('GrantListEditorHeader', () => {
    it('should render default view', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        const { container } = setup({ width: 'xs' });
        expect(container).toMatchSnapshot();
    });

    it('should render default mobile view', () => {
        const { container } = setup({ width: 'sm' });
        expect(container).toMatchSnapshot();
    });

    it('should hide grant agency type input', () => {
        const { container } = setup({ hideType: true });
        expect(container).toMatchSnapshot();
    });

    it('should use width hook', () => {
        const { container } = rtlRender(<GrantListEditorHeaderWithWidth />);
        expect(container).toMatchSnapshot();
    });

    it('should show confirmation box', () => {
        const { container, getByRole } = setup();
        fireEvent.click(getByRole('button'));
        expect(container).toMatchSnapshot();
    });
});
