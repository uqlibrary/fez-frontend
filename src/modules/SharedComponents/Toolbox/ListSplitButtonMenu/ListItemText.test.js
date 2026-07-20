import React from 'react';
import { render as defaultRender } from 'test-utils';
import ListItemText from './ListItemText';
import { waitFor } from '@testing-library/dom';

const setup = (children = 'Test label', render = defaultRender) => {
    return render(<ListItemText>{children}</ListItemText>);
};

describe('ListItemText', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should render the children', () => {
        const { getByText } = setup();

        expect(getByText('Test label')).toBeInTheDocument();
    });

    it('should not set the title when the text does not overflow', () => {
        jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
        jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(100);

        const { getByText } = setup();

        expect(getByText('Test label')).not.toHaveAttribute('title');
    });

    it('should set the title when the text overflows', async () => {
        jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
        jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(200);

        const { container } = setup();

        await waitFor(() => {
            expect(container.querySelector('.MuiListItemText-root')).toHaveAttribute('title', 'Test label');
        });
    });

    it('should not measure non-string children', () => {
        const clientWidth = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get');
        const scrollWidth = jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get');

        setup(<span>Test label</span>);

        expect(clientWidth).not.toHaveBeenCalled();
        expect(scrollWidth).not.toHaveBeenCalled();
    });
});
