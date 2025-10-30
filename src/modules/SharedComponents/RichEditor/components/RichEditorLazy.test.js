import React from 'react';
import { render, waitFor } from '@testing-library/react';
import RichEditorLazy from './RichEditorLazy';

// Mock the LazyLoadSuspense component
jest.mock('modules/SharedComponents/LazyLoadSuspense', () => {
    return function LazyLoadSuspense({ children }) {
        return <div data-testid="lazy-load-suspense">{children}</div>;
    };
});

describe('RichEditorLazy', () => {
    it('should render the lazy-loaded RichEditor', async () => {
        const mockOnChange = jest.fn();
        const { container } = render(<RichEditorLazy onChange={mockOnChange} richEditorId="test-editor" />);

        await waitFor(() => {
            expect(container.querySelector('#test-editor')).toBeInTheDocument();
        });
    });
});
