import React from 'react';
import PartialDateForm from './PartialDateForm';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = { partialDateFormId: 'test', ...testProps };
    return rtlRender(<PartialDateForm {...props} />);
}

describe('PartialDateForm snapshots tests', () => {
    it('renders PartialDateForm component', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            onChange: () => {},
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('renders PartialDateForm component 2', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            className: 'requiredField',
            onChange: () => {},
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('renders PartialDateForm component 3', () => {
        const props = {
            name: 'partialDate',
            allowPartial: false,
            className: 'requiredField',
            onChange: () => {},
        };

        const { container } = setup(props);

        expect(container).toMatchSnapshot();
    });
});
