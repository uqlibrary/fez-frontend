import React from 'react';
import PartialDateField from './PartialDateField';
import { rtlRender } from 'test-utils';

function setup(testProps) {
    const props = {
        classes: {
            fakeTitle: {},
        },
        partialDateFieldId: 'test',
        ...testProps,
    };
    return rtlRender(<PartialDateField {...props} />);
}

describe('Field PartialDateField snapshots tests', () => {
    it('renders PartialDateField component', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            input: {
                onChange: () => {},
            },
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('renders PartialDateField component with requiredField class on year field', () => {
        const props = {
            name: 'partialDate',
            allowPartial: true,
            className: 'requiredField',
            input: {
                onChange: () => {},
            },
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });

    it('renders PartialDateField component with requiredField class on all fields', () => {
        const props = {
            name: 'partialDate',
            allowPartial: false,
            className: 'requiredField',
            input: {
                onChange: () => {},
            },
        };

        const { container } = setup(props);
        expect(container).toMatchSnapshot();
    });
});
