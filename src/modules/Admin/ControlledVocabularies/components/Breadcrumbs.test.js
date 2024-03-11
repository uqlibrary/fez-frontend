import React from 'react';

import { render, userEvent } from 'test-utils';
import Breadcrumbs from './Breadcrumbs';

const setup = (testProps = {}, renderer = render) => {
    const props = {
        id: 'test',
        data: [],
        onBreadcrumbClick: jest.fn(),
        ...testProps,
    };
    return renderer(<Breadcrumbs {...props} />);
};

describe('Breadcrumbs', () => {
    it('should render empty', () => {
        const { getByTestId } = setup();
        expect(getByTestId('test')).toBeInTheDocument();
        expect(document.querySelector('[id=test] > ol').childNodes.length).toBe(0);
    });

    it('should render links', () => {
        const { getByTestId } = setup({
            data: [
                { id: 456997, title: 'AAAtest6' },
                { id: 456998, title: 'AAtest7' },
            ],
        });
        expect(document.querySelectorAll('li').length).toBe(3); // includes separator
        expect(getByTestId('nav-456997')).toHaveTextContent('AAAtest6');
        expect(getByTestId('nav-456997')).not.toHaveAttribute('disabled');
        expect(getByTestId('nav-456998')).toHaveTextContent('AAtest7');
        expect(getByTestId('nav-456998')).toHaveAttribute('disabled');
    });
    it('should render links and fire function when clicked', async () => {
        const mockFn = jest.fn();
        const { getByTestId } = setup({
            data: [
                { id: 456997, title: 'AAAtest6' },
                { id: 456998, title: 'AAtest7' },
            ],
            onBreadcrumbClick: mockFn,
        });
        expect(document.querySelectorAll('li').length).toBe(3); // includes separator
        expect(getByTestId('nav-456997')).toHaveTextContent('AAAtest6');
        await userEvent.click(getByTestId('nav-456997'));
        expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ id: 456997 }));

        expect(getByTestId('nav-456998')).toHaveTextContent('AAtest7');
        expect(getByTestId('nav-456998')).toHaveAttribute('disabled');
        await userEvent.click(getByTestId('nav-456998'));
        expect(mockFn).toHaveBeenCalledTimes(1); // shouldnt fire when disabled
    });
    it('should render links and fire function when clicked when last link is not disabled', async () => {
        const mockFn = jest.fn();
        const { getByTestId } = setup({
            data: [
                { id: 456997, title: 'AAAtest6' },
                { id: 456998, title: 'AAtest7' },
            ],
            onBreadcrumbClick: mockFn,
            disableLastPath: false,
        });
        expect(document.querySelectorAll('li').length).toBe(3); // includes separator
        expect(getByTestId('nav-456997')).toHaveTextContent('AAAtest6');
        await userEvent.click(getByTestId('nav-456997'));
        expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ id: 456997 }));

        expect(getByTestId('nav-456998')).toHaveTextContent('AAtest7');
        expect(getByTestId('nav-456998')).not.toHaveAttribute('disabled');
        await userEvent.click(getByTestId('nav-456998'));
        expect(mockFn).toHaveBeenLastCalledWith(expect.objectContaining({ id: 456998 }));
    });
});
