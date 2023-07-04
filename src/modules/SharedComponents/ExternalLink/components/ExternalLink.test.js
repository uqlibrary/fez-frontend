import React from 'react';
import { render, fireEvent } from 'test-utils';

import ExternalLink from './ExternalLink';

function setup(testProps = {}) {
    const props = {
        id: 'test',
        ...testProps,
    };
    return render(<ExternalLink {...props} />);
}

describe('ExternalLink test ', () => {
    it('should render component with open-in-new window icon class', () => {
        const { getByTestId } = setup({ href: 'www.google.com', text: 'Google' });
        expect(getByTestId('OpenInNewIcon')).toBeInTheDocument();
    });

    it('should render component without open-in-new window icon', () => {
        const { queryAllByTestId } = setup({ href: 'www.google.com', text: 'Google', openInNewIcon: false });
        expect(queryAllByTestId('OpenInNewIcon').length).toBe(0);
    });

    it('should render component without open-in-new window icon and open in a new sized window', () => {
        global.open = jest.fn();
        const { getByText } = setup({
            href: 'www.google.com',
            text: 'Google',
            openInNewIcon: false,
            width: 100,
            height: 100,
            children: 'Hello',
        });
        fireEvent.click(getByText('Hello'));
        expect(global.open).toHaveBeenCalledWith(
            'www.google.com',
            'targetWindow',
            'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=yes, width=100, height=100, top=100, left=100',
        );
    });
});
