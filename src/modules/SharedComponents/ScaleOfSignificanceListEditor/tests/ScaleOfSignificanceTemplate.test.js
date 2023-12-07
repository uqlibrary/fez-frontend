import React from 'react';
import { ScaleOfSignificanceTemplate } from '../ScaleOfSignificanceTemplate';
import { rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        item: {
            id: 0,
            scaleValue: null,
            signifValue: {},
            author: {
                rek_author: '',
            },
        },
        ...testProps,
    };
    return rtlRender(<ScaleOfSignificanceTemplate {...props} />);
}

describe('ScaleOfSignificanceTemplate component', () => {
    it('should render default view', () => {
        const { container } = setup({});
        expect(container).toMatchSnapshot();
    });

    it('should render with author name', () => {
        const { container } = setup({
            item: {
                id: 0,
                key: null,
                scaleValue: 454027,
                signifValue: {
                    htmlText: '<p>A creative statement</p>',
                },
                author: {
                    rek_author: 'Joe Smith',
                },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
